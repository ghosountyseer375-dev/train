/**
 * SMEMS - Smart Medical Equipment Management System
 * Main JavaScript File
 */

// ==================== GLOBAL STATE ====================
let currentPage = 'dashboard';
let currentModal = null;
let charts = {};

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
        'working': 'يعمل',
        'maintenance': 'قيد الصيانة',
        'out_of_service': 'خارج الخدمة',
        'pending': 'قيد الانتظار',
        'in_progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'scheduled': 'مجدول',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'operational': 'badge-success',
        'working': 'badge-success',
        'maintenance': 'badge-warning',
        'out_of_service': 'badge-danger',
        'pending': 'badge-warning',
        'in_progress': 'badge-info',
        'completed': 'badge-success',
        'scheduled': 'badge-secondary',
        'cancelled': 'badge-danger'
    };
    return classMap[status] || 'badge-secondary';
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
        'inventory_manager': 'أمين المخزون'
    };
    return roleMap[role] || role;
}

function getIssueTypeText(type) {
    const typeMap = {
        'electrical': 'كهربائي',
        'mechanical': 'ميكانيكي',
        'software': 'برمجي',
        'calibration': 'معايرة',
        'malfunction': 'خلل تشغيل',
        'damage': 'تلف',
        'inspection': 'فحص',
        'filter': 'فلاتر',
        'other': 'أخرى'
    };
    return typeMap[type] || type;
}

function getMaintenanceTypeText(type) {
    const typeMap = {
        'corrective': 'تصحيحية',
        'preventive': 'وقائية',
        'calibration': 'معايرة',
        'inspection': 'فحص'
    };
    return typeMap[type] || type;
}

