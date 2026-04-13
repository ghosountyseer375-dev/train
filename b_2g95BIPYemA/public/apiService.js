/**
 * SMEMS - API Service Layer
 * Simulated API using LocalStorage
 * Easy to replace with real REST API calls
 */

const API_DELAY = 300; // Simulate network delay

// ==================== INITIALIZATION ====================

function initializeData() {
    // Initialize devices if not exists
    if (!localStorage.getItem('devices')) {
        const devices = [
            {
                id: 'DEV001',
                name: 'جهاز تخطيط القلب',
                serialNumber: 'ECG-2024-001',
                manufacturer: 'Philips',
                model: 'PageWriter TC70',
                category: 'تشخيصي',
                department: 'cardiology',
                status: 'operational',
                riskLevel: 'high',
                purchaseDate: '2022-03-15',
                warrantyExpiry: '2025-03-15',
                lastMaintenance: '2024-01-10',
                lastMaintenanceType: 'صيانة دورية',
                nextMaintenance: '2024-07-10',
                location: 'غرفة 101',
                notes: 'يعمل بشكل ممتاز'
            },
            {
                id: 'DEV002',
                name: 'جهاز الأشعة السينية',
                serialNumber: 'XR-2024-002',
                manufacturer: 'Siemens',
                model: 'MOBILETT Elara Max',
                category: 'تصوير',
                department: 'radiology',
                status: 'operational',
                riskLevel: 'high',
                purchaseDate: '2021-08-20',
                warrantyExpiry: '2024-08-20',
                lastMaintenance: '2024-02-05',
                lastMaintenanceType: 'صيانة وقائية',
                nextMaintenance: '2024-08-05',
                location: 'غرفة الأشعة 1',
                notes: ''
            },
            {
                id: 'DEV003',
                name: 'جهاز مراقبة المريض',
                serialNumber: 'PM-2024-003',
                manufacturer: 'GE Healthcare',
                model: 'CARESCAPE B650',
                category: 'مراقبة',
                department: 'icu',
                status: 'maintenance',
                riskLevel: 'critical',
                purchaseDate: '2023-01-10',
                warrantyExpiry: '2026-01-10',
                lastMaintenance: '2024-03-01',
                lastMaintenanceType: 'صيانة تصحيحية',
                nextMaintenance: '2024-06-01',
                location: 'العناية المركزة - سرير 5',
                notes: 'بحاجة لاستبدال البطارية'
            },
            {
                id: 'DEV004',
                name: 'جهاز التنفس الصناعي',
                serialNumber: 'VT-2024-004',
                manufacturer: 'Draeger',
                model: 'Evita V500',
                category: 'دعم الحياة',
                department: 'icu',
                status: 'operational',
                riskLevel: 'critical',
                purchaseDate: '2022-06-15',
                warrantyExpiry: '2025-06-15',
                lastMaintenance: '2024-02-20',
                lastMaintenanceType: 'صيانة دورية',
                nextMaintenance: '2024-08-20',
                location: 'العناية المركزة - غرفة 3',
                notes: ''
            },
            {
                id: 'DEV005',
                name: 'جهاز الموجات فوق الصوتية',
                serialNumber: 'US-2024-005',
                manufacturer: 'Samsung',
                model: 'HS70A',
                category: 'تصوير',
                department: 'radiology',
                status: 'out_of_service',
                riskLevel: 'medium',
                purchaseDate: '2020-11-30',
                warrantyExpiry: '2023-11-30',
                lastMaintenance: '2024-01-15',
                lastMaintenanceType: 'صيانة تصحيحية',
                nextMaintenance: '2024-04-15',
                location: 'غرفة الموجات الصوتية',
                notes: 'بانتظار قطع غيار'
            },
            {
                id: 'DEV006',
                name: 'جهاز صدمات القلب',
                serialNumber: 'DF-2024-006',
                manufacturer: 'Zoll',
                model: 'R Series',
                category: 'طوارئ',
                department: 'emergency',
                status: 'operational',
                riskLevel: 'critical',
                purchaseDate: '2023-04-01',
                warrantyExpiry: '2026-04-01',
                lastMaintenance: '2024-02-28',
                lastMaintenanceType: 'فحص دوري',
                nextMaintenance: '2024-05-28',
                location: 'غرفة الطوارئ',
                notes: ''
            },
            {
                id: 'DEV007',
                name: 'مضخة التسريب الوريدي',
                serialNumber: 'IP-2024-007',
                manufacturer: 'B. Braun',
                model: 'Infusomat Space',
                category: 'علاجي',
                department: 'surgery',
                status: 'operational',
                riskLevel: 'high',
                purchaseDate: '2023-02-20',
                warrantyExpiry: '2026-02-20',
                lastMaintenance: '2024-01-25',
                lastMaintenanceType: 'معايرة',
                nextMaintenance: '2024-07-25',
                location: 'غرفة العمليات 2',
                notes: ''
            },
            {
                id: 'DEV008',
                name: 'جهاز تحليل الدم',
                serialNumber: 'BA-2024-008',
                manufacturer: 'Sysmex',
                model: 'XN-1000',
                category: 'مختبر',
                department: 'laboratory',
                status: 'maintenance',
                riskLevel: 'medium',
                purchaseDate: '2021-09-10',
                warrantyExpiry: '2024-09-10',
                lastMaintenance: '2024-03-05',
                lastMaintenanceType: 'صيانة وقائية',
                nextMaintenance: '2024-06-05',
                location: 'المختبر الرئيسي',
                notes: 'يحتاج معايرة'
            },
            {
                id: 'DEV009',
                name: 'جهاز التخدير',
                serialNumber: 'AN-2024-009',
                manufacturer: 'Mindray',
                model: 'A7',
                category: 'تخدير',
                department: 'surgery',
                status: 'operational',
                riskLevel: 'critical',
                purchaseDate: '2022-12-01',
                warrantyExpiry: '2025-12-01',
                lastMaintenance: '2024-02-10',
                lastMaintenanceType: 'صيانة دورية',
                nextMaintenance: '2024-08-10',
                location: 'غرفة العمليات 1',
                notes: ''
            },
            {
                id: 'DEV010',
                name: 'سرير كهربائي',
                serialNumber: 'EB-2024-010',
                manufacturer: 'Hill-Rom',
                model: 'Centrella Smart+',
                category: 'أثاث طبي',
                department: 'icu',
                status: 'operational',
                riskLevel: 'low',
                purchaseDate: '2023-05-15',
                warrantyExpiry: '2028-05-15',
                lastMaintenance: '2024-01-30',
                lastMaintenanceType: 'فحص',
                nextMaintenance: '2024-07-30',
                location: 'العناية المركزة - سرير 2',
                notes: ''
            }
        ];
        localStorage.setItem('devices', JSON.stringify(devices));
    }

    // Initialize maintenance requests
    if (!localStorage.getItem('maintenanceRequests')) {
        const requests = [
            {
                id: 'MR001',
                deviceId: 'DEV003',
                deviceName: 'جهاز مراقبة المريض',
                serialNumber: 'PM-2024-003',
                department: 'icu',
                issueType: 'electrical',
                description: 'البطارية لا تشحن بشكل صحيح',
                priority: 'high',
                status: 'in_progress',
                requestedBy: 'د. أحمد محمد',
                requestDate: '2024-03-01',
                assignedTo: 'م. خالد العمري',
                startDate: '2024-03-02',
                completedDate: null,
                notes: 'تم طلب بطارية جديدة',
                partsUsed: [],
                hasAlternative: true,
                images: []
            },
            {
                id: 'MR002',
                deviceId: 'DEV005',
                deviceName: 'جهاز الموجات فوق الصوتية',
                serialNumber: 'US-2024-005',
                department: 'radiology',
                issueType: 'mechanical',
                description: 'مشكلة في المسبار - صورة غير واضحة',
                priority: 'critical',
                status: 'pending',
                requestedBy: 'د. سارة أحمد',
                requestDate: '2024-03-10',
                assignedTo: null,
                startDate: null,
                completedDate: null,
                notes: '',
                partsUsed: [],
                hasAlternative: false,
                images: []
            },
            {
                id: 'MR003',
                deviceId: 'DEV008',
                deviceName: 'جهاز تحليل الدم',
                serialNumber: 'BA-2024-008',
                department: 'laboratory',
                issueType: 'calibration',
                description: 'يحتاج معايرة دورية',
                priority: 'medium',
                status: 'in_progress',
                requestedBy: 'فني المختبر',
                requestDate: '2024-03-05',
                assignedTo: 'م. فهد السعيد',
                startDate: '2024-03-06',
                completedDate: null,
                notes: 'جاري العمل على المعايرة',
                partsUsed: [],
                hasAlternative: true,
                images: []
            },
            {
                id: 'MR004',
                deviceId: 'DEV001',
                deviceName: 'جهاز تخطيط القلب',
                serialNumber: 'ECG-2024-001',
                department: 'cardiology',
                issueType: 'software',
                description: 'تحديث البرنامج مطلوب',
                priority: 'low',
                status: 'completed',
                requestedBy: 'د. محمد علي',
                requestDate: '2024-02-15',
                assignedTo: 'م. خالد العمري',
                startDate: '2024-02-16',
                completedDate: '2024-02-17',
                notes: 'تم تحديث البرنامج بنجاح',
                partsUsed: [],
                hasAlternative: true,
                images: []
            }
        ];
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
    }

    // Initialize inventory
    if (!localStorage.getItem('inventory')) {
        const inventory = [
            {
                id: 'INV001',
                name: 'بطارية جهاز المراقبة',
                category: 'بطاريات',
                quantity: 5,
                minQuantity: 3,
                unit: 'قطعة',
                price: 250,
                supplier: 'MedTech Supplies',
                lastRestocked: '2024-02-15',
                usageHistory: [
                    { date: '2024-02-20', quantity: 2, department: 'icu' },
                    { date: '2024-03-01', quantity: 1, department: 'emergency' }
                ]
            },
            {
                id: 'INV002',
                name: 'كابل ECG',
                category: 'كابلات',
                quantity: 12,
                minQuantity: 5,
                unit: 'قطعة',
                price: 75,
                supplier: 'Philips Medical',
                lastRestocked: '2024-01-20',
                usageHistory: [
                    { date: '2024-02-10', quantity: 3, department: 'cardiology' }
                ]
            },
            {
                id: 'INV003',
                name: 'فلتر جهاز التنفس',
                category: 'فلاتر',
                quantity: 2,
                minQuantity: 10,
                unit: 'قطعة',
                price: 45,
                supplier: 'Draeger Medical',
                lastRestocked: '2024-01-05',
                usageHistory: [
                    { date: '2024-01-15', quantity: 5, department: 'icu' },
                    { date: '2024-02-01', quantity: 8, department: 'surgery' }
                ]
            },
            {
                id: 'INV004',
                name: 'مسبار الموجات الصوتية',
                category: 'مسابر',
                quantity: 3,
                minQuantity: 2,
                unit: 'قطعة',
                price: 1500,
                supplier: 'Samsung Medical',
                lastRestocked: '2024-02-28',
                usageHistory: []
            },
            {
                id: 'INV005',
                name: 'ورق تخطيط القلب',
                category: 'مستهلكات',
                quantity: 50,
                minQuantity: 20,
                unit: 'رزمة',
                price: 15,
                supplier: 'Medical Papers Co',
                lastRestocked: '2024-03-01',
                usageHistory: [
                    { date: '2024-03-05', quantity: 10, department: 'cardiology' },
                    { date: '2024-03-08', quantity: 5, department: 'emergency' }
                ]
            },
            {
                id: 'INV006',
                name: 'أقطاب ECG',
                category: 'مستهلكات',
                quantity: 200,
                minQuantity: 100,
                unit: 'قطعة',
                price: 2,
                supplier: 'MedTech Supplies',
                lastRestocked: '2024-02-20',
                usageHistory: [
                    { date: '2024-02-25', quantity: 50, department: 'cardiology' },
                    { date: '2024-03-02', quantity: 30, department: 'icu' }
                ]
            },
            {
                id: 'INV007',
                name: 'مصباح جهاز الأشعة',
                category: 'قطع غيار',
                quantity: 1,
                minQuantity: 2,
                unit: 'قطعة',
                price: 800,
                supplier: 'Siemens Healthcare',
                lastRestocked: '2024-01-10',
                usageHistory: []
            },
            {
                id: 'INV008',
                name: 'جل الموجات الصوتية',
                category: 'مستهلكات',
                quantity: 25,
                minQuantity: 10,
                unit: 'عبوة',
                price: 20,
                supplier: 'Medical Supplies Ltd',
                lastRestocked: '2024-02-25',
                usageHistory: [
                    { date: '2024-03-01', quantity: 5, department: 'radiology' }
                ]
            }
        ];
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    // Initialize users
    if (!localStorage.getItem('users')) {
        const users = [
            { id: 'U001', username: 'admin', password: 'admin123', name: 'مدير النظام', role: 'admin', department: 'all' },
            { id: 'U002', username: 'doctor', password: 'doctor123', name: 'د. أحمد محمد', role: 'medical_staff', department: 'cardiology' },
            { id: 'U003', username: 'engineer', password: 'eng123', name: 'م. خالد العمري', role: 'engineer', department: 'all' },
            { id: 'U004', username: 'inventory', password: 'inv123', name: 'سالم العتيبي', role: 'inventory_manager', department: 'all' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Initialize notifications
    if (!localStorage.getItem('notifications')) {
        const notifications = [
            {
                id: 'N001',
                type: 'maintenance',
                title: 'طلب صيانة جديد',
                message: 'تم إنشاء طلب صيانة لجهاز مراقبة المريض',
                date: '2024-03-01T10:30:00',
                read: false,
                forRoles: ['engineer', 'admin']
            },
            {
                id: 'N002',
                type: 'inventory',
                title: 'تنبيه مخزون منخفض',
                message: 'فلتر جهاز التنفس وصل للحد الأدنى',
                date: '2024-03-05T14:20:00',
                read: false,
                forRoles: ['inventory_manager', 'admin']
            },
            {
                id: 'N003',
                type: 'device',
                title: 'تغيير حالة جهاز',
                message: 'جهاز الموجات فوق الصوتية خارج الخدمة',
                date: '2024-03-10T09:15:00',
                read: true,
                forRoles: ['medical_staff', 'engineer', 'admin']
            },
            {
                id: 'N004',
                type: 'maintenance',
                title: 'اكتمال صيانة',
                message: 'تم الانتهاء من صيانة جهاز تخطيط القلب',
                date: '2024-02-17T16:45:00',
                read: true,
                forRoles: ['medical_staff', 'admin']
            }
        ];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // Initialize maintenance history
    if (!localStorage.getItem('maintenanceHistory')) {
        const history = [
            { deviceId: 'DEV001', date: '2024-01-10', type: 'صيانة دورية', technician: 'م. خالد العمري', notes: 'فحص شامل وتنظيف', cost: 150 },
            { deviceId: 'DEV001', date: '2023-07-15', type: 'صيانة وقائية', technician: 'م. فهد السعيد', notes: 'تحديث البرنامج', cost: 0 },
            { deviceId: 'DEV002', date: '2024-02-05', type: 'صيانة وقائية', technician: 'م. خالد العمري', notes: 'فحص الأمان الإشعاعي', cost: 300 },
            { deviceId: 'DEV003', date: '2024-03-01', type: 'صيانة تصحيحية', technician: 'م. خالد العمري', notes: 'مشكلة في البطارية', cost: 250 },
            { deviceId: 'DEV004', date: '2024-02-20', type: 'صيانة دورية', technician: 'م. فهد السعيد', notes: 'فحص شامل واستبدال الفلاتر', cost: 180 },
            { deviceId: 'DEV005', date: '2024-01-15', type: 'صيانة تصحيحية', technician: 'م. خالد العمري', notes: 'مشكلة في المسبار', cost: 500 }
        ];
        localStorage.setItem('maintenanceHistory', JSON.stringify(history));
    }
}

// ==================== HELPER FUNCTIONS ====================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateId(prefix) {
    return prefix + Date.now().toString(36).toUpperCase();
}

// ==================== AUTHENTICATION API ====================

const AuthAPI = {
    async login(username, password, role, department) {
        await delay(API_DELAY);
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username);
        
        // For demo purposes, allow any login with role selection
        if (username && password) {
            const currentUser = {
                id: user?.id || generateId('U'),
                username: username,
                name: user?.name || username,
                role: role,
                department: department
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            return { success: true, user: currentUser };
        }
        
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    },

    async logout() {
        await delay(API_DELAY);
        sessionStorage.removeItem('currentUser');
        return { success: true };
    },

    getCurrentUser() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!sessionStorage.getItem('currentUser');
    }
};

// ==================== DEVICES API ====================

const DevicesAPI = {
    async getAll() {
        await delay(API_DELAY);
        const devices = JSON.parse(localStorage.getItem('devices') || '[]');
        return { success: true, data: devices };
    },

    async getByDepartment(department) {
        await delay(API_DELAY);
        const devices = JSON.parse(localStorage.getItem('devices') || '[]');
        const filtered = department === 'all' 
            ? devices 
            : devices.filter(d => d.department === department);
        return { success: true, data: filtered };
    },

    async getById(id) {
        await delay(API_DELAY);
        const devices = JSON.parse(localStorage.getItem('devices') || '[]');
        const device = devices.find(d => d.id === id);
        return device 
            ? { success: true, data: device }
            : { success: false, message: 'الجهاز غير موجود' };
    },

    async create(deviceData) {
        await delay(API_DELAY);
        const devices = JSON.parse(localStorage.getItem('devices') || '[]');
        const newDevice = {
            id: generateId('DEV'),
            ...deviceData,
            status: 'operational',
            lastMaintenance: null,
            lastMaintenanceType: null
        };
        devices.push(newDevice);
        localStorage.setItem('devices', JSON.stringify(devices));
        
        // Add notification
        await NotificationsAPI.create({
            type: 'device',
            title: 'جهاز جديد',
            message: `تمت إضافة ${newDevice.name} إلى النظام`,
            forRoles: ['admin', 'engineer', 'medical_staff']
        });
        
        return { success: true, data: newDevice };
    },

    async update(id, updates) {
        await delay(API_DELAY);
        const devices = JSON.parse(localStorage.getItem('devices') || '[]');
        const index = devices.findIndex(d => d.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الجهاز غير موجود' };
        }
        
        const oldStatus = devices[index].status;
        devices[index] = { ...devices[index], ...updates };
        localStorage.setItem('devices', JSON.stringify(devices));
        
        // Add notification if status changed
        if (updates.status && updates.status !== oldStatus) {
            await NotificationsAPI.create({
                type: 'device',
                title: 'تغيير حالة جهاز',
                message: `تم تغيير حالة ${devices[index].name}`,
                forRoles: ['admin', 'engineer', 'medical_staff']
            });
        }
        
        return { success: true, data: devices[index] };
    },

    async delete(id) {
        await delay(API_DELAY);
        let devices = JSON.parse(localStorage.getItem('devices') || '[]');
        const device = devices.find(d => d.id === id);
        
        if (!device) {
            return { success: false, message: 'الجهاز غير موجود' };
        }
        
        devices = devices.filter(d => d.id !== id);
        localStorage.setItem('devices', JSON.stringify(devices));
        
        return { success: true, message: 'تم حذف الجهاز بنجاح' };
    },

    async getStatistics(department = 'all') {
        await delay(API_DELAY);
        const devices = JSON.parse(localStorage.getItem('devices') || '[]');
        const filtered = department === 'all' 
            ? devices 
            : devices.filter(d => d.department === department);
        
        return {
            success: true,
            data: {
                total: filtered.length,
                operational: filtered.filter(d => d.status === 'operational').length,
                maintenance: filtered.filter(d => d.status === 'maintenance').length,
                outOfService: filtered.filter(d => d.status === 'out_of_service').length,
                byRiskLevel: {
                    critical: filtered.filter(d => d.riskLevel === 'critical').length,
                    high: filtered.filter(d => d.riskLevel === 'high').length,
                    medium: filtered.filter(d => d.riskLevel === 'medium').length,
                    low: filtered.filter(d => d.riskLevel === 'low').length
                }
            }
        };
    }
};

// ==================== MAINTENANCE API ====================

const MaintenanceAPI = {
    async getAll() {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        return { success: true, data: requests };
    },

    async getByStatus(status) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const filtered = status === 'all' 
            ? requests 
            : requests.filter(r => r.status === status);
        return { success: true, data: filtered };
    },

    async getByDepartment(department) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const filtered = department === 'all' 
            ? requests 
            : requests.filter(r => r.department === department);
        return { success: true, data: filtered };
    },

    async getById(id) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const request = requests.find(r => r.id === id);
        return request 
            ? { success: true, data: request }
            : { success: false, message: 'الطلب غير موجود' };
    },

    async create(requestData) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const user = AuthAPI.getCurrentUser();
        
        const newRequest = {
            id: generateId('MR'),
            ...requestData,
            status: 'pending',
            requestedBy: user?.name || 'غير معروف',
            requestDate: new Date().toISOString().split('T')[0],
            assignedTo: null,
            startDate: null,
            completedDate: null,
            notes: '',
            partsUsed: [],
            images: requestData.images || []
        };
        
        requests.push(newRequest);
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
        
        // Update device status
        await DevicesAPI.update(requestData.deviceId, { status: 'maintenance' });
        
        // Add notification
        await NotificationsAPI.create({
            type: 'maintenance',
            title: 'طلب صيانة جديد',
            message: `طلب صيانة جديد لـ ${requestData.deviceName}`,
            forRoles: ['engineer', 'admin']
        });
        
        return { success: true, data: newRequest };
    },

    async update(id, updates) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const index = requests.findIndex(r => r.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الطلب غير موجود' };
        }
        
        requests[index] = { ...requests[index], ...updates };
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
        
        return { success: true, data: requests[index] };
    },

    async updateStatus(id, status, notes = '') {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const index = requests.findIndex(r => r.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الطلب غير موجود' };
        }
        
        const user = AuthAPI.getCurrentUser();
        const updates = { status };
        
        if (status === 'in_progress') {
            updates.startDate = new Date().toISOString().split('T')[0];
            updates.assignedTo = user?.name || 'غير معروف';
        } else if (status === 'completed') {
            updates.completedDate = new Date().toISOString().split('T')[0];
            
            // Update device status back to operational
            await DevicesAPI.update(requests[index].deviceId, { 
                status: 'operational',
                lastMaintenance: updates.completedDate,
                lastMaintenanceType: 'صيانة تصحيحية'
            });
            
            // Add to maintenance history
            const history = JSON.parse(localStorage.getItem('maintenanceHistory') || '[]');
            history.push({
                deviceId: requests[index].deviceId,
                date: updates.completedDate,
                type: 'صيانة تصحيحية',
                technician: user?.name || 'غير معروف',
                notes: notes || requests[index].description,
                cost: 0
            });
            localStorage.setItem('maintenanceHistory', JSON.stringify(history));
        }
        
        if (notes) {
            updates.notes = notes;
        }
        
        requests[index] = { ...requests[index], ...updates };
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
        
        // Add notification
        await NotificationsAPI.create({
            type: 'maintenance',
            title: status === 'completed' ? 'اكتمال صيانة' : 'تحديث طلب صيانة',
            message: `تم تحديث طلب صيانة ${requests[index].deviceName}`,
            forRoles: ['medical_staff', 'admin']
        });
        
        return { success: true, data: requests[index] };
    },

    async addPartsUsed(id, parts) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        const index = requests.findIndex(r => r.id === id);
        
        if (index === -1) {
            return { success: false, message: 'الطلب غير موجود' };
        }
        
        requests[index].partsUsed = [...(requests[index].partsUsed || []), ...parts];
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
        
        // Reduce inventory
        for (const part of parts) {
            await InventoryAPI.reduceQuantity(part.itemId, part.quantity);
        }
        
        return { success: true, data: requests[index] };
    },

    async getHistory(deviceId) {
        await delay(API_DELAY);
        const history = JSON.parse(localStorage.getItem('maintenanceHistory') || '[]');
        const filtered = deviceId 
            ? history.filter(h => h.deviceId === deviceId)
            : history;
        return { success: true, data: filtered.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    },

    async getStatistics() {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        
        return {
            success: true,
            data: {
                total: requests.length,
                pending: requests.filter(r => r.status === 'pending').length,
                inProgress: requests.filter(r => r.status === 'in_progress').length,
                completed: requests.filter(r => r.status === 'completed').length,
                byPriority: {
                    critical: requests.filter(r => r.priority === 'critical').length,
                    high: requests.filter(r => r.priority === 'high').length,
                    medium: requests.filter(r => r.priority === 'medium').length,
                    low: requests.filter(r => r.priority === 'low').length
                }
            }
        };
    }
};

