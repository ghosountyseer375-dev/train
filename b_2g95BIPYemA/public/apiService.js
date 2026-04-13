/**
 * SMEMS - API Service Layer
 * Uses Static Data from data.js
 * No localStorage - Pure static data for demo
 */

// ==================== GLOBAL STATE ====================
let currentUser = null;

// ==================== HELPER FUNCTIONS ====================

function generateId(prefix) {
    return prefix + Date.now().toString(36).toUpperCase();
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

function getDaysUntil(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isOverdue(dateString) {
    return getDaysUntil(dateString) < 0;
}

// ==================== AUTHENTICATION API ====================

const AuthAPI = {
    login(username, password, role, department) {
        // For demo, allow login with any credentials by selecting role
        const user = USERS.find(u => u.username === username) || {
            id: generateId('U'),
            username: username,
            name: username,
            role: role,
            department: department
        };
        
        currentUser = {
            id: user.id,
            username: username,
            name: user.name || username,
            role: role,
            department: department,
            email: user.email || '',
            phone: user.phone || ''
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    },

    logout() {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        return { success: true };
    },

    getCurrentUser() {
        if (currentUser) return currentUser;
        const stored = sessionStorage.getItem('currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
            return currentUser;
        }
        return null;
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
};

// ==================== DEVICES API ====================

const DevicesAPI = {
    getAll() {
        return { success: true, data: DEVICES };
    },

    getByDepartment(department) {
        const devices = department === 'all' ? DEVICES : DEVICES.filter(d => d.department === department);
        return { success: true, data: devices };
    },

    getByStatus(status) {
        const devices = DEVICES.filter(d => d.status === status);
        return { success: true, data: devices };
    },

    getById(id) {
        const device = DEVICES.find(d => d.id === id);
        return device ? { success: true, data: device } : { success: false, message: 'الجهاز غير موجود' };
    },

    getStats() {
        return { success: true, data: getDeviceStats() };
    },

    getStatsByDepartment(department) {
        return { success: true, data: getDepartmentDeviceStats(department) };
    },

    getTopProblematic(limit = 5) {
        return { success: true, data: getTopProblematicDevices(limit) };
    },

    getWarrantyAlerts() {
        const alerts = DEVICES.filter(d => {
            const days = getDaysUntil(d.warrantyExpiry);
            return days !== null && days <= 90 && days > 0;
        });
        return { success: true, data: alerts };
    },

    getMaintenanceAlerts() {
        const alerts = DEVICES.filter(d => {
            const days = getDaysUntil(d.nextMaintenance);
            return days !== null && days <= 14;
        });
        return { success: true, data: alerts };
    }
};

// ==================== MAINTENANCE API ====================

const MaintenanceAPI = {
    getAll() {
        return { success: true, data: MAINTENANCE_REQUESTS };
    },

    getByDepartment(department) {
        const requests = department === 'all' ? 
            MAINTENANCE_REQUESTS : 
            MAINTENANCE_REQUESTS.filter(m => m.department === department);
        return { success: true, data: requests };
    },

    getByStatus(status) {
        const requests = MAINTENANCE_REQUESTS.filter(m => m.status === status);
        return { success: true, data: requests };
    },

    getById(id) {
        const request = MAINTENANCE_REQUESTS.find(m => m.id === id);
        return request ? { success: true, data: request } : { success: false, message: 'الطلب غير موجود' };
    },

    getByUser(userId) {
        const requests = MAINTENANCE_REQUESTS.filter(m => m.requestedById === userId);
        return { success: true, data: requests };
    },

    getByEngineer(engineerId) {
        const requests = MAINTENANCE_REQUESTS.filter(m => m.assignedToId === engineerId);
        return { success: true, data: requests };
    },

    getStats() {
        return { success: true, data: getMaintenanceStats() };
    },

    getStatsByDepartment() {
        return { success: true, data: getMaintenanceByDepartment() };
    },

    getPending() {
        return this.getByStatus('pending');
    },

    getInProgress() {
        return this.getByStatus('in_progress');
    },

    getCompleted() {
        return this.getByStatus('completed');
    },

    getScheduled() {
        return this.getByStatus('scheduled');
    },

    getCritical() {
        const requests = MAINTENANCE_REQUESTS.filter(m => m.priority === 'critical');
        return { success: true, data: requests };
    },

    getOverdue() {
        const requests = MAINTENANCE_REQUESTS.filter(m => {
            if (m.status === 'completed') return false;
            const days = getDaysUntil(m.requestDate);
            return days < -7; // More than 7 days old
        });
        return { success: true, data: requests };
    }
};

// ==================== INVENTORY API ====================

const InventoryAPI = {
    getAll() {
        return { success: true, data: INVENTORY };
    },

    getByCategory(category) {
        const items = category ? INVENTORY.filter(i => i.category === category) : INVENTORY;
        return { success: true, data: items };
    },

    getById(id) {
        const item = INVENTORY.find(i => i.id === id);
        return item ? { success: true, data: item } : { success: false, message: 'العنصر غير موجود' };
    },

    getLowStock() {
        const items = INVENTORY.filter(i => i.quantity <= i.minQuantity && i.quantity > 0);
        return { success: true, data: items };
    },

    getOutOfStock() {
        const items = INVENTORY.filter(i => i.quantity === 0);
        return { success: true, data: items };
    },

    getStats() {
        return { success: true, data: getInventoryStats() };
    },

    getCompatibleItems(deviceId) {
        const items = INVENTORY.filter(i => i.compatibleDevices && i.compatibleDevices.includes(deviceId));
        return { success: true, data: items };
    },

    getUsageHistory(itemId) {
        const item = INVENTORY.find(i => i.id === itemId);
        return item ? { success: true, data: item.usageHistory || [] } : { success: false, message: 'العنصر غير موجود' };
    }
};

// ==================== NOTIFICATIONS API ====================

const NotificationsAPI = {
    getAll() {
        return { success: true, data: NOTIFICATIONS };
    },

    getForUser() {
        const user = AuthAPI.getCurrentUser();
        if (!user) return { success: false, message: 'المستخدم غير مسجل' };
        
        const notifications = NOTIFICATIONS.filter(n => {
            const roleMatch = n.forRoles.includes(user.role) || n.forRoles.includes('all');
            const deptMatch = n.forDepartments.includes(user.department) || n.forDepartments.includes('all');
            return roleMatch && deptMatch;
        });
        
        return { success: true, data: notifications.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    },

    getUnread() {
        const result = this.getForUser();
        if (!result.success) return result;
        
        const unread = result.data.filter(n => !n.read);
        return { success: true, data: unread };
    },

    getUnreadCount() {
        const result = this.getUnread();
        return { success: true, data: result.success ? result.data.length : 0 };
    },

    markAsRead(id) {
        const notification = NOTIFICATIONS.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
        return { success: true };
    },

    markAllAsRead() {
        const user = AuthAPI.getCurrentUser();
        if (!user) return { success: false };
        
        NOTIFICATIONS.forEach(n => {
            const roleMatch = n.forRoles.includes(user.role) || n.forRoles.includes('all');
            const deptMatch = n.forDepartments.includes(user.department) || n.forDepartments.includes('all');
            if (roleMatch && deptMatch) {
                n.read = true;
            }
        });
        return { success: true };
    }
};

// ==================== USERS API ====================

const UsersAPI = {
    getAll() {
        return { success: true, data: USERS };
    },

    getById(id) {
        const user = USERS.find(u => u.id === id);
        return user ? { success: true, data: user } : { success: false, message: 'المستخدم غير موجود' };
    },

    getByRole(role) {
        const users = USERS.filter(u => u.role === role);
        return { success: true, data: users };
    },

    getEngineers() {
        return this.getByRole('engineer');
    },

    getMedicalStaff() {
        return this.getByRole('medical_staff');
    }
};

// ==================== DEPARTMENTS API ====================

const DepartmentsAPI = {
    getAll() {
        return { success: true, data: DEPARTMENTS };
    },

    getById(id) {
        const dept = DEPARTMENTS.find(d => d.id === id);
        return dept ? { success: true, data: dept } : { success: false, message: 'القسم غير موجود' };
    }
};

// ==================== SUPPLIERS API ====================

const SuppliersAPI = {
    getAll() {
        return { success: true, data: SUPPLIERS };
    },

    getById(id) {
        const supplier = SUPPLIERS.find(s => s.id === id);
        return supplier ? { success: true, data: supplier } : { success: false, message: 'المورد غير موجود' };
    }
};

// ==================== REPORTS API ====================

const ReportsAPI = {
    getScheduledReports() {
        return { success: true, data: SCHEDULED_REPORTS };
    },

    getDevicesReport(filters = {}) {
        let devices = [...DEVICES];
        
        if (filters.department && filters.department !== 'all') {
            devices = devices.filter(d => d.department === filters.department);
        }
        if (filters.status) {
            devices = devices.filter(d => d.status === filters.status);
        }
        if (filters.riskLevel) {
            devices = devices.filter(d => d.riskLevel === filters.riskLevel);
        }
        
        const stats = {
            total: devices.length,
            operational: devices.filter(d => d.status === 'operational').length,
            maintenance: devices.filter(d => d.status === 'maintenance').length,
            outOfService: devices.filter(d => d.status === 'out_of_service').length,
            byDepartment: {},
            byRiskLevel: {}
        };
        
        DEPARTMENTS.filter(d => d.id !== 'all').forEach(dept => {
            stats.byDepartment[dept.name] = devices.filter(d => d.department === dept.id).length;
        });
        
        ['critical', 'high', 'medium', 'low'].forEach(level => {
            stats.byRiskLevel[level] = devices.filter(d => d.riskLevel === level).length;
        });
        
        return { success: true, data: { devices, stats } };
    },

    getMaintenanceReport(filters = {}) {
        let requests = [...MAINTENANCE_REQUESTS];
        
        if (filters.department && filters.department !== 'all') {
            requests = requests.filter(m => m.department === filters.department);
        }
        if (filters.status) {
            requests = requests.filter(m => m.status === filters.status);
        }
        if (filters.startDate) {
            requests = requests.filter(m => new Date(m.requestDate) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            requests = requests.filter(m => new Date(m.requestDate) <= new Date(filters.endDate));
        }
        
        const stats = {
            total: requests.length,
            pending: requests.filter(m => m.status === 'pending').length,
            inProgress: requests.filter(m => m.status === 'in_progress').length,
            completed: requests.filter(m => m.status === 'completed').length,
            critical: requests.filter(m => m.priority === 'critical').length,
            byType: {},
            byDepartment: {}
        };
        
        ['corrective', 'preventive'].forEach(type => {
            stats.byType[type] = requests.filter(m => m.type === type).length;
        });
        
        DEPARTMENTS.filter(d => d.id !== 'all').forEach(dept => {
            stats.byDepartment[dept.name] = requests.filter(m => m.department === dept.id).length;
        });
        
        return { success: true, data: { requests, stats } };
    },

    getInventoryReport(filters = {}) {
        let items = [...INVENTORY];
        
        if (filters.category) {
            items = items.filter(i => i.category === filters.category);
        }
        if (filters.stockStatus === 'low') {
            items = items.filter(i => i.quantity <= i.minQuantity && i.quantity > 0);
        } else if (filters.stockStatus === 'out') {
            items = items.filter(i => i.quantity === 0);
        }
        
        const stats = {
            totalItems: items.length,
            totalValue: items.reduce((sum, i) => sum + (i.quantity * i.price), 0),
            lowStock: items.filter(i => i.quantity <= i.minQuantity && i.quantity > 0).length,
            outOfStock: items.filter(i => i.quantity === 0).length,
            byCategory: {}
        };
        
        INVENTORY_CATEGORIES.forEach(cat => {
            const catItems = items.filter(i => i.category === cat.id);
            stats.byCategory[cat.name] = {
                count: catItems.length,
                value: catItems.reduce((sum, i) => sum + (i.quantity * i.price), 0)
            };
        });
        
        return { success: true, data: { items, stats } };
    },

    getEngineersReport() {
        const engineers = USERS.filter(u => u.role === 'engineer');
        const report = engineers.map(eng => {
            const requests = MAINTENANCE_REQUESTS.filter(m => m.assignedToId === eng.id);
            const completed = requests.filter(m => m.status === 'completed');
            
            return {
                id: eng.id,
                name: eng.name,
                totalAssigned: requests.length,
                completed: completed.length,
                inProgress: requests.filter(m => m.status === 'in_progress').length,
                completionRate: requests.length > 0 ? ((completed.length / requests.length) * 100).toFixed(1) : 0
            };
        });
        
        return { success: true, data: report };
    }
};

// ==================== ACTIVITY LOG API ====================

const ActivityAPI = {
    getAll() {
        return { success: true, data: ACTIVITY_LOG };
    },

    getRecent(limit = 10) {
        const sorted = [...ACTIVITY_LOG].sort((a, b) => new Date(b.date) - new Date(a.date));
        return { success: true, data: sorted.slice(0, limit) };
    },

    getByType(type) {
        const activities = ACTIVITY_LOG.filter(a => a.type === type);
        return { success: true, data: activities };
    }
};

// ==================== BACKWARD COMPATIBILITY ====================

const apiService = {
    // Devices
    getDevices: () => DevicesAPI.getAll().data,
    getDevice: (id) => DevicesAPI.getById(id).data,
    getDevicesByDepartment: (dept) => DevicesAPI.getByDepartment(dept).data,
    
    // Departments
    getDepartments: () => DepartmentsAPI.getAll().data,
    
    // Device Types
    getDeviceTypes: () => DEVICE_TYPES,
    
    // Users
    getEngineers: () => UsersAPI.getEngineers().data,
    
    // Maintenance
    getMaintenanceRequests: () => MaintenanceAPI.getAll().data,
    getMaintenanceRequest: (id) => MaintenanceAPI.getById(id).data,
    
    // Inventory
    getInventory: () => InventoryAPI.getAll().data,
    getInventoryItem: (id) => InventoryAPI.getById(id).data,
    
    // Suppliers
    getSuppliers: () => SuppliersAPI.getAll().data,
    
    // Categories
    getInventoryCategories: () => INVENTORY_CATEGORIES
};
