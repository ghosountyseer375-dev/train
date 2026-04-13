/**
 * SMEMS - Smart Medical Equipment Management System
 * Main JavaScript File
 */

// ==================== GLOBAL STATE ====================
let currentPage = 'dashboard';
let currentModal = null;

// ==================== UTILITY FUNCTIONS ====================

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusText(status) {
    const statusMap = {
        'operational': 'يعمل',
        'maintenance': 'قيد الصيانة',
        'out_of_service': 'خارج الخدمة',
        'pending': 'قيد الانتظار',
        'in_progress': 'قيد التنفيذ',
        'completed': 'مكتمل'
    };
    return statusMap[status] || status;
}

function getRiskLevelText(level) {
    const levelMap = {
        'critical': 'حرج',
        'high': 'عالي',
        'medium': 'متوسط',
        'low': 'منخفض'
    };
    return levelMap[level] || level;
}

function getRiskLevelClass(level) {
    const classMap = {
        'critical': 'badge-danger',
        'high': 'badge-warning',
        'medium': 'badge-info',
        'low': 'badge-secondary'
    };
    return classMap[level] || 'badge-secondary';
}

function getPriorityText(priority) {
    const priorityMap = {
        'critical': 'حرج',
        'high': 'عالي',
        'medium': 'متوسط',
        'low': 'منخفض'
    };
    return priorityMap[priority] || priority;
}

function getPriorityClass(priority) {
    const classMap = {
        'critical': 'badge-danger',
        'high': 'badge-warning',
        'medium': 'badge-info',
        'low': 'badge-secondary'
    };
    return classMap[priority] || 'badge-secondary';
}

function getDepartmentText(dept) {
    const deptMap = {
        'cardiology': 'قسم القلب',
        'radiology': 'قسم الأشعة',
        'icu': 'العناية المركزة',
        'emergency': 'الطوارئ',
        'surgery': 'الجراحة',
        'laboratory': 'المختبر',
        'all': 'جميع الأقسام'
    };
    return deptMap[dept] || dept;
}

function getRoleText(role) {
    const roleMap = {
        'admin': 'مدير النظام',
        'medical_staff': 'الطاقم الطبي',
        'engineer': 'مهندس الصيانة',
        'inventory_manager': 'مدير المخزون'
    };
    return roleMap[role] || role;
}

function getIssueTypeText(type) {
    const typeMap = {
        'electrical': 'كهربائي',
        'mechanical': 'ميكانيكي',
        'software': 'برمجي',
        'calibration': 'معايرة',
        'other': 'أخرى'
    };
    return typeMap[type] || type;
}