// ==================== INVENTORY API ====================

const InventoryAPI = {
    async getAll() {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        return { success: true, data: inventory };
    },

    async getById(id) {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const item = inventory.find(i => i.id === id);
        return item 
            ? { success: true, data: item }
            : { success: false, message: 'العنصر غير موجود' };
    },

    async getLowStock() {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const lowStock = inventory.filter(i => i.quantity <= i.minQuantity);
        return { success: true, data: lowStock };
    },

    async create(itemData) {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        
        const newItem = {
            id: generateId('INV'),
            ...itemData,
            lastRestocked: new Date().toISOString().split('T')[0],
            usageHistory: []
        };
        
        inventory.push(newItem);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        return { success: true, data: newItem };
    },

    async update(id, updates) {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const index = inventory.findIndex(i => i.id === id);
        
        if (index === -1) {
            return { success: false, message: 'العنصر غير موجود' };
        }
        
        inventory[index] = { ...inventory[index], ...updates };
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        return { success: true, data: inventory[index] };
    },

    async restock(id, quantity) {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const index = inventory.findIndex(i => i.id === id);
        
        if (index === -1) {
            return { success: false, message: 'العنصر غير موجود' };
        }
        
        inventory[index].quantity += quantity;
        inventory[index].lastRestocked = new Date().toISOString().split('T')[0];
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        return { success: true, data: inventory[index] };
    },

    async reduceQuantity(id, quantity, department = '') {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const index = inventory.findIndex(i => i.id === id);
        
        if (index === -1) {
            return { success: false, message: 'العنصر غير موجود' };
        }
        
        if (inventory[index].quantity < quantity) {
            return { success: false, message: 'الكمية المطلوبة غير متوفرة' };
        }
        
        inventory[index].quantity -= quantity;
        inventory[index].usageHistory.push({
            date: new Date().toISOString().split('T')[0],
            quantity: quantity,
            department: department
        });
        
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        // Check if low stock and send notification
        if (inventory[index].quantity <= inventory[index].minQuantity) {
            await NotificationsAPI.create({
                type: 'inventory',
                title: 'تنبيه مخزون منخفض',
                message: `${inventory[index].name} وصل للحد الأدنى`,
                forRoles: ['inventory_manager', 'admin']
            });
        }
        
        return { success: true, data: inventory[index] };
    },

    async delete(id) {
        await delay(API_DELAY);
        let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        inventory = inventory.filter(i => i.id !== id);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        return { success: true, message: 'تم حذف العنصر بنجاح' };
    },

    async getStatistics() {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        
        const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const categories = [...new Set(inventory.map(i => i.category))];
        const categoryStats = categories.map(cat => ({
            name: cat,
            count: inventory.filter(i => i.category === cat).length,
            value: inventory.filter(i => i.category === cat).reduce((sum, item) => sum + (item.quantity * item.price), 0)
        }));
        
        return {
            success: true,
            data: {
                totalItems: inventory.length,
                totalValue: totalValue,
                lowStockCount: inventory.filter(i => i.quantity <= i.minQuantity).length,
                okStockCount: inventory.filter(i => i.quantity > i.minQuantity).length,
                byCategory: categoryStats
            }
        };
    },

    async getUsageAnalytics() {
        await delay(API_DELAY);
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        
        // Calculate usage by item
        const usageByItem = inventory.map(item => ({
            id: item.id,
            name: item.name,
            totalUsage: item.usageHistory.reduce((sum, h) => sum + h.quantity, 0)
        })).sort((a, b) => b.totalUsage - a.totalUsage);
        
        // Calculate usage by department
        const allUsage = inventory.flatMap(item => item.usageHistory);
        const departments = [...new Set(allUsage.map(u => u.department))];
        const usageByDept = departments.map(dept => ({
            department: dept,
            totalUsage: allUsage.filter(u => u.department === dept).reduce((sum, u) => sum + u.quantity, 0)
        }));
        
        return {
            success: true,
            data: {
                mostUsed: usageByItem.slice(0, 5),
                byDepartment: usageByDept
            }
        };
    }
};