function showToast(message, type = 'info') {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const loader = $('#loadingState');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== AUTHENTICATION ====================

function checkAuth() {
    if (!AuthAPI.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function logout() {
    AuthAPI.logout();
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ==================== DASHBOARD INITIALIZATION ====================

function initDashboard() {
    if (!checkAuth()) return;
    
    const user = AuthAPI.getCurrentUser();
    
    // Update header user info
    updateHeaderUserInfo(user);
    
    // Setup sidebar based on role
    setupSidebar(user.role);
    
    // Setup event listeners
    setupEventListeners();
    
    // Load notifications
    loadNotifications();
    
    // Load dashboard content based on role
    loadDashboardContent(user);
}

function updateHeaderUserInfo(user) {
    const userName = $('#userName');
    const userRole = $('#userRole');
    const userAvatar = $('#userAvatar');
    const sidebarUserName = $('#sidebarUserName');
    const sidebarUserRole = $('#sidebarUserRole');
    const sidebarUserAvatar = $('#sidebarUserAvatar');
    
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = getRoleText(user.role);
    if (userAvatar) userAvatar.textContent = user.name.charAt(0);
    if (sidebarUserName) sidebarUserName.textContent = user.name;
    if (sidebarUserRole) sidebarUserRole.textContent = getDepartmentText(user.department);
    if (sidebarUserAvatar) sidebarUserAvatar.textContent = user.name.charAt(0);
}

function setupSidebar(role) {
    const sidebarNav = $('#sidebarNav');
    if (!sidebarNav) return;
    
    let navItems = '';
    
    // Dashboard - Common for all
    navItems += `
        <div class="nav-section">
            <div class="nav-section-title">الرئيسية</div>
            <a href="dashboard.html" class="nav-item active" data-page="dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span>لوحة التحكم</span>
            </a>
        </div>
    `;
    
    // Devices - For all except inventory manager (read-only for inventory)
    if (role !== 'inventory_manager') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">الأجهزة</div>
                <a href="devices.html" class="nav-item" data-page="devices">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span>الأجهزة الطبية</span>
                </a>
            </div>
        `;
    }
    
    // My Requests - For Medical Staff only
    if (role === 'medical_staff') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">طلباتي</div>
                <a href="my-requests.html" class="nav-item" data-page="my-requests">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                    <span>طلبات الصيانة</span>
                </a>
            </div>
        `;
    }
    
    // Maintenance - For Engineer and Admin
    if (role === 'engineer' || role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">الصيانة</div>
                <a href="maintenance.html" class="nav-item" data-page="maintenance">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    <span>إدارة الصيانة</span>
                    <span class="nav-badge" id="maintenanceBadge">0</span>
                </a>
            </div>
        `;
        
        // Update maintenance badge
        const pending = MAINTENANCE_REQUESTS.filter(m => m.status === 'pending').length;
        setTimeout(() => {
            const badge = $('#maintenanceBadge');
            if (badge) {
                badge.textContent = pending;
                badge.style.display = pending > 0 ? 'inline' : 'none';
            }
        }, 100);
    }
    
    // Inventory - For Inventory Manager, Engineer, and Admin
    if (role === 'inventory_manager' || role === 'engineer' || role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">المخزون</div>
                <a href="inventory.html" class="nav-item" data-page="inventory">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    <span>المخزون</span>
                </a>
            </div>
        `;
    }
    
    // Reports - For Admin and Engineer
    if (role === 'admin' || role === 'engineer') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">التقارير</div>
                <a href="reports.html" class="nav-item" data-page="reports">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span>التقارير</span>
                </a>
            </div>
        `;
    }
    
    // Admin section
    if (role === 'admin') {
        navItems += `
            <div class="nav-section">
                <div class="nav-section-title">الإدارة</div>
                <a href="admin.html" class="nav-item" data-page="admin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>إدارة المستخدمين</span>
                </a>
            </div>
        `;
    }
    
    // Logout for all
    navItems += `
        <div class="nav-section">
            <div class="nav-section-title">الحساب</div>
            <div class="nav-item logout-nav" onclick="logout()">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>تسجيل الخروج</span>
            </div>
        </div>
    `;
    
    sidebarNav.innerHTML = navItems;
    
    // Highlight current page
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    $$('.nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
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
            if (!sidebar.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
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
    
    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentModal) {
            closeModal(currentModal);
        }
    });
}

// ==================== NOTIFICATIONS ====================

function loadNotifications() {
    const result = NotificationsAPI.getUnreadCount();
    const badge = $('#notificationBadge');
    
    if (result.success && badge) {
        badge.textContent = result.data;
        badge.style.display = result.data > 0 ? 'flex' : 'none';
    }
    
    // Load notifications list
    loadNotificationsList();
}

function loadNotificationsList() {
    const notificationsList = $('#notificationsList');
    if (!notificationsList) return;
    
    const result = NotificationsAPI.getForUser();
    
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
        notificationsList.innerHTML = '<div class="empty-notifications"><p>لا توجد إشعارات</p></div>';
    }
}

function getNotificationIcon(type) {
    const icons = {
        maintenance: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        inventory: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>',
        device: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        warranty: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
    };
    return icons[type] || icons.device;
}

function markNotificationRead(id) {
    NotificationsAPI.markAsRead(id);
    loadNotifications();
}

function markAllNotificationsRead() {
    NotificationsAPI.markAllAsRead();
    loadNotifications();
    showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
}

// ==================== DASHBOARD CONTENT ====================

function loadDashboardContent(user) {
    const pageContent = $('#pageContent');
    if (!pageContent) return;
    
    let content = '';
    
    switch (user.role) {
        case 'medical_staff':
            content = getMedicalStaffDashboard(user);
            break;
        case 'engineer':
            content = getEngineerDashboard();
            break;
        case 'inventory_manager':
            content = getInventoryManagerDashboard();
            break;
        case 'admin':
            content = getAdminDashboard();
            break;
        default:
            content = '<p>لوحة تحكم غير معروفة</p>';
    }
    
    pageContent.innerHTML = content;
    
    // Initialize charts after content is loaded
    setTimeout(() => {
        initDashboardCharts(user.role);
    }, 100);
}

function getMedicalStaffDashboard(user) {
    // Get devices for user's department only
    const devices = user.department === 'all' ? DEVICES : DEVICES.filter(d => d.department === user.department);
    const myRequests = MAINTENANCE_REQUESTS.filter(m => m.requestedById === user.id || m.department === user.department);
    
    const stats = {
        total: devices.length,
        operational: devices.filter(d => d.status === 'operational').length,
        maintenance: devices.filter(d => d.status === 'maintenance').length,
        outOfService: devices.filter(d => d.status === 'out_of_service').length,
        myPending: myRequests.filter(m => m.status === 'pending').length,
        myInProgress: myRequests.filter(m => m.status === 'in_progress').length,
        myCompleted: myRequests.filter(m => m.status === 'completed').length
    };
    
    return `
        <div class="dashboard-content">
            <div class="page-header">
                <h2>مرحباً، ${user.name}</h2>
                <p>أجهزة ${getDepartmentText(user.department)}</p>
            </div>
            
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${stats.total}</h3>
                        <p>إجمالي الأجهزة</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${stats.operational}</h3>
                        <p>تعمل بشكل سليم</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${stats.maintenance}</h3>
                        <p>تحت الصيانة</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${stats.outOfService}</h3>
                        <p>خارج الخدمة</p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3>إجراءات سريعة</h3>
                <div class="actions-grid">
                    <a href="devices.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <span>عرض الأجهزة</span>
                    </a>
                    <a href="my-requests.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <span>طلب صيانة</span>
                    </a>
                </div>
            </div>
            
            <!-- My Requests -->
            <div class="dashboard-section">
                <div class="section-header">
                    <h3>حالة طلباتي</h3>
                    <a href="my-requests.html" class="btn btn-ghost btn-sm">عرض الكل</a>
                </div>
                <div class="stats-row">
                    <div class="mini-stat">
                        <span class="mini-stat-value">${stats.myPending}</span>
                        <span class="mini-stat-label">قيد الانتظار</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-value">${stats.myInProgress}</span>
                        <span class="mini-stat-label">قيد التنفيذ</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-value">${stats.myCompleted}</span>
                        <span class="mini-stat-label">مكتملة</span>
                    </div>
                </div>
            </div>
            
            <!-- Recent Requests -->
            <div class="dashboard-section">
                <div class="section-header">
                    <h3>آخر الطلبات</h3>
                </div>
                <div class="recent-list">
                    ${myRequests.slice(0, 3).map(r => `
                        <div class="recent-item">
                            <div class="recent-icon ${r.status}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                            </div>
                            <div class="recent-info">
                                <h4>${r.deviceName}</h4>
                                <p>${r.description.substring(0, 50)}...</p>
                            </div>
                            <span class="badge ${getStatusClass(r.status)}">${getStatusText(r.status)}</span>
                        </div>
                    `).join('') || '<p class="text-muted">لا توجد طلبات</p>'}
                </div>
            </div>
        </div>
    `;
}

function getEngineerDashboard() {
    const maintenanceStats = getMaintenanceStats();
    const inventoryStats = getInventoryStats();
    const pendingRequests = MAINTENANCE_REQUESTS.filter(m => m.status === 'pending').slice(0, 5);
    const inProgressRequests = MAINTENANCE_REQUESTS.filter(m => m.status === 'in_progress').slice(0, 5);
    
    return `
        <div class="dashboard-content">
            <div class="page-header">
                <h2>لوحة تحكم المهندس</h2>
                <p>إدارة طلبات الصيانة والمتابعة</p>
            </div>
            
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${maintenanceStats.pending}</h3>
                        <p>طلبات قيد الانتظار</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${maintenanceStats.inProgress}</h3>
                        <p>قيد التنفيذ</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${maintenanceStats.completionRate}%</h3>
                        <p>نسبة الإنجاز</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${maintenanceStats.critical}</h3>
                        <p>طلبات حرجة</p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3>إجراءات سريعة</h3>
                <div class="actions-grid">
                    <a href="maintenance.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <span>إدارة الصيانة</span>
                    </a>
                    <a href="devices.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <span>الأجهزة</span>
                    </a>
                    <a href="inventory.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                        </div>
                        <span>المخزون</span>
                    </a>
                    <a href="reports.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <span>التقارير</span>
                    </a>
                </div>
            </div>
            
            <!-- Alerts -->
            ${inventoryStats.lowStock > 0 ? `
                <div class="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>تنبيه: ${inventoryStats.lowStock} أصناف وصلت للحد الأدنى في المخزون</span>
                    <a href="inventory.html" class="btn btn-sm btn-warning">عرض</a>
                </div>
            ` : ''}
            
            <div class="dashboard-grid">
                <!-- Pending Requests -->
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>طلبات قيد الانتظار</h3>
                        <a href="maintenance.html" class="btn btn-ghost btn-sm">عرض الكل</a>
                    </div>
                    <div class="recent-list">
                        ${pendingRequests.map(r => `
                            <div class="recent-item">
                                <div class="recent-icon ${r.priority}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                </div>
                                <div class="recent-info">
                                    <h4>${r.deviceName}</h4>
                                    <p>${getDepartmentText(r.department)}</p>
                                </div>
                                <span class="badge ${getPriorityClass(r.priority)}">${getPriorityText(r.priority)}</span>
                            </div>
                        `).join('') || '<p class="text-muted">لا توجد طلبات</p>'}
                    </div>
                </div>
                
                <!-- In Progress -->
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>قيد التنفيذ</h3>
                    </div>
                    <div class="recent-list">
                        ${inProgressRequests.map(r => `
                            <div class="recent-item">
                                <div class="recent-icon in_progress">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                                </div>
                                <div class="recent-info">
                                    <h4>${r.deviceName}</h4>
                                    <p>${r.assignedTo || 'غير معين'}</p>
                                </div>
                                <span class="badge badge-info">قيد التنفيذ</span>
                            </div>
                        `).join('') || '<p class="text-muted">لا توجد طلبات</p>'}
                    </div>
                </div>
            </div>
            
            <!-- Charts -->
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">طلبات الصيانة حسب القسم</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="maintenanceByDeptChart" height="200"></canvas>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">حالة الأجهزة</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="deviceStatusChart" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getInventoryManagerDashboard() {
    const inventoryStats = getInventoryStats();
    const lowStockItems = INVENTORY.filter(i => i.quantity <= i.minQuantity);
    
    return `
        <div class="dashboard-content">
            <div class="page-header">
                <h2>لوحة تحكم المخزون</h2>
                <p>إدارة ومتابعة قطع الغيار والمستهلكات</p>
            </div>
            
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${inventoryStats.total}</h3>
                        <p>إجمالي الأصناف</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${inventoryStats.lowStock}</h3>
                        <p>مخزون منخفض</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${inventoryStats.outOfStock}</h3>
                        <p>نفد المخزون</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${inventoryStats.totalValue.toLocaleString()}</h3>
                        <p>قيمة المخزون (ريال)</p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3>إجراءات سريعة</h3>
                <div class="actions-grid">
                    <a href="inventory.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                        </div>
                        <span>إدارة المخزون</span>
                    </a>
                </div>
            </div>
            
            <!-- Low Stock Alert -->
            ${lowStockItems.length > 0 ? `
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>تنبيهات المخزون المنخفض</h3>
                        <a href="inventory.html" class="btn btn-ghost btn-sm">عرض الكل</a>
                    </div>
                    <div class="table-wrapper">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>الصنف</th>
                                    <th>الكمية الحالية</th>
                                    <th>الحد الأدنى</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lowStockItems.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity} ${item.unit}</td>
                                        <td>${item.minQuantity} ${item.unit}</td>
                                        <td><span class="badge ${item.quantity === 0 ? 'badge-danger' : 'badge-warning'}">${item.quantity === 0 ? 'نفد' : 'منخفض'}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}
            
            <!-- Charts -->
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">المخزون حسب الفئة</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="inventoryByCategoryChart" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAdminDashboard() {
    const deviceStats = getDeviceStats();
    const maintenanceStats = getMaintenanceStats();
    const inventoryStats = getInventoryStats();
    const recentActivity = ACTIVITY_LOG.slice(0, 5);
    
    return `
        <div class="dashboard-content">
            <div class="page-header">
                <h2>لوحة تحكم المدير</h2>
                <p>نظرة عامة شاملة على النظام</p>
            </div>
            
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${deviceStats.total}</h3>
                        <p>إجمالي الأجهزة</p>
                        <span class="kpi-trend up">${deviceStats.operationalRate}% تعمل</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${maintenanceStats.pending}</h3>
                        <p>طلبات صيانة معلقة</p>
                        <span class="kpi-trend">${maintenanceStats.total} إجمالي</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${inventoryStats.total}</h3>
                        <p>أصناف المخزون</p>
                        <span class="kpi-trend ${inventoryStats.lowStock > 0 ? 'down' : ''}">${inventoryStats.lowStock} منخفض</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div class="kpi-content">
                        <h3>${deviceStats.outOfService}</h3>
                        <p>أجهزة خارج الخدمة</p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3>إجراءات سريعة</h3>
                <div class="actions-grid">
                    <a href="devices.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <span>الأجهزة</span>
                    </a>
                    <a href="maintenance.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <span>الصيانة</span>
                    </a>
                    <a href="inventory.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                        </div>
                        <span>المخزون</span>
                    </a>
                    <a href="reports.html" class="action-card">
                        <div class="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <span>التقارير</span>
                    </a>
                </div>
            </div>
            
            <!-- Charts Row -->
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">حالة الأجهزة</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="deviceStatusChart" height="200"></canvas>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">طلبات الصيانة حسب الحالة</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="maintenanceStatusChart" height="200"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <!-- Recent Activity -->
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>آخر النشاطات</h3>
                    </div>
                    <div class="activity-timeline">
                        ${recentActivity.map(a => `
                            <div class="activity-item">
                                <div class="activity-icon ${a.type}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                                </div>
                                <div class="activity-content">
                                    <h4>${a.action}</h4>
                                    <p>${a.details}</p>
                                    <span class="activity-time">${formatDateTime(a.date)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Problematic Devices -->
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>الأجهزة الأكثر تعطلاً</h3>
                    </div>
                    <div class="recent-list">
                        ${getTopProblematicDevices(3).map(d => `
                            <div class="recent-item">
                                <div class="recent-icon danger">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                </div>
                                <div class="recent-info">
                                    <h4>${d.name}</h4>
                                    <p>${getDepartmentText(d.department)}</p>
                                </div>
                                <span class="badge badge-danger">${d.failureCount} أعطال</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Maintenance by Department Chart -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">طلبات الصيانة حسب القسم</h3>
                </div>
                <div class="card-body">
                    <canvas id="maintenanceByDeptChart" height="150"></canvas>
                </div>
            </div>
        </div>
    `;
}

// ==================== CHARTS ====================

function initDashboardCharts(role) {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                rtl: true,
                labels: {
                    font: {
                        family: 'Cairo'
                    }
                }
            }
        }
    };
    
    // Device Status Chart
    const deviceStatusCanvas = document.getElementById('deviceStatusChart');
    if (deviceStatusCanvas) {
        const ctx = deviceStatusCanvas.getContext('2d');
        const stats = getDeviceStats();
        
        charts.deviceStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['يعمل', 'تحت الصيانة', 'خارج الخدمة'],
                datasets: [{
                    data: [stats.operational, stats.maintenance, stats.outOfService],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                ...chartOptions,
                cutout: '60%'
            }
        });
    }
    
    // Maintenance Status Chart
    const maintenanceStatusCanvas = document.getElementById('maintenanceStatusChart');
    if (maintenanceStatusCanvas) {
        const ctx = maintenanceStatusCanvas.getContext('2d');
        const stats = getMaintenanceStats();
        
        charts.maintenanceStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['قيد الانتظار', 'قيد التنفيذ', 'مكتمل', 'مجدول'],
                datasets: [{
                    data: [stats.pending, stats.inProgress, stats.completed, stats.scheduled],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#64748b'],
                    borderWidth: 0
                }]
            },
            options: {
                ...chartOptions,
                cutout: '60%'
            }
        });
    }
    
    // Maintenance by Department Chart
    const maintenanceByDeptCanvas = document.getElementById('maintenanceByDeptChart');
    if (maintenanceByDeptCanvas) {
        const ctx = maintenanceByDeptCanvas.getContext('2d');
        const byDept = getMaintenanceByDepartment();
        
        charts.maintenanceByDept = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.values(byDept).map(d => d.name),
                datasets: [{
                    label: 'عدد الطلبات',
                    data: Object.values(byDept).map(d => d.count),
                    backgroundColor: '#0891b2',
                    borderRadius: 6
                }]
            },
            options: {
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    // Inventory by Category Chart
    const inventoryByCategoryCanvas = document.getElementById('inventoryByCategoryChart');
    if (inventoryByCategoryCanvas) {
        const ctx = inventoryByCategoryCanvas.getContext('2d');
        const spareParts = INVENTORY.filter(i => i.category === 'spare_part').length;
        const consumables = INVENTORY.filter(i => i.category === 'consumable').length;
        const tools = INVENTORY.filter(i => i.category === 'tool').length;
        
        charts.inventoryByCategory = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['قطع غيار', 'مستهلكات', 'أدوات'],
                datasets: [{
                    data: [spareParts, consumables, tools],
                    backgroundColor: ['#0891b2', '#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: chartOptions
        });
    }
}

// ==================== MODAL FUNCTIONS ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        currentModal = modalId;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId || currentModal);
    if (modal) {
        modal.classList.remove('active');
        currentModal = null;
        document.body.style.overflow = '';
    }
}

// ==================== COMMON FUNCTIONS FOR ALL PAGES ====================

function initializeSidebar() {
    const user = AuthAPI.getCurrentUser();
    if (user) {
        setupSidebar(user.role);
        updateHeaderUserInfo(user);
    }
}

// Initialize on page load if not dashboard
if (window.location.pathname.includes('dashboard.html')) {
    // Dashboard initialization handled separately
} else {
    document.addEventListener('DOMContentLoaded', function() {
        if (!checkAuth()) return;
        initializeSidebar();
        setupEventListeners();
        loadNotifications();
    });
}