function showToast(message, type = 'info') {
    const toast = $('#toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function togglePassword() {
    const passwordInput = $('#password');
    const eyeIcon = $('.toggle-password .eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

// ==================== LOGIN PAGE ====================

function initLoginPage() {
    const loginForm = $('#loginForm');
    if (!loginForm) return;
    
    // Check if already logged in
    if (AuthAPI.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = $('#username').value;
        const password = $('#password').value;
        const role = $('#role').value;
        const department = $('#department').value;
        
        if (!username || !password || !role || !department) {
            showToast('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>';
        
        try {
            const result = await AuthAPI.login(username, password, role, department);
            
            if (result.success) {
                showToast('تم تسجيل الدخول بنجاح', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
            } else {
                showToast(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            showToast('حدث خطأ أثناء تسجيل الدخول', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>تسجيل الدخول</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>';
        }
    });
}

// ==================== DASHBOARD INITIALIZATION ====================

async function initDashboard() {
    // Check authentication
    if (!AuthAPI.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = AuthAPI.getCurrentUser();
    
    // Update header user info
    updateHeaderUserInfo(user);
    
    // Setup sidebar based on role
    setupSidebar(user.role);
    
    // Setup event listeners
    setupEventListeners();
    
    // Load notifications
    await loadNotifications();
    
    // Load initial page based on role
    await loadPageByRole(user.role);
}

function updateHeaderUserInfo(user) {
    const userName = $('#userName');
    const userRole = $('#userRole');
    const userAvatar = $('#userAvatar');
    const sidebarUserName = $('#sidebarUserName');
    const sidebarUserRole = $('#sidebarUserRole');
    
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = getRoleText(user.role);
    if (userAvatar) userAvatar.textContent = user.name.charAt(0);
    if (sidebarUserName) sidebarUserName.textContent = user.name;
    if (sidebarUserRole) sidebarUserRole.textContent = getDepartmentText(user.department);
}

function setupSidebar(role) {
    const sidebarNav = $('#sidebarNav');
    if (!sidebarNav) return;
    
    let navItems = '';
    
    // Common items
    navItems += `
        <div class="nav-section">
            <div class="nav-section-title">الرئيسية</div>
            <div class="nav-item active" data-page="dashboard" onclick="navigateTo('dashboard')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span>لوحة التحكم</span>
            </div>
        </div>
    `;
    
    // Role-specific items
    if (role === 'medical_staff' || role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">المعدات</div>
                <div class="nav-item" data-page="devices" onclick="navigateTo('devices')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span>الأجهزة الطبية</span>
                </div>
            </div>
        `;
    }
    
    if (role === 'engineer' || role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">الصيانة</div>
                <div class="nav-item" data-page="maintenance" onclick="navigateTo('maintenance')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    <span>طلبات الصيانة</span>
                    <span class="nav-badge" id="maintenanceBadge">0</span>
                </div>
            </div>
        `;
    }
    
    if (role === 'inventory_manager' || role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">المخزون</div>
                <div class="nav-item" data-page="inventory" onclick="navigateTo('inventory')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    <span>المخزون</span>
                </div>
            </div>
        `;
    }
    
    if (role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">الإدارة</div>
                <div class="nav-item" data-page="reports" onclick="navigateTo('reports')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span>التقارير</span>
                </div>
                <div class="nav-item" data-page="analytics" onclick="navigateTo('analytics')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    <span>التحليلات</span>
                </div>
            </div>
        `;
    }
    
    // Notifications for all
    navItems += `
        <div class="nav-section">
            <div class="nav-section-title">أخرى</div>
            <div class="nav-item" data-page="notifications" onclick="navigateTo('notifications')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span>الإشعارات</span>
                <span class="nav-badge" id="notificationsBadge">0</span>
            </div>
        </div>
    `;
    
    sidebarNav.innerHTML = navItems;
    
    // Update maintenance badge
    updateMaintenanceBadge();
}

async function updateMaintenanceBadge() {
    const badge = $('#maintenanceBadge');
    if (!badge) return;
    
    const result = await MaintenanceAPI.getByStatus('pending');
    if (result.success) {
        badge.textContent = result.data.length;
        badge.style.display = result.data.length > 0 ? 'inline' : 'none';
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = $('#menuToggle');
    const sidebar = $('#sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
    
    // Notification button
    const notificationBtn = $('#notificationBtn');
    const notificationsDropdown = $('#notificationsDropdown');
    
    if (notificationBtn && notificationsDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!notificationsDropdown.contains(e.target)) {
                notificationsDropdown.classList.remove('active');
            }
        });
    }
    
    // User dropdown
    const userDropdownBtn = $('#userDropdownBtn');
    const userDropdownMenu = $('#userDropdownMenu');
    
    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!userDropdownMenu.contains(e.target)) {
                userDropdownMenu.classList.remove('active');
            }
        });
    }
    
    // Logout button
    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Modal close on overlay click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentModal) {
            closeModal();
        }
    });
}

async function handleLogout() {
    await AuthAPI.logout();
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ==================== NAVIGATION ====================

async function navigateTo(page) {
    currentPage = page;
    
    // Update active nav item
    $$('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Close mobile sidebar
    $('#sidebar')?.classList.remove('mobile-open');
    
    // Load page content
    const pageContent = $('#pageContent');
    if (!pageContent) return;
    
    pageContent.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    
    switch (page) {
        case 'dashboard':
            await loadDashboardPage();
            break;
        case 'devices':
            await loadDevicesPage();
            break;
        case 'maintenance':
            await loadMaintenancePage();
            break;
        case 'inventory':
            await loadInventoryPage();
            break;
        case 'reports':
            await loadReportsPage();
            break;
        case 'analytics':
            await loadAnalyticsPage();
            break;
        case 'notifications':
            await loadNotificationsPage();
            break;
        default:
            await loadDashboardPage();
    }
}

async function loadPageByRole(role) {
    await navigateTo('dashboard');
}

// ==================== NOTIFICATIONS ====================

async function loadNotifications() {
    const result = await NotificationsAPI.getUnreadCount();
    const badge = $('#notificationBadge');
    const sidebarBadge = $('#notificationsBadge');
    
    if (result.success) {
        if (badge) {
            badge.textContent = result.data;
            badge.style.display = result.data > 0 ? 'flex' : 'none';
        }
        if (sidebarBadge) {
            sidebarBadge.textContent = result.data;
            sidebarBadge.style.display = result.data > 0 ? 'inline' : 'none';
        }
    }
    
    // Load notifications list
    await loadNotificationsList();
}

async function loadNotificationsList() {
    const notificationsList = $('#notificationsList');
    if (!notificationsList) return;
    
    const result = await NotificationsAPI.getForUser();
    
    if (result.success && result.data.length > 0) {
        notificationsList.innerHTML = result.data.slice(0, 5).map(n => `
            <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}')">
                <div class="notification-icon ${n.type}">
                    ${getNotificationIcon(n.type)}
                </div>
                <div class="notification-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <div class="notification-time">${formatDateTime(n.date)}</div>
                </div>
            </div>
        `).join('');
    } else {
        notificationsList.innerHTML = '<div class="empty-state"><p>لا توجد إشعارات</p></div>';
    }
}

function getNotificationIcon(type) {
    const icons = {
        maintenance: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        inventory: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>',
        device: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    };
    return icons[type] || icons.device;
}

async function markNotificationRead(id) {
    await NotificationsAPI.markAsRead(id);
    await loadNotifications();
}

async function markAllNotificationsRead() {
    await NotificationsAPI.markAllAsRead();
    await loadNotifications();
    showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
}

// ==================== DASHBOARD PAGE ====================

async function loadDashboardPage() {
    const user = AuthAPI.getCurrentUser();
    const pageContent = $('#pageContent');
    
    let content = '';
    
    switch (user.role) {
        case 'medical_staff':
            content = await getMedicalStaffDashboard(user);
            break;
        case 'engineer':
            content = await getEngineerDashboard();
            break;
        case 'inventory_manager':
            content = await getInventoryManagerDashboard();
            break;
        case 'admin':
            content = await getAdminDashboard();
            break;
        default:
            content = '<p>لوحة تحكم غير معروفة</p>';
    }
    
    pageContent.innerHTML = content;
}

async function getMedicalStaffDashboard(user) {
    const statsResult = await DevicesAPI.getStatistics(user.department);
    const stats = statsResult.data;
    
    const devicesResult = await DevicesAPI.getByDepartment(user.department);
    const devices = devicesResult.data;
    
    return `
        <div class="page-header mb-6">
            <h2>مرحباً، ${user.name}</h2>
            <p class="text-muted">قسم ${getDepartmentText(user.department)}</p>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-icon primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.total}</h3>
                    <p>إجمالي الأجهزة</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.operational}</h3>
                    <p>يعمل</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.maintenance}</h3>
                    <p>قيد الصيانة</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.outOfService}</h3>
                    <p>خارج الخدمة</p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    أجهزة القسم
                </h3>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('devices')">
                    عرض الكل
                </button>
            </div>
            <div class="card-body">
                <div class="filters-bar">
                    <div class="search-input">
                        <input type="text" id="dashboardDeviceSearch" placeholder="بحث عن جهاز..." onkeyup="filterDashboardDevices()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <div class="filter-group">
                        <label>الحالة:</label>
                        <select id="dashboardStatusFilter" onchange="filterDashboardDevices()">
                            <option value="all">الكل</option>
                            <option value="operational">يعمل</option>
                            <option value="maintenance">قيد الصيانة</option>
                            <option value="out_of_service">خارج الخدمة</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>مستوى الخطورة:</label>
                        <select id="dashboardRiskFilter" onchange="filterDashboardDevices()">
                            <option value="all">الكل</option>
                            <option value="critical">حرج</option>
                            <option value="high">عالي</option>
                            <option value="medium">متوسط</option>
                            <option value="low">منخفض</option>
                        </select>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="table" id="dashboardDevicesTable">
                        <thead>
                            <tr>
                                <th>اسم الجهاز</th>
                                <th>الرقم التسلسلي</th>
                                <th>الحالة</th>
                                <th>مستوى الخطورة</th>
                                <th>آخر صيانة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${devices.map(device => `
                                <tr data-device='${JSON.stringify(device)}'>
                                    <td><strong>${device.name}</strong></td>
                                    <td>${device.serialNumber}</td>
                                    <td><span class="status-dot ${device.status}">${getStatusText(device.status)}</span></td>
                                    <td><span class="badge ${getRiskLevelClass(device.riskLevel)}">${getRiskLevelText(device.riskLevel)}</span></td>
                                    <td>${formatDate(device.lastMaintenance)}</td>
                                    <td class="table-actions">
                                        <button class="btn btn-ghost btn-sm" onclick="showDeviceDetails('${device.id}')" data-tooltip="تفاصيل">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                        </button>
                                        <button class="btn btn-warning btn-sm" onclick="showMaintenanceRequestModal('${device.id}')" data-tooltip="طلب صيانة">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function getEngineerDashboard() {
    const statsResult = await MaintenanceAPI.getStatistics();
    const stats = statsResult.data;
    
    const requestsResult = await MaintenanceAPI.getAll();
    const requests = requestsResult.data.filter(r => r.status !== 'completed');
    
    return `
        <div class="page-header mb-6">
            <h2>لوحة تحكم الصيانة</h2>
            <p class="text-muted">إدارة طلبات الصيانة</p>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-icon primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.total}</h3>
                    <p>إجمالي الطلبات</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.pending}</h3>
                    <p>قيد الانتظار</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.inProgress}</h3>
                    <p>قيد التنفيذ</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.completed}</h3>
                    <p>مكتملة</p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">طلبات الصيانة النشطة</h3>
            </div>
            <div class="card-body">
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>الجهاز</th>
                                <th>المشكلة</th>
                                <th>الأولوية</th>
                                <th>الحالة</th>
                                <th>تاريخ الطلب</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${requests.map(req => `
                                <tr>
                                    <td>
                                        <strong>${req.deviceName}</strong>
                                        <br><small class="text-muted">${req.serialNumber}</small>
                                    </td>
                                    <td>${req.description.substring(0, 50)}...</td>
                                    <td><span class="badge ${getPriorityClass(req.priority)}">${getPriorityText(req.priority)}</span></td>
                                    <td><span class="badge ${req.status === 'pending' ? 'badge-warning' : 'badge-info'}">${getStatusText(req.status)}</span></td>
                                    <td>${formatDate(req.requestDate)}</td>
                                    <td class="table-actions">
                                        ${req.status === 'pending' ? `
                                            <button class="btn btn-primary btn-sm" onclick="startMaintenance('${req.id}')">
                                                بدء
                                            </button>
                                        ` : ''}
                                        ${req.status === 'in_progress' ? `
                                            <button class="btn btn-success btn-sm" onclick="showCompleteMaintenanceModal('${req.id}')">
                                                إكمال
                                            </button>
                                        ` : ''}
                                        <button class="btn btn-ghost btn-sm" onclick="showMaintenanceDetails('${req.id}')">
                                            تفاصيل
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${requests.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">لا توجد طلبات صيانة نشطة</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function getInventoryManagerDashboard() {
    const statsResult = await InventoryAPI.getStatistics();
    const stats = statsResult.data;
    
    const lowStockResult = await InventoryAPI.getLowStock();
    const lowStock = lowStockResult.data;
    
    return `
        <div class="page-header mb-6">
            <h2>لوحة تحكم المخزون</h2>
            <p class="text-muted">إدارة قطع الغيار والمستلزمات</p>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-icon primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.totalItems}</h3>
                    <p>إجمالي الأصناف</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.totalValue.toLocaleString()} ر.س</h3>
                    <p>قيمة المخزون</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.okStockCount}</h3>
                    <p>مخزون كافي</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${stats.lowStockCount}</h3>
                    <p>مخزون منخفض</p>
                </div>
            </div>
        </div>
        
        ${lowStock.length > 0 ? `
        <div class="card mb-6">
            <div class="card-header">
                <h3 class="card-title text-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    تنبيه: أصناف بمخزون منخفض
                </h3>
            </div>
            <div class="card-body">
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>الصنف</th>
                                <th>الفئة</th>
                                <th>الكمية الحالية</th>
                                <th>الحد الأدنى</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowStock.map(item => `
                                <tr>
                                    <td><strong>${item.name}</strong></td>
                                    <td>${item.category}</td>
                                    <td><span class="text-danger font-bold">${item.quantity}</span> ${item.unit}</td>
                                    <td>${item.minQuantity} ${item.unit}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="showRestockModal('${item.id}')">
                                            إعادة تعبئة
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">توزيع المخزون حسب الفئة</h3>
            </div>
            <div class="card-body">
                <div class="bar-chart" id="categoryChart">
                    ${stats.byCategory.map(cat => `
                        <div class="bar-item">
                            <div class="bar-value">${cat.count}</div>
                            <div class="bar" style="height: ${Math.max(20, (cat.count / stats.totalItems) * 150)}px;"></div>
                            <div class="bar-label">${cat.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

async function getAdminDashboard() {
    const deviceStats = await DevicesAPI.getStatistics('all');
    const maintenanceStats = await MaintenanceAPI.getStatistics();
    const inventoryStats = await InventoryAPI.getStatistics();
    
    return `
        <div class="page-header mb-6">
            <h2>لوحة التحكم الرئيسية</h2>
            <p class="text-muted">نظرة عامة على النظام</p>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-icon primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${deviceStats.data.total}</h3>
                    <p>إجمالي الأجهزة</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${maintenanceStats.data.pending}</h3>
                    <p>طلبات صيانة معلقة</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${inventoryStats.data.lowStockCount}</h3>
                    <p>أصناف منخفضة</p>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="kpi-content">
                    <h3>${deviceStats.data.operational}</h3>
                    <p>أجهزة تعمل</p>
                </div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">حالة الأجهزة</h3>
                </div>
                <div class="card-body">
                    <div class="bar-chart">
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.operational}</div>
                            <div class="bar" style="height: ${Math.max(20, (deviceStats.data.operational / deviceStats.data.total) * 150)}px; background: linear-gradient(to top, #10b981, #34d399);"></div>
                            <div class="bar-label">يعمل</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.maintenance}</div>
                            <div class="bar" style="height: ${Math.max(20, (deviceStats.data.maintenance / deviceStats.data.total) * 150)}px; background: linear-gradient(to top, #f59e0b, #fbbf24);"></div>
                            <div class="bar-label">صيانة</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.outOfService}</div>
                            <div class="bar" style="height: ${Math.max(20, (deviceStats.data.outOfService / deviceStats.data.total) * 150)}px; background: linear-gradient(to top, #ef4444, #f87171);"></div>
                            <div class="bar-label">معطل</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">طلبات الصيانة</h3>
                </div>
                <div class="card-body">
                    <div class="bar-chart">
                        <div class="bar-item">
                            <div class="bar-value">${maintenanceStats.data.pending}</div>
                            <div class="bar" style="height: ${Math.max(20, (maintenanceStats.data.pending / Math.max(maintenanceStats.data.total, 1)) * 150)}px; background: linear-gradient(to top, #f59e0b, #fbbf24);"></div>
                            <div class="bar-label">معلق</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${maintenanceStats.data.inProgress}</div>
                            <div class="bar" style="height: ${Math.max(20, (maintenanceStats.data.inProgress / Math.max(maintenanceStats.data.total, 1)) * 150)}px; background: linear-gradient(to top, #3b82f6, #60a5fa);"></div>
                            <div class="bar-label">قيد التنفيذ</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${maintenanceStats.data.completed}</div>
                            <div class="bar" style="height: ${Math.max(20, (maintenanceStats.data.completed / Math.max(maintenanceStats.data.total, 1)) * 150)}px; background: linear-gradient(to top, #10b981, #34d399);"></div>
                            <div class="bar-label">مكتمل</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function filterDashboardDevices() {
    const searchTerm = $('#dashboardDeviceSearch')?.value.toLowerCase() || '';
    const statusFilter = $('#dashboardStatusFilter')?.value || 'all';
    const riskFilter = $('#dashboardRiskFilter')?.value || 'all';
    
    const rows = $$('#dashboardDevicesTable tbody tr');
    
    rows.forEach(row => {
        const device = JSON.parse(row.dataset.device || '{}');
        
        const matchesSearch = device.name?.toLowerCase().includes(searchTerm) || 
                             device.serialNumber?.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
        const matchesRisk = riskFilter === 'all' || device.riskLevel === riskFilter;
        
        row.style.display = matchesSearch && matchesStatus && matchesRisk ? '' : 'none';
    });
}

// ==================== DEVICES PAGE ====================

async function loadDevicesPage() {
    const user = AuthAPI.getCurrentUser();
    const department = user.role === 'admin' ? 'all' : user.department;
    
    const result = await DevicesAPI.getByDepartment(department);
    const devices = result.data;
    
    const pageContent = $('#pageContent');
    pageContent.innerHTML = `
        <div class="page-header mb-6" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>الأجهزة الطبية</h2>
                <p class="text-muted">${user.role === 'admin' ? 'جميع الأقسام' : 'قسم ' + getDepartmentText(user.department)}</p>
            </div>
            ${user.role === 'admin' ? `
                <button class="btn btn-primary" onclick="showAddDeviceModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    إضافة جهاز
                </button>
            ` : ''}
        </div>
        
        <div class="card">
            <div class="card-body">
                <div class="filters-bar">
                    <div class="search-input">
                        <input type="text" id="deviceSearch" placeholder="بحث عن جهاز..." onkeyup="filterDevices()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    ${user.role === 'admin' ? `
                        <div class="filter-group">
                            <label>القسم:</label>
                            <select id="deviceDeptFilter" onchange="filterDevices()">
                                <option value="all">الكل</option>
                                <option value="cardiology">قسم القلب</option>
                                <option value="radiology">قسم الأشعة</option>
                                <option value="icu">العناية المركزة</option>
                                <option value="emergency">الطوارئ</option>
                                <option value="surgery">الجراحة</option>
                                <option value="laboratory">المختبر</option>
                            </select>
                        </div>
                    ` : ''}
                    <div class="filter-group">
                        <label>الحالة:</label>
                        <select id="deviceStatusFilter" onchange="filterDevices()">
                            <option value="all">الكل</option>
                            <option value="operational">يعمل</option>
                            <option value="maintenance">قيد الصيانة</option>
                            <option value="out_of_service">خارج الخدمة</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>مستوى الخطورة:</label>
                        <select id="deviceRiskFilter" onchange="filterDevices()">
                            <option value="all">الكل</option>
                            <option value="critical">حرج</option>
                            <option value="high">عالي</option>
                            <option value="medium">متوسط</option>
                            <option value="low">منخفض</option>
                        </select>
                    </div>
                </div>
                
                <div class="table-wrapper">
                    <table class="table" id="devicesTable">
                        <thead>
                            <tr>
                                <th>اسم الجهاز</th>
                                <th>الرقم التسلسلي</th>
                                ${user.role === 'admin' ? '<th>القسم</th>' : ''}
                                <th>الحالة</th>
                                <th>مستوى الخطورة</th>
                                <th>آخر صيانة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="devicesTableBody">
                            ${renderDevicesTable(devices, user.role)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Store devices for filtering
    window.allDevices = devices;
}

function renderDevicesTable(devices, userRole) {
    if (devices.length === 0) {
        return `<tr><td colspan="${userRole === 'admin' ? 7 : 6}" class="text-center text-muted">لا توجد أجهزة</td></tr>`;
    }
    
    return devices.map(device => `
        <tr data-device='${JSON.stringify(device)}'>
            <td>
                <strong>${device.name}</strong>
                <br><small class="text-muted">${device.manufacturer} - ${device.model}</small>
            </td>
            <td>${device.serialNumber}</td>
            ${userRole === 'admin' ? `<td>${getDepartmentText(device.department)}</td>` : ''}
            <td><span class="status-dot ${device.status}">${getStatusText(device.status)}</span></td>
            <td><span class="badge ${getRiskLevelClass(device.riskLevel)}">${getRiskLevelText(device.riskLevel)}</span></td>
            <td>${formatDate(device.lastMaintenance)}</td>
            <td class="table-actions">
                <button class="btn btn-ghost btn-sm" onclick="showDeviceDetails('${device.id}')" data-tooltip="تفاصيل">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="btn btn-warning btn-sm" onclick="showMaintenanceRequestModal('${device.id}')" data-tooltip="طلب صيانة">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </button>
                ${userRole === 'admin' ? `
                    <button class="btn btn-danger btn-sm" onclick="deleteDevice('${device.id}')" data-tooltip="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function filterDevices() {
    const user = AuthAPI.getCurrentUser();
    const searchTerm = $('#deviceSearch')?.value.toLowerCase() || '';
    const deptFilter = $('#deviceDeptFilter')?.value || 'all';
    const statusFilter = $('#deviceStatusFilter')?.value || 'all';
    const riskFilter = $('#deviceRiskFilter')?.value || 'all';
    
    let filtered = window.allDevices || [];
    
    if (searchTerm) {
        filtered = filtered.filter(d => 
            d.name.toLowerCase().includes(searchTerm) || 
            d.serialNumber.toLowerCase().includes(searchTerm) ||
            d.manufacturer.toLowerCase().includes(searchTerm)
        );
    }
    
    if (deptFilter !== 'all') {
        filtered = filtered.filter(d => d.department === deptFilter);
    }
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(d => d.status === statusFilter);
    }
    
    if (riskFilter !== 'all') {
        filtered = filtered.filter(d => d.riskLevel === riskFilter);
    }
    
    $('#devicesTableBody').innerHTML = renderDevicesTable(filtered, user.role);
}

async function showDeviceDetails(deviceId) {
    const result = await DevicesAPI.getById(deviceId);
    if (!result.success) {
        showToast('حدث خطأ أثناء جلب تفاصيل الجهاز', 'error');
        return;
    }
    
    const device = result.data;
    const historyResult = await MaintenanceAPI.getHistory(deviceId);
    const history = historyResult.data || [];
    
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                تفاصيل الجهاز
            </h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <p class="text-muted text-sm">اسم الجهاز</p>
                    <p class="font-semibold">${device.name}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الرقم التسلسلي</p>
                    <p class="font-semibold">${device.serialNumber}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الشركة المصنعة</p>
                    <p class="font-semibold">${device.manufacturer}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الموديل</p>
                    <p class="font-semibold">${device.model}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">تاريخ الشراء</p>
                    <p class="font-semibold">${formatDate(device.purchaseDate)}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">انتهاء الضمان</p>
                    <p class="font-semibold">${formatDate(device.warrantyExpiry)}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الحالة</p>
                    <p><span class="status-dot ${device.status}">${getStatusText(device.status)}</span></p>
                </div>
                <div>
                    <p class="text-muted text-sm">مستوى الخطورة</p>
                    <p><span class="badge ${getRiskLevelClass(device.riskLevel)}">${getRiskLevelText(device.riskLevel)}</span></p>
                </div>
                <div>
                    <p class="text-muted text-sm">القسم</p>
                    <p class="font-semibold">${getDepartmentText(device.department)}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الموقع</p>
                    <p class="font-semibold">${device.location || '-'}</p>
                </div>
            </div>
            
            <h4 class="font-semibold mb-3">سجل الصيانة</h4>
            ${history.length > 0 ? `
                <div class="timeline">
                    ${history.map(h => `
                        <div class="timeline-item">
                            <div class="timeline-date">${formatDate(h.date)}</div>
                            <div class="timeline-title">${h.type}</div>
                            <div class="timeline-desc">${h.notes} - ${h.technician}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-muted">لا يوجد سجل صيانة</p>'}
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
            <button class="btn btn-warning" onclick="closeModal(); showMaintenanceRequestModal('${device.id}')">طلب صيانة</button>
        </div>
    `, 'modal-lg');
}

async function showAddDeviceModal() {
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">إضافة جهاز جديد</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <form id="addDeviceForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">اسم الجهاز</label>
                        <input type="text" class="form-control" name="name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">الرقم التسلسلي</label>
                        <input type="text" class="form-control" name="serialNumber" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">الشركة المصنعة</label>
                        <input type="text" class="form-control" name="manufacturer" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">الموديل</label>
                        <input type="text" class="form-control" name="model" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">الفئة</label>
                        <select class="form-control" name="category" required>
                            <option value="">اختر الفئة</option>
                            <option value="تشخيصي">تشخيصي</option>
                            <option value="تصوير">تصوير</option>
                            <option value="مراقبة">مراقبة</option>
                            <option value="دعم الحياة">دعم الحياة</option>
                            <option value="طوارئ">طوارئ</option>
                            <option value="علاجي">علاجي</option>
                            <option value="مختبر">مختبر</option>
                            <option value="تخدير">تخدير</option>
                            <option value="أثاث طبي">أثاث طبي</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">القسم</label>
                        <select class="form-control" name="department" required>
                            <option value="">اختر القسم</option>
                            <option value="cardiology">قسم القلب</option>
                            <option value="radiology">قسم الأشعة</option>
                            <option value="icu">العناية المركزة</option>
                            <option value="emergency">الطوارئ</option>
                            <option value="surgery">الجراحة</option>
                            <option value="laboratory">المختبر</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">مستوى الخطورة</label>
                        <select class="form-control" name="riskLevel" required>
                            <option value="">اختر المستوى</option>
                            <option value="critical">حرج</option>
                            <option value="high">عالي</option>
                            <option value="medium">متوسط</option>
                            <option value="low">منخفض</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الموقع</label>
                        <input type="text" class="form-control" name="location" placeholder="مثال: غرفة 101">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">تاريخ الشراء</label>
                        <input type="date" class="form-control" name="purchaseDate">
                    </div>
                    <div class="form-group">
                        <label class="form-label">تاريخ انتهاء الضمان</label>
                        <input type="date" class="form-control" name="warrantyExpiry">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-control" name="notes" rows="3"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-primary" onclick="addDevice()">إضافة</button>
        </div>
    `, 'modal-lg');
}

async function addDevice() {
    const form = $('#addDeviceForm');
    const formData = new FormData(form);
    
    const deviceData = {
        name: formData.get('name'),
        serialNumber: formData.get('serialNumber'),
        manufacturer: formData.get('manufacturer'),
        model: formData.get('model'),
        category: formData.get('category'),
        department: formData.get('department'),
        riskLevel: formData.get('riskLevel'),
        location: formData.get('location'),
        purchaseDate: formData.get('purchaseDate'),
        warrantyExpiry: formData.get('warrantyExpiry'),
        notes: formData.get('notes')
    };
    
    if (!deviceData.name || !deviceData.serialNumber || !deviceData.department || !deviceData.riskLevel) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const result = await DevicesAPI.create(deviceData);
    
    if (result.success) {
        showToast('تمت إضافة الجهاز بنجاح', 'success');
        closeModal();
        await loadDevicesPage();
    } else {
        showToast('حدث خطأ أثناء إضافة الجهاز', 'error');
    }
}

async function deleteDevice(deviceId) {
    if (!confirm('هل أنت متأكد من حذف هذا الجهاز؟')) return;
    
    const result = await DevicesAPI.delete(deviceId);
    
    if (result.success) {
        showToast('تم حذف الجهاز بنجاح', 'success');
        await loadDevicesPage();
    } else {
        showToast('حدث خطأ أثناء حذف الجهاز', 'error');
    }
}

// ==================== MAINTENANCE REQUEST MODAL ====================

async function showMaintenanceRequestModal(deviceId) {
    const result = await DevicesAPI.getById(deviceId);
    if (!result.success) {
        showToast('حدث خطأ أثناء جلب بيانات الجهاز', 'error');
        return;
    }
    
    const device = result.data;
    
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                طلب صيانة
            </h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <form id="maintenanceRequestForm">
                <input type="hidden" name="deviceId" value="${device.id}">
                <input type="hidden" name="deviceName" value="${device.name}">
                <input type="hidden" name="serialNumber" value="${device.serialNumber}">
                <input type="hidden" name="department" value="${device.department}">
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">اسم الجهاز</label>
                        <input type="text" class="form-control" value="${device.name}" disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الرقم التسلسلي</label>
                        <input type="text" class="form-control" value="${device.serialNumber}" disabled>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">القسم</label>
                    <input type="text" class="form-control" value="${getDepartmentText(device.department)}" disabled>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">نوع المشكلة</label>
                        <select class="form-control" name="issueType" required>
                            <option value="">اختر نوع المشكلة</option>
                            <option value="electrical">كهربائي</option>
                            <option value="mechanical">ميكانيكي</option>
                            <option value="software">برمجي</option>
                            <option value="calibration">معايرة</option>
                            <option value="other">أخرى</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">الأولوية</label>
                        <select class="form-control" name="priority" required>
                            <option value="">اختر الأولوية</option>
                            <option value="critical">حرج - يؤثر على سلامة المرضى</option>
                            <option value="high">عالي - يؤثر على العمل</option>
                            <option value="medium">متوسط - يمكن الانتظار</option>
                            <option value="low">منخفض - صيانة وقائية</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">وصف المشكلة</label>
                    <textarea class="form-control" name="description" rows="4" placeholder="اشرح المشكلة بالتفصيل..." required></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">هل يوجد جهاز بديل متاح؟</label>
                    <div class="radio-group">
                        <label class="radio-item">
                            <input type="radio" name="hasAlternative" value="true">
                            نعم
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="hasAlternative" value="false" checked>
                            لا
                        </label>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-primary" onclick="submitMaintenanceRequest()">إرسال الطلب</button>
        </div>
    `);
}

async function submitMaintenanceRequest() {
    const form = $('#maintenanceRequestForm');
    const formData = new FormData(form);
    
    const requestData = {
        deviceId: formData.get('deviceId'),
        deviceName: formData.get('deviceName'),
        serialNumber: formData.get('serialNumber'),
        department: formData.get('department'),
        issueType: formData.get('issueType'),
        priority: formData.get('priority'),
        description: formData.get('description'),
        hasAlternative: formData.get('hasAlternative') === 'true'
    };
    
    if (!requestData.issueType || !requestData.priority || !requestData.description) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const result = await MaintenanceAPI.create(requestData);
    
    if (result.success) {
        showToast('تم إرسال طلب الصيانة بنجاح', 'success');
        closeModal();
        await updateMaintenanceBadge();
        
        // Refresh page if on devices or dashboard
        if (currentPage === 'devices' || currentPage === 'dashboard') {
            await navigateTo(currentPage);
        }
    } else {
        showToast('حدث خطأ أثناء إرسال الطلب', 'error');
    }
}

// ==================== MAINTENANCE PAGE ====================

async function loadMaintenancePage() {
    const result = await MaintenanceAPI.getAll();
    const requests = result.data;
    
    const pageContent = $('#pageContent');
    pageContent.innerHTML = `
        <div class="page-header mb-6">
            <h2>طلبات الصيانة</h2>
            <p class="text-muted">إدارة ومتابعة طلبات الصيانة</p>
        </div>
        
        <div class="tabs mb-4">
            <button class="tab-btn active" onclick="filterMaintenanceByStatus('all', this)">الكل (${requests.length})</button>
            <button class="tab-btn" onclick="filterMaintenanceByStatus('pending', this)">قيد الانتظار (${requests.filter(r => r.status === 'pending').length})</button>
            <button class="tab-btn" onclick="filterMaintenanceByStatus('in_progress', this)">قيد التنفيذ (${requests.filter(r => r.status === 'in_progress').length})</button>
            <button class="tab-btn" onclick="filterMaintenanceByStatus('completed', this)">مكتملة (${requests.filter(r => r.status === 'completed').length})</button>
        </div>
        
        <div class="card">
            <div class="card-body">
                <div class="table-wrapper">
                    <table class="table" id="maintenanceTable">
                        <thead>
                            <tr>
                                <th>رقم الطلب</th>
                                <th>الجهاز</th>
                                <th>نوع المشكلة</th>
                                <th>الأولوية</th>
                                <th>الحالة</th>
                                <th>تاريخ الطلب</th>
                                <th>المكلف</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="maintenanceTableBody">
                            ${renderMaintenanceTable(requests)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    window.allMaintenanceRequests = requests;
}

function renderMaintenanceTable(requests) {
    if (requests.length === 0) {
        return '<tr><td colspan="8" class="text-center text-muted">لا توجد طلبات صيانة</td></tr>';
    }
    
    return requests.map(req => `
        <tr data-status="${req.status}">
            <td><strong>${req.id}</strong></td>
            <td>
                ${req.deviceName}
                <br><small class="text-muted">${req.serialNumber}</small>
            </td>
            <td>${getIssueTypeText(req.issueType)}</td>
            <td><span class="badge ${getPriorityClass(req.priority)}">${getPriorityText(req.priority)}</span></td>
            <td><span class="badge ${req.status === 'completed' ? 'badge-success' : req.status === 'in_progress' ? 'badge-info' : 'badge-warning'}">${getStatusText(req.status)}</span></td>
            <td>${formatDate(req.requestDate)}</td>
            <td>${req.assignedTo || '-'}</td>
            <td class="table-actions">
                ${req.status === 'pending' ? `
                    <button class="btn btn-primary btn-sm" onclick="startMaintenance('${req.id}')">بدء</button>
                ` : ''}
                ${req.status === 'in_progress' ? `
                    <button class="btn btn-success btn-sm" onclick="showCompleteMaintenanceModal('${req.id}')">إكمال</button>
                ` : ''}
                <button class="btn btn-ghost btn-sm" onclick="showMaintenanceDetails('${req.id}')">تفاصيل</button>
            </td>
        </tr>
    `).join('');
}

function filterMaintenanceByStatus(status, btn) {
    // Update active tab
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter table
    const rows = $$('#maintenanceTable tbody tr');
    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

async function startMaintenance(requestId) {
    const result = await MaintenanceAPI.updateStatus(requestId, 'in_progress');
    
    if (result.success) {
        showToast('تم بدء الصيانة', 'success');
        await loadMaintenancePage();
        await updateMaintenanceBadge();
    } else {
        showToast('حدث خطأ', 'error');
    }
}

async function showCompleteMaintenanceModal(requestId) {
    const inventoryResult = await InventoryAPI.getAll();
    const inventory = inventoryResult.data;
    
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">إكمال الصيانة</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <form id="completeMaintenanceForm">
                <input type="hidden" name="requestId" value="${requestId}">
                
                <div class="form-group">
                    <label class="form-label">ملاحظات الصيانة</label>
                    <textarea class="form-control" name="notes" rows="4" placeholder="اكتب ملاحظات الصيانة وما تم إنجازه..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">القطع المستخدمة (اختياري)</label>
                    <select class="form-control" id="partSelect">
                        <option value="">اختر قطعة من المخزون</option>
                        ${inventory.map(item => `<option value="${item.id}" data-name="${item.name}">${item.name} (${item.quantity} متوفر)</option>`).join('')}
                    </select>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <input type="number" class="form-control" id="partQuantity" placeholder="الكمية" min="1" style="width: 100px;">
                        <button type="button" class="btn btn-secondary" onclick="addPartToList()">إضافة</button>
                    </div>
                    <div id="partsList" style="margin-top: 1rem;"></div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-success" onclick="completeMaintenance()">إكمال الصيانة</button>
        </div>
    `);
    
    window.selectedParts = [];
}

function addPartToList() {
    const select = $('#partSelect');
    const quantity = parseInt($('#partQuantity').value);
    
    if (!select.value || !quantity || quantity < 1) {
        showToast('اختر قطعة وحدد الكمية', 'error');
        return;
    }
    
    const partName = select.options[select.selectedIndex].dataset.name;
    
    window.selectedParts.push({
        itemId: select.value,
        name: partName,
        quantity: quantity
    });
    
    renderPartsList();
    select.value = '';
    $('#partQuantity').value = '';
}

function renderPartsList() {
    const container = $('#partsList');
    container.innerHTML = window.selectedParts.map((part, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--gray-100); border-radius: var(--radius); margin-bottom: 0.5rem;">
            <span>${part.name} (${part.quantity})</span>
            <button type="button" class="btn btn-ghost btn-sm" onclick="removePart(${index})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
    `).join('');
}

function removePart(index) {
    window.selectedParts.splice(index, 1);
    renderPartsList();
}

async function completeMaintenance() {
    const form = $('#completeMaintenanceForm');
    const formData = new FormData(form);
    
    const requestId = formData.get('requestId');
    const notes = formData.get('notes');
    
    // Add parts used if any
    if (window.selectedParts && window.selectedParts.length > 0) {
        await MaintenanceAPI.addPartsUsed(requestId, window.selectedParts);
    }
    
    const result = await MaintenanceAPI.updateStatus(requestId, 'completed', notes);
    
    if (result.success) {
        showToast('تم إكمال الصيانة بنجاح', 'success');
        closeModal();
        await loadMaintenancePage();
        await updateMaintenanceBadge();
    } else {
        showToast('حدث خطأ', 'error');
    }
}

async function showMaintenanceDetails(requestId) {
    const result = await MaintenanceAPI.getById(requestId);
    if (!result.success) {
        showToast('حدث خطأ', 'error');
        return;
    }
    
    const req = result.data;
    
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">تفاصيل طلب الصيانة</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                    <p class="text-muted text-sm">رقم الطلب</p>
                    <p class="font-semibold">${req.id}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الحالة</p>
                    <p><span class="badge ${req.status === 'completed' ? 'badge-success' : req.status === 'in_progress' ? 'badge-info' : 'badge-warning'}">${getStatusText(req.status)}</span></p>
                </div>
                <div>
                    <p class="text-muted text-sm">الجهاز</p>
                    <p class="font-semibold">${req.deviceName}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الرقم التسلسلي</p>
                    <p class="font-semibold">${req.serialNumber}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">نوع المشكلة</p>
                    <p class="font-semibold">${getIssueTypeText(req.issueType)}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">الأولوية</p>
                    <p><span class="badge ${getPriorityClass(req.priority)}">${getPriorityText(req.priority)}</span></p>
                </div>
                <div>
                    <p class="text-muted text-sm">مقدم الطلب</p>
                    <p class="font-semibold">${req.requestedBy}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">تاريخ الطلب</p>
                    <p class="font-semibold">${formatDate(req.requestDate)}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">المكلف</p>
                    <p class="font-semibold">${req.assignedTo || '-'}</p>
                </div>
                <div>
                    <p class="text-muted text-sm">تاريخ البدء</p>
                    <p class="font-semibold">${formatDate(req.startDate)}</p>
                </div>
                ${req.status === 'completed' ? `
                <div>
                    <p class="text-muted text-sm">تاريخ الإكمال</p>
                    <p class="font-semibold">${formatDate(req.completedDate)}</p>
                </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 1.5rem;">
                <p class="text-muted text-sm">الوصف</p>
                <p>${req.description}</p>
            </div>
            
            ${req.notes ? `
            <div style="margin-top: 1rem;">
                <p class="text-muted text-sm">ملاحظات</p>
                <p>${req.notes}</p>
            </div>
            ` : ''}
            
            ${req.partsUsed && req.partsUsed.length > 0 ? `
            <div style="margin-top: 1rem;">
                <p class="text-muted text-sm">القطع المستخدمة</p>
                <ul>
                    ${req.partsUsed.map(p => `<li>${p.name} (${p.quantity})</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `);
}

// ==================== INVENTORY PAGE ====================

async function loadInventoryPage() {
    const result = await InventoryAPI.getAll();
    const inventory = result.data;
    
    const pageContent = $('#pageContent');
    pageContent.innerHTML = `
        <div class="page-header mb-6" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>إدارة المخزون</h2>
                <p class="text-muted">قطع الغيار والمستلزمات</p>
            </div>
            <button class="btn btn-primary" onclick="showAddInventoryModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                إضافة صنف
            </button>
        </div>
        
        <div class="card">
            <div class="card-body">
                <div class="filters-bar">
                    <div class="search-input">
                        <input type="text" id="inventorySearch" placeholder="بحث..." onkeyup="filterInventory()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <div class="filter-group">
                        <label>حالة المخزون:</label>
                        <select id="inventoryStockFilter" onchange="filterInventory()">
                            <option value="all">الكل</option>
                            <option value="low">منخفض</option>
                            <option value="ok">كافي</option>
                        </select>
                    </div>
                </div>
                
                <div class="table-wrapper">
                    <table class="table" id="inventoryTable">
                        <thead>
                            <tr>
                                <th>الصنف</th>
                                <th>الفئة</th>
                                <th>الكمية</th>
                                <th>الحد الأدنى</th>
                                <th>الحالة</th>
                                <th>آخر تعبئة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="inventoryTableBody">
                            ${renderInventoryTable(inventory)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    window.allInventory = inventory;
}

function renderInventoryTable(inventory) {
    if (inventory.length === 0) {
        return '<tr><td colspan="7" class="text-center text-muted">لا توجد أصناف</td></tr>';
    }
    
    return inventory.map(item => {
        const isLow = item.quantity <= item.minQuantity;
        return `
            <tr data-item='${JSON.stringify(item)}'>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td><span class="${isLow ? 'text-danger font-bold' : ''}">${item.quantity}</span> ${item.unit}</td>
                <td>${item.minQuantity} ${item.unit}</td>
                <td><span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">${isLow ? 'منخفض' : 'كافي'}</span></td>
                <td>${formatDate(item.lastRestocked)}</td>
                <td class="table-actions">
                    <button class="btn btn-primary btn-sm" onclick="showRestockModal('${item.id}')">تعبئة</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInventoryItem('${item.id}')">حذف</button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterInventory() {
    const searchTerm = $('#inventorySearch')?.value.toLowerCase() || '';
    const stockFilter = $('#inventoryStockFilter')?.value || 'all';
    
    let filtered = window.allInventory || [];
    
    if (searchTerm) {
        filtered = filtered.filter(i => 
            i.name.toLowerCase().includes(searchTerm) || 
            i.category.toLowerCase().includes(searchTerm)
        );
    }
    
    if (stockFilter === 'low') {
        filtered = filtered.filter(i => i.quantity <= i.minQuantity);
    } else if (stockFilter === 'ok') {
        filtered = filtered.filter(i => i.quantity > i.minQuantity);
    }
    
    $('#inventoryTableBody').innerHTML = renderInventoryTable(filtered);
}

function showAddInventoryModal() {
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">إضافة صنف جديد</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <form id="addInventoryForm">
                <div class="form-group">
                    <label class="form-label required">اسم الصنف</label>
                    <input type="text" class="form-control" name="name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">الفئة</label>
                        <select class="form-control" name="category" required>
                            <option value="">اختر الفئة</option>
                            <option value="بطاريات">بطاريات</option>
                            <option value="كابلات">كابلات</option>
                            <option value="فلاتر">فلاتر</option>
                            <option value="مسابر">مسابر</option>
                            <option value="مستهلكات">مستهلكات</option>
                            <option value="قطع غيار">قطع غيار</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">الوحدة</label>
                        <input type="text" class="form-control" name="unit" placeholder="مثال: قطعة، عبوة، رزمة" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">الكمية</label>
                        <input type="number" class="form-control" name="quantity" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">الحد الأدنى</label>
                        <input type="number" class="form-control" name="minQuantity" min="1" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">السعر</label>
                        <input type="number" class="form-control" name="price" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label class="form-label">المورد</label>
                        <input type="text" class="form-control" name="supplier">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-primary" onclick="addInventoryItem()">إضافة</button>
        </div>
    `);
}

async function addInventoryItem() {
    const form = $('#addInventoryForm');
    const formData = new FormData(form);
    
    const itemData = {
        name: formData.get('name'),
        category: formData.get('category'),
        unit: formData.get('unit'),
        quantity: parseInt(formData.get('quantity')),
        minQuantity: parseInt(formData.get('minQuantity')),
        price: parseFloat(formData.get('price')) || 0,
        supplier: formData.get('supplier')
    };
    
    if (!itemData.name || !itemData.category || !itemData.unit) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const result = await InventoryAPI.create(itemData);
    
    if (result.success) {
        showToast('تمت إضافة الصنف بنجاح', 'success');
        closeModal();
        await loadInventoryPage();
    } else {
        showToast('حدث خطأ', 'error');
    }
}

function showRestockModal(itemId) {
    const item = window.allInventory?.find(i => i.id === itemId);
    if (!item) return;
    
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">إعادة تعبئة المخزون</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <p class="mb-4">إعادة تعبئة: <strong>${item.name}</strong></p>
            <p class="mb-4">الكمية الحالية: <strong>${item.quantity} ${item.unit}</strong></p>
            
            <div class="form-group">
                <label class="form-label required">الكمية المضافة</label>
                <input type="number" class="form-control" id="restockQuantity" min="1" required>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-primary" onclick="restockItem('${itemId}')">تعبئة</button>
        </div>
    `);
}

async function restockItem(itemId) {
    const quantity = parseInt($('#restockQuantity').value);
    
    if (!quantity || quantity < 1) {
        showToast('يرجى إدخال كمية صحيحة', 'error');
        return;
    }
    
    const result = await InventoryAPI.restock(itemId, quantity);
    
    if (result.success) {
        showToast('تمت إعادة التعبئة بنجاح', 'success');
        closeModal();
        await loadInventoryPage();
    } else {
        showToast('حدث خطأ', 'error');
    }
}

async function deleteInventoryItem(itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return;
    
    const result = await InventoryAPI.delete(itemId);
    
    if (result.success) {
        showToast('تم حذف الصنف بنجاح', 'success');
        await loadInventoryPage();
    } else {
        showToast('حدث خطأ', 'error');
    }
}

// ==================== REPORTS PAGE ====================

async function loadReportsPage() {
    const pageContent = $('#pageContent');
    pageContent.innerHTML = `
        <div class="page-header mb-6">
            <h2>التقارير</h2>
            <p class="text-muted">إنشاء وتصدير التقارير</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-body text-center" style="padding: 2rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); margin-bottom: 1rem;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <h3 class="mb-2">تقرير الأجهزة</h3>
                    <p class="text-muted mb-4">قائمة بجميع الأجهزة وحالتها</p>
                    <button class="btn btn-primary" onclick="showExportModal('devices')">تصدير التقرير</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body text-center" style="padding: 2rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--warning-color); margin-bottom: 1rem;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    <h3 class="mb-2">تقرير الصيانة</h3>
                    <p class="text-muted mb-4">سجل طلبات الصيانة</p>
                    <button class="btn btn-primary" onclick="showExportModal('maintenance')">تصدير التقرير</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body text-center" style="padding: 2rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success-color); margin-bottom: 1rem;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                    <h3 class="mb-2">تقرير المخزون</h3>
                    <p class="text-muted mb-4">حالة المخزون والأصناف</p>
                    <button class="btn btn-primary" onclick="showExportModal('inventory')">تصدير التقرير</button>
                </div>
            </div>
        </div>
    `;
}

function showExportModal(reportType) {
    const titles = {
        devices: 'تقرير الأجهزة',
        maintenance: 'تقرير الصيانة',
        inventory: 'تقرير المخزون'
    };
    
    showModal(`
        <div class="modal-header">
            <h3 class="modal-title">تصدير ${titles[reportType]}</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal-body">
            <form id="exportForm">
                <input type="hidden" name="reportType" value="${reportType}">
                
                ${reportType !== 'inventory' ? `
                <div class="form-group">
                    <label class="form-label">القسم</label>
                    <select class="form-control" name="department">
                        <option value="all">جميع الأقسام</option>
                        <option value="cardiology">قسم القلب</option>
                        <option value="radiology">قسم الأشعة</option>
                        <option value="icu">العناية المركزة</option>
                        <option value="emergency">الطوارئ</option>
                        <option value="surgery">الجراحة</option>
                        <option value="laboratory">المختبر</option>
                    </select>
                </div>
                ` : ''}
                
                ${reportType === 'devices' ? `
                <div class="form-group">
                    <label class="form-label">الحالة</label>
                    <select class="form-control" name="status">
                        <option value="all">الكل</option>
                        <option value="operational">يعمل</option>
                        <option value="maintenance">قيد الصيانة</option>
                        <option value="out_of_service">خارج الخدمة</option>
                    </select>
                </div>
                ` : ''}
                
                ${reportType === 'maintenance' ? `
                <div class="form-group">
                    <label class="form-label">الحالة</label>
                    <select class="form-control" name="status">
                        <option value="all">الكل</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="completed">مكتملة</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">من تاريخ</label>
                        <input type="date" class="form-control" name="dateFrom">
                    </div>
                    <div class="form-group">
                        <label class="form-label">إلى تاريخ</label>
                        <input type="date" class="form-control" name="dateTo">
                    </div>
                </div>
                ` : ''}
                
                ${reportType === 'inventory' ? `
                <div class="form-group">
                    <label class="form-label">حالة المخزون</label>
                    <select class="form-control" name="stockStatus">
                        <option value="all">الكل</option>
                        <option value="low">منخفض</option>
                        <option value="ok">كافي</option>
                    </select>
                </div>
                ` : ''}
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-primary" onclick="exportReport()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                تصدير CSV
            </button>
        </div>
    `);
}

async function exportReport() {
    const form = $('#exportForm');
    const formData = new FormData(form);
    
    const reportType = formData.get('reportType');
    const filters = {
        department: formData.get('department'),
        status: formData.get('status'),
        dateFrom: formData.get('dateFrom'),
        dateTo: formData.get('dateTo'),
        stockStatus: formData.get('stockStatus')
    };
    
    let result;
    let filename;
    
    switch (reportType) {
        case 'devices':
            result = await ReportsAPI.generateDevicesReport(filters);
            filename = 'تقرير_الأجهزة';
            break;
        case 'maintenance':
            result = await ReportsAPI.generateMaintenanceReport(filters);
            filename = 'تقرير_الصيانة';
            break;
        case 'inventory':
            result = await ReportsAPI.generateInventoryReport(filters);
            filename = 'تقرير_المخزون';
            break;
    }
    
    if (result.success && result.data.length > 0) {
        ReportsAPI.exportToCSV(result.data, filename);
        showToast('تم تصدير التقرير بنجاح', 'success');
        closeModal();
    } else {
        showToast('لا توجد بيانات للتصدير', 'warning');
    }
}

// ==================== ANALYTICS PAGE ====================

async function loadAnalyticsPage() {
    const deviceStats = await DevicesAPI.getStatistics('all');
    const maintenanceStats = await MaintenanceAPI.getStatistics();
    const inventoryStats = await InventoryAPI.getStatistics();
    const usageAnalytics = await InventoryAPI.getUsageAnalytics();
    
    const pageContent = $('#pageContent');
    pageContent.innerHTML = `
        <div class="page-header mb-6">
            <h2>التحليلات</h2>
            <p class="text-muted">إحصائيات ورسوم بيانية</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">توزيع حالة الأجهزة</h3>
                </div>
                <div class="card-body">
                    <div class="bar-chart">
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.operational}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.operational / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #10b981, #34d399);"></div>
                            <div class="bar-label">يعمل</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.maintenance}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.maintenance / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #f59e0b, #fbbf24);"></div>
                            <div class="bar-label">صيانة</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.outOfService}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.outOfService / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #ef4444, #f87171);"></div>
                            <div class="bar-label">معطل</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">مستوى خطورة الأجهزة</h3>
                </div>
                <div class="card-body">
                    <div class="bar-chart">
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.byRiskLevel.critical}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.byRiskLevel.critical / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #ef4444, #f87171);"></div>
                            <div class="bar-label">حرج</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.byRiskLevel.high}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.byRiskLevel.high / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #f59e0b, #fbbf24);"></div>
                            <div class="bar-label">عالي</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.byRiskLevel.medium}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.byRiskLevel.medium / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #3b82f6, #60a5fa);"></div>
                            <div class="bar-label">متوسط</div>
                        </div>
                        <div class="bar-item">
                            <div class="bar-value">${deviceStats.data.byRiskLevel.low}</div>
                            <div class="bar" style="height: ${Math.max(30, (deviceStats.data.byRiskLevel.low / deviceStats.data.total) * 180)}px; background: linear-gradient(to top, #6b7280, #9ca3af);"></div>
                            <div class="bar-label">منخفض</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">أكثر الأصناف استخداماً</h3>
                </div>
                <div class="card-body">
                    ${usageAnalytics.data.mostUsed.length > 0 ? `
                        <div class="bar-chart">
                            ${usageAnalytics.data.mostUsed.map(item => `
                                <div class="bar-item">
                                    <div class="bar-value">${item.totalUsage}</div>
                                    <div class="bar" style="height: ${Math.max(30, (item.totalUsage / Math.max(...usageAnalytics.data.mostUsed.map(i => i.totalUsage))) * 150)}px;"></div>
                                    <div class="bar-label" style="font-size: 0.7rem;">${item.name.substring(0, 15)}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-center text-muted">لا توجد بيانات استخدام</p>'}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ملخص المخزون</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: var(--radius);">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${inventoryStats.data.totalItems}</div>
                            <div class="text-muted">إجمالي الأصناف</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: var(--radius);">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${inventoryStats.data.totalValue.toLocaleString()}</div>
                            <div class="text-muted">قيمة المخزون (ر.س)</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: var(--success-light); border-radius: var(--radius);">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${inventoryStats.data.okStockCount}</div>
                            <div class="text-muted">مخزون كافي</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: var(--danger-light); border-radius: var(--radius);">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--danger-color);">${inventoryStats.data.lowStockCount}</div>
                            <div class="text-muted">مخزون منخفض</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== NOTIFICATIONS PAGE ====================

async function loadNotificationsPage() {
    const result = await NotificationsAPI.getForUser();
    const notifications = result.data;
    
    const pageContent = $('#pageContent');
    pageContent.innerHTML = `
        <div class="page-header mb-6" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>الإشعارات</h2>
                <p class="text-muted">جميع الإشعارات الخاصة بك</p>
            </div>
            <button class="btn btn-secondary" onclick="markAllNotificationsRead()">
                تحديد الكل كمقروء
            </button>
        </div>
        
        <div class="card">
            <div class="card-body">
                ${notifications.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${notifications.map(n => `
                            <div class="notification-item ${n.read ? '' : 'unread'}" style="border-radius: var(--radius); border: 1px solid var(--gray-200);" onclick="markNotificationRead('${n.id}')">
                                <div class="notification-icon ${n.type}">
                                    ${getNotificationIcon(n.type)}
                                </div>
                                <div class="notification-content" style="flex: 1;">
                                    <h4>${n.title}</h4>
                                    <p>${n.message}</p>
                                    <div class="notification-time">${formatDateTime(n.date)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                        <h3>لا توجد إشعارات</h3>
                        <p>ستظهر هنا الإشعارات الجديدة</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// ==================== MODAL FUNCTIONS ====================

function showModal(content, size = '') {
    // Remove existing modal if any
    const existingModal = $('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `<div class="modal ${size}">${content}</div>`;
    
    document.body.appendChild(modalOverlay);
    
    // Trigger animation
    requestAnimationFrame(() => {
        modalOverlay.classList.add('active');
    });
    
    currentModal = modalOverlay;
}

function closeModal() {
    if (currentModal) {
        currentModal.classList.remove('active');
        setTimeout(() => {
            currentModal.remove();
            currentModal = null;
        }, 200);
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    if (document.body.classList.contains('login-page')) {
        initLoginPage();
    } else {
        initDashboard();
    }
});