// ==================== NOTIFICATIONS API ====================

const NotificationsAPI = {
    async getAll() {
        await delay(API_DELAY);
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        return { success: true, data: notifications.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    },

    async getForUser() {
        await delay(API_DELAY);
        const user = AuthAPI.getCurrentUser();
        if (!user) return { success: true, data: [] };
        
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const filtered = notifications.filter(n => n.forRoles.includes(user.role));
        return { success: true, data: filtered.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    },

    async getUnreadCount() {
        await delay(API_DELAY);
        const user = AuthAPI.getCurrentUser();
        if (!user) return { success: true, data: 0 };
        
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const unread = notifications.filter(n => n.forRoles.includes(user.role) && !n.read);
        return { success: true, data: unread.length };
    },

    async create(notificationData) {
        await delay(API_DELAY);
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        const newNotification = {
            id: generateId('N'),
            ...notificationData,
            date: new Date().toISOString(),
            read: false
        };
        
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        return { success: true, data: newNotification };
    },

    async markAsRead(id) {
        await delay(API_DELAY);
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const index = notifications.findIndex(n => n.id === id);
        
        if (index !== -1) {
            notifications[index].read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
        
        return { success: true };
    },

    async markAllAsRead() {
        await delay(API_DELAY);
        const user = AuthAPI.getCurrentUser();
        if (!user) return { success: true };
        
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.forEach(n => {
            if (n.forRoles.includes(user.role)) {
                n.read = true;
            }
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        return { success: true };
    },

    async delete(id) {
        await delay(API_DELAY);
        let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications = notifications.filter(n => n.id !== id);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        return { success: true };
    }
};

// ==================== REPORTS API ====================

const ReportsAPI = {
    async generateDevicesReport(filters = {}) {
        await delay(API_DELAY);
        let devices = JSON.parse(localStorage.getItem('devices') || '[]');
        
        if (filters.department && filters.department !== 'all') {
            devices = devices.filter(d => d.department === filters.department);
        }
        if (filters.status && filters.status !== 'all') {
            devices = devices.filter(d => d.status === filters.status);
        }
        
        // Calculate statistics for charts
        const stats = {
            byStatus: {
                operational: devices.filter(d => d.status === 'operational').length,
                maintenance: devices.filter(d => d.status === 'maintenance').length,
                out_of_service: devices.filter(d => d.status === 'out_of_service').length
            },
            byRisk: {
                critical: devices.filter(d => d.riskLevel === 'critical').length,
                high: devices.filter(d => d.riskLevel === 'high').length,
                medium: devices.filter(d => d.riskLevel === 'medium').length,
                low: devices.filter(d => d.riskLevel === 'low').length
            },
            byDepartment: {}
        };
        
        devices.forEach(d => {
            stats.byDepartment[d.department] = (stats.byDepartment[d.department] || 0) + 1;
        });
        
        return { success: true, data: devices, stats };
    },

    async generateMaintenanceReport(filters = {}) {
        await delay(API_DELAY);
        let requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        
        if (filters.department && filters.department !== 'all') {
            requests = requests.filter(r => r.department === filters.department);
        }
        if (filters.status && filters.status !== 'all') {
            requests = requests.filter(r => r.status === filters.status);
        }
        if (filters.dateFrom) {
            requests = requests.filter(r => r.requestDate >= filters.dateFrom);
        }
        if (filters.dateTo) {
            requests = requests.filter(r => r.requestDate <= filters.dateTo);
        }
        
        // Calculate statistics for charts
        const stats = {
            byStatus: {
                pending: requests.filter(r => r.status === 'pending').length,
                in_progress: requests.filter(r => r.status === 'in_progress').length,
                completed: requests.filter(r => r.status === 'completed').length
            },
            byPriority: {
                critical: requests.filter(r => r.priority === 'critical').length,
                high: requests.filter(r => r.priority === 'high').length,
                medium: requests.filter(r => r.priority === 'medium').length,
                low: requests.filter(r => r.priority === 'low').length
            },
            byDepartment: {},
            trend: {}
        };
        
        requests.forEach(r => {
            stats.byDepartment[r.department] = (stats.byDepartment[r.department] || 0) + 1;
            const month = r.requestDate.substring(0, 7);
            stats.trend[month] = (stats.trend[month] || 0) + 1;
        });
        
        return { success: true, data: requests, stats };
    },

    async generateInventoryReport(filters = {}) {
        await delay(API_DELAY);
        let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        
        if (filters.category && filters.category !== 'all') {
            inventory = inventory.filter(i => i.category === filters.category);
        }
        if (filters.stockStatus === 'low') {
            inventory = inventory.filter(i => i.quantity <= i.minQuantity);
        } else if (filters.stockStatus === 'ok') {
            inventory = inventory.filter(i => i.quantity > i.minQuantity);
        }
        
        // Calculate statistics for charts
        const stats = {
            byCategory: {},
            stockStatus: {
                ok: inventory.filter(i => i.quantity > i.minQuantity).length,
                low: inventory.filter(i => i.quantity <= i.minQuantity && i.quantity > 0).length,
                out: inventory.filter(i => i.quantity === 0).length
            },
            totalValue: inventory.reduce((sum, i) => sum + (i.quantity * i.price), 0),
            mostUsed: []
        };
        
        inventory.forEach(i => {
            stats.byCategory[i.category] = (stats.byCategory[i.category] || 0) + 1;
        });
        
        // Get most used items
        stats.mostUsed = inventory
            .map(i => ({
                name: i.name,
                usage: i.usageHistory.reduce((sum, h) => sum + h.quantity, 0)
            }))
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 5);
        
        return { success: true, data: inventory, stats };
    },

    async generateEngineersReport(filters = {}) {
        await delay(API_DELAY);
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        
        // Group by engineer
        const engineerStats = {};
        requests.forEach(r => {
            if (r.assignedTo) {
                if (!engineerStats[r.assignedTo]) {
                    engineerStats[r.assignedTo] = {
                        name: r.assignedTo,
                        total: 0,
                        completed: 0,
                        inProgress: 0,
                        avgTime: []
                    };
                }
                engineerStats[r.assignedTo].total++;
                if (r.status === 'completed') {
                    engineerStats[r.assignedTo].completed++;
                    if (r.startDate && r.completedDate) {
                        const days = Math.ceil((new Date(r.completedDate) - new Date(r.startDate)) / (1000 * 60 * 60 * 24));
                        engineerStats[r.assignedTo].avgTime.push(days);
                    }
                } else if (r.status === 'in_progress') {
                    engineerStats[r.assignedTo].inProgress++;
                }
            }
        });
        
        const data = Object.values(engineerStats).map(e => ({
            ...e,
            avgTime: e.avgTime.length ? (e.avgTime.reduce((a, b) => a + b, 0) / e.avgTime.length).toFixed(1) : 0,
            completionRate: e.total ? ((e.completed / e.total) * 100).toFixed(1) : 0
        }));
        
        return { success: true, data };
    },

    async generateCostsReport(filters = {}) {
        await delay(API_DELAY);
        const history = JSON.parse(localStorage.getItem('maintenanceHistory') || '[]');
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        
        let filtered = history;
        if (filters.dateFrom) {
            filtered = filtered.filter(h => h.date >= filters.dateFrom);
        }
        if (filters.dateTo) {
            filtered = filtered.filter(h => h.date <= filters.dateTo);
        }
        
        const stats = {
            totalMaintenanceCost: filtered.reduce((sum, h) => sum + (h.cost || 0), 0),
            totalInventoryValue: inventory.reduce((sum, i) => sum + (i.quantity * i.price), 0),
            costByMonth: {},
            costByDepartment: {}
        };
        
        filtered.forEach(h => {
            const month = h.date.substring(0, 7);
            stats.costByMonth[month] = (stats.costByMonth[month] || 0) + (h.cost || 0);
        });
        
        return { success: true, data: filtered, stats };
    },

    exportToCSV(data, filename) {
        if (!data || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },

    exportToExcel(data, filename, sheetName = 'Sheet1') {
        if (!data || data.length === 0) return;
        
        // Create simple Excel-like format (actually CSV with xlsx extension for simplicity)
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join('\t'),
            ...data.map(row => headers.map(h => row[h] || '').join('\t'))
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
    }
};

// ==================== COMMON HELPER FUNCTIONS ====================

const apiService = {
    async getDepartments() {
        return [
            { id: 'cardiology', name: 'قسم القلب' },
            { id: 'radiology', name: 'قسم الأشعة' },
            { id: 'icu', name: 'العناية المركزة' },
            { id: 'emergency', name: 'الطوارئ' },
            { id: 'surgery', name: 'الجراحة' },
            { id: 'laboratory', name: 'المختبر' }
        ];
    },

    async getDeviceTypes() {
        return [
            { id: 'diagnostic', name: 'تشخيصي' },
            { id: 'imaging', name: 'تصوير' },
            { id: 'monitoring', name: 'مراقبة' },
            { id: 'life_support', name: 'دعم الحياة' },
            { id: 'therapeutic', name: 'علاجي' },
            { id: 'laboratory', name: 'مختبر' },
            { id: 'emergency', name: 'طوارئ' }
        ];
    },

    async getDevices() {
        const result = await DevicesAPI.getAll();
        return result.data || [];
    },

    async getEngineers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.role === 'engineer');
    },

    async getMaintenanceRequests() {
        const result = await MaintenanceAPI.getAll();
        return result.data || [];
    },

    async getInventory() {
        const result = await InventoryAPI.getAll();
        return result.data || [];
    }
};

// ==================== COMMON FUNCTIONS FOR ALL PAGES ====================

function checkAuth() {
    if (!AuthAPI.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function initializeSidebar() {
    const user = AuthAPI.getCurrentUser();
    if (!user) return;

    // Update user info
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    if (userAvatar) userAvatar.textContent = user.name.charAt(0);
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = getRoleText(user.role);

    // Build sidebar navigation
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;

    let navHTML = '';

    // Dashboard - all roles
    navHTML += `
        <a href="dashboard.html" class="nav-item ${isCurrentPage('dashboard') ? 'active' : ''}">
            <i class="fas fa-tachometer-alt"></i>
            <span>لوحة التحكم</span>
        </a>
    `;

    // Devices - all roles but different views
    if (['admin', 'engineer', 'medical_staff', 'inventory_manager'].includes(user.role)) {
        navHTML += `
            <a href="devices.html" class="nav-item ${isCurrentPage('devices') ? 'active' : ''}">
                <i class="fas fa-laptop-medical"></i>
                <span>الأجهزة الطبية</span>
            </a>
        `;
    }

    // My Requests - medical staff only
    if (user.role === 'medical_staff') {
        navHTML += `
            <a href="my-requests.html" class="nav-item ${isCurrentPage('my-requests') ? 'active' : ''}">
                <i class="fas fa-clipboard-list"></i>
                <span>طلباتي</span>
            </a>
        `;
    }

    // Maintenance - engineer and admin
    if (['admin', 'engineer'].includes(user.role)) {
        navHTML += `
            <a href="maintenance.html" class="nav-item ${isCurrentPage('maintenance') ? 'active' : ''}">
                <i class="fas fa-tools"></i>
                <span>الصيانة</span>
            </a>
        `;
    }

    // Inventory - inventory manager, engineer, admin
    if (['admin', 'engineer', 'inventory_manager'].includes(user.role)) {
        navHTML += `
            <a href="inventory.html" class="nav-item ${isCurrentPage('inventory') ? 'active' : ''}">
                <i class="fas fa-boxes"></i>
                <span>المخزون</span>
            </a>
        `;
    }

    // Reports - admin and engineer
    if (['admin', 'engineer'].includes(user.role)) {
        navHTML += `
            <a href="reports.html" class="nav-item ${isCurrentPage('reports') ? 'active' : ''}">
                <i class="fas fa-chart-bar"></i>
                <span>التقارير</span>
            </a>
        `;
    }

    // Admin - admin only
    if (user.role === 'admin') {
        navHTML += `
            <a href="admin.html" class="nav-item ${isCurrentPage('admin') ? 'active' : ''}">
                <i class="fas fa-cog"></i>
                <span>الإدارة</span>
            </a>
        `;
    }

    sidebarNav.innerHTML = navHTML;
}

function isCurrentPage(pageName) {
    return window.location.pathname.includes(pageName);
}

function getRoleText(role) {
    const roles = {
        'admin': 'مدير النظام',
        'engineer': 'مهندس الصيانة',
        'medical_staff': 'الطاقم الطبي',
        'inventory_manager': 'مدير المخزون'
    };
    return roles[role] || role;
}

function getDepartmentText(dept) {
    const departments = {
        'cardiology': 'قسم القلب',
        'radiology': 'قسم الأشعة',
        'icu': 'العناية المركزة',
        'emergency': 'الطوارئ',
        'surgery': 'الجراحة',
        'laboratory': 'المختبر',
        'all': 'جميع الأقسام'
    };
    return departments[dept] || dept;
}

function getStatusText(status) {
    const statuses = {
        'operational': 'يعمل',
        'working': 'يعمل',
        'maintenance': 'قيد الصيانة',
        'out_of_service': 'خارج الخدمة',
        'pending': 'قيد الانتظار',
        'in_progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statuses[status] || status;
}

function getPriorityText(priority) {
    const priorities = {
        'critical': 'حرجة',
        'high': 'عالية',
        'medium': 'متوسطة',
        'low': 'منخفضة'
    };
    return priorities[priority] || priority;
}

function getPriorityClass(priority) {
    const classes = {
        'critical': 'badge-danger',
        'high': 'badge-warning',
        'medium': 'badge-info',
        'low': 'badge-secondary'
    };
    return classes[priority] || 'badge-secondary';
}

function getIssueTypeText(type) {
    const types = {
        'malfunction': 'خلل في التشغيل',
        'damage': 'تلف مادي',
        'calibration': 'يحتاج معايرة',
        'software': 'مشكلة برمجية',
        'electrical': 'مشكلة كهربائية',
        'mechanical': 'مشكلة ميكانيكية',
        'other': 'أخرى'
    };
    return types[type] || type;
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

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function logout() {
    AuthAPI.logout();
    window.location.href = 'index.html';
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

// Initialize data on load
initializeData();
