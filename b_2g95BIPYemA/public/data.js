/**
 * SMEMS - Smart Medical Equipment Management System
 * Static Data File - All system data in one place
 */

// ==================== DEPARTMENTS ====================
const DEPARTMENTS = [
    { id: 'cardiology', name: 'قسم القلب', shortName: 'القلب' },
    { id: 'radiology', name: 'قسم الأشعة', shortName: 'الأشعة' },
    { id: 'icu', name: 'العناية المركزة', shortName: 'ICU' },
    { id: 'emergency', name: 'الطوارئ', shortName: 'الطوارئ' },
    { id: 'surgery', name: 'الجراحة', shortName: 'الجراحة' },
    { id: 'laboratory', name: 'المختبر', shortName: 'المختبر' },
    { id: 'all', name: 'جميع الأقسام', shortName: 'الكل' }
];

// ==================== USERS ====================
const USERS = [
    { 
        id: 'U001', 
        username: 'admin', 
        password: 'admin123', 
        name: 'مدير النظام', 
        role: 'admin', 
        department: 'all',
        email: 'admin@hospital.com',
        phone: '0501234567'
    },
    { 
        id: 'U002', 
        username: 'doctor', 
        password: 'doctor123', 
        name: 'د. أحمد محمد', 
        role: 'medical_staff', 
        department: 'cardiology',
        email: 'ahmed@hospital.com',
        phone: '0502345678'
    },
    { 
        id: 'U003', 
        username: 'nurse', 
        password: 'nurse123', 
        name: 'فاطمة الزهراء', 
        role: 'medical_staff', 
        department: 'icu',
        email: 'fatima@hospital.com',
        phone: '0503456789'
    },
    { 
        id: 'U004', 
        username: 'engineer', 
        password: 'eng123', 
        name: 'م. خالد العمري', 
        role: 'engineer', 
        department: 'all',
        email: 'khaled@hospital.com',
        phone: '0504567890'
    },
    { 
        id: 'U005', 
        username: 'engineer2', 
        password: 'eng123', 
        name: 'م. فهد السعيد', 
        role: 'engineer', 
        department: 'all',
        email: 'fahad@hospital.com',
        phone: '0505678901'
    },
    { 
        id: 'U006', 
        username: 'inventory', 
        password: 'inv123', 
        name: 'سالم العتيبي', 
        role: 'inventory_manager', 
        department: 'all',
        email: 'salem@hospital.com',
        phone: '0506789012'
    }
];

// ==================== DEVICES ====================
const DEVICES = [
    {
        id: 'DEV001',
        name: 'جهاز تخطيط القلب',
        serialNumber: 'ECG-2024-001',
        manufacturer: 'Philips',
        model: 'PageWriter TC70',
        supplier: 'شركة الفيليبس الطبية',
        category: 'تشخيصي',
        type: 'ecg',
        department: 'cardiology',
        status: 'operational',
        riskLevel: 'high',
        purchaseDate: '2022-03-15',
        warrantyExpiry: '2025-03-15',
        expectedLifetime: '10 سنوات',
        lastMaintenance: '2024-01-10',
        lastMaintenanceType: 'صيانة دورية',
        nextMaintenance: '2024-07-10',
        location: 'غرفة 101',
        notes: 'يعمل بشكل ممتاز',
        accessories: ['كابلات ECG', 'أقطاب ECG', 'ورق تخطيط'],
        maintenanceHistory: [
            { date: '2024-01-10', type: 'صيانة دورية', engineer: 'م. خالد العمري', notes: 'فحص شامل وتنظيف', cost: 150 },
            { date: '2023-07-15', type: 'صيانة وقائية', engineer: 'م. فهد السعيد', notes: 'تحديث البرنامج', cost: 0 },
            { date: '2023-01-20', type: 'معايرة', engineer: 'م. خالد العمري', notes: 'معايرة سنوية', cost: 200 }
        ]
    },
    {
        id: 'DEV002',
        name: 'جهاز الأشعة السينية',
        serialNumber: 'XR-2024-002',
        manufacturer: 'Siemens',
        model: 'MOBILETT Elara Max',
        supplier: 'سيمنس للرعاية الصحية',
        category: 'تصوير',
        type: 'xray',
        department: 'radiology',
        status: 'operational',
        riskLevel: 'high',
        purchaseDate: '2021-08-20',
        warrantyExpiry: '2024-08-20',
        expectedLifetime: '15 سنة',
        lastMaintenance: '2024-02-05',
        lastMaintenanceType: 'صيانة وقائية',
        nextMaintenance: '2024-08-05',
        location: 'غرفة الأشعة 1',
        notes: 'ينتهي الضمان قريباً',
        accessories: ['مصباح الأشعة', 'لوحة التحكم'],
        maintenanceHistory: [
            { date: '2024-02-05', type: 'صيانة وقائية', engineer: 'م. خالد العمري', notes: 'فحص الأمان الإشعاعي', cost: 300 },
            { date: '2023-08-10', type: 'صيانة دورية', engineer: 'م. فهد السعيد', notes: 'استبدال المصباح', cost: 1200 }
        ]
    },
    {
        id: 'DEV003',
        name: 'جهاز مراقبة المريض',
        serialNumber: 'PM-2024-003',
        manufacturer: 'GE Healthcare',
        model: 'CARESCAPE B650',
        supplier: 'جي اي للرعاية الصحية',
        category: 'مراقبة',
        type: 'monitor',
        department: 'icu',
        status: 'maintenance',
        riskLevel: 'critical',
        purchaseDate: '2023-01-10',
        warrantyExpiry: '2026-01-10',
        expectedLifetime: '8 سنوات',
        lastMaintenance: '2024-03-01',
        lastMaintenanceType: 'صيانة تصحيحية',
        nextMaintenance: '2024-06-01',
        location: 'العناية المركزة - سرير 5',
        notes: 'بحاجة لاستبدال البطارية',
        accessories: ['بطارية', 'كابلات المراقبة', 'حساسات SpO2'],
        maintenanceHistory: [
            { date: '2024-03-01', type: 'صيانة تصحيحية', engineer: 'م. خالد العمري', notes: 'مشكلة في البطارية - جاري الإصلاح', cost: 250 },
            { date: '2023-09-15', type: 'صيانة دورية', engineer: 'م. فهد السعيد', notes: 'فحص شامل', cost: 100 }
        ]
    },
    {
        id: 'DEV004',
        name: 'جهاز التنفس الصناعي',
        serialNumber: 'VT-2024-004',
        manufacturer: 'Draeger',
        model: 'Evita V500',
        supplier: 'دراجر الطبية',
        category: 'دعم الحياة',
        type: 'ventilator',
        department: 'icu',
        status: 'operational',
        riskLevel: 'critical',
        purchaseDate: '2022-06-15',
        warrantyExpiry: '2025-06-15',
        expectedLifetime: '10 سنوات',
        lastMaintenance: '2024-02-20',
        lastMaintenanceType: 'صيانة دورية',
        nextMaintenance: '2024-08-20',
        location: 'العناية المركزة - غرفة 3',
        notes: '',
        accessories: ['فلاتر', 'دوائر التنفس', 'مرطبات'],
        maintenanceHistory: [
            { date: '2024-02-20', type: 'صيانة دورية', engineer: 'م. فهد السعيد', notes: 'فحص شامل واستبدال الفلاتر', cost: 180 },
            { date: '2023-08-25', type: 'معايرة', engineer: 'م. خالد العمري', notes: 'معايرة أجهزة الاستشعار', cost: 150 }
        ]
    },
    {
        id: 'DEV005',
        name: 'جهاز الموجات فوق الصوتية',
        serialNumber: 'US-2024-005',
        manufacturer: 'Samsung',
        model: 'HS70A',
        supplier: 'سامسونج الطبية',
        category: 'تصوير',
        type: 'ultrasound',
        department: 'radiology',
        status: 'out_of_service',
        riskLevel: 'medium',
        purchaseDate: '2020-11-30',
        warrantyExpiry: '2023-11-30',
        expectedLifetime: '12 سنة',
        lastMaintenance: '2024-01-15',
        lastMaintenanceType: 'صيانة تصحيحية',
        nextMaintenance: '2024-04-15',
        location: 'غرفة الموجات الصوتية',
        notes: 'بانتظار قطع غيار - المسبار تالف',
        accessories: ['مسبار البطن', 'مسبار القلب', 'جل'],
        maintenanceHistory: [
            { date: '2024-01-15', type: 'صيانة تصحيحية', engineer: 'م. خالد العمري', notes: 'مشكلة في المسبار - بانتظار قطع غيار', cost: 500 },
            { date: '2023-07-20', type: 'صيانة دورية', engineer: 'م. فهد السعيد', notes: 'فحص وتنظيف', cost: 100 }
        ]
    },
    {
        id: 'DEV006',
        name: 'جهاز صدمات القلب',
        serialNumber: 'DF-2024-006',
        manufacturer: 'Zoll',
        model: 'R Series',
        supplier: 'زول الطبية',
        category: 'طوارئ',
        type: 'defibrillator',
        department: 'emergency',
        status: 'operational',
        riskLevel: 'critical',
        purchaseDate: '2023-04-01',
        warrantyExpiry: '2026-04-01',
        expectedLifetime: '8 سنوات',
        lastMaintenance: '2024-02-28',
        lastMaintenanceType: 'فحص دوري',
        nextMaintenance: '2024-05-28',
        location: 'غرفة الطوارئ',
        notes: 'يجب فحصه شهرياً',
        accessories: ['أقطاب الصدمات', 'بطارية احتياطية'],
        maintenanceHistory: [
            { date: '2024-02-28', type: 'فحص دوري', engineer: 'م. خالد العمري', notes: 'فحص جاهزية الجهاز', cost: 50 },
            { date: '2024-01-28', type: 'فحص دوري', engineer: 'م. فهد السعيد', notes: 'فحص البطارية والأقطاب', cost: 50 }
        ]
    },
    {
        id: 'DEV007',
        name: 'مضخة التسريب الوريدي',
        serialNumber: 'IP-2024-007',
        manufacturer: 'B. Braun',
        model: 'Infusomat Space',
        supplier: 'بي براون الطبية',
        category: 'علاجي',
        type: 'infusion_pump',
        department: 'surgery',
        status: 'operational',
        riskLevel: 'high',
        purchaseDate: '2023-02-20',
        warrantyExpiry: '2026-02-20',
        expectedLifetime: '7 سنوات',
        lastMaintenance: '2024-01-25',
        lastMaintenanceType: 'معايرة',
        nextMaintenance: '2024-07-25',
        location: 'غرفة العمليات 2',
        notes: '',
        accessories: ['مجموعات التسريب'],
        maintenanceHistory: [
            { date: '2024-01-25', type: 'معايرة', engineer: 'م. فهد السعيد', notes: 'معايرة معدل التدفق', cost: 100 }
        ]
    },
    {
        id: 'DEV008',
        name: 'جهاز تحليل الدم',
        serialNumber: 'BA-2024-008',
        manufacturer: 'Sysmex',
        model: 'XN-1000',
        supplier: 'سيسمكس الطبية',
        category: 'مختبر',
        type: 'blood_analyzer',
        department: 'laboratory',
        status: 'maintenance',
        riskLevel: 'medium',
        purchaseDate: '2021-09-10',
        warrantyExpiry: '2024-09-10',
        expectedLifetime: '10 سنوات',
        lastMaintenance: '2024-03-05',
        lastMaintenanceType: 'صيانة وقائية',
        nextMaintenance: '2024-06-05',
        location: 'المختبر الرئيسي',
        notes: 'يحتاج معايرة',
        accessories: ['محاليل التحليل', 'أنابيب العينات'],
        maintenanceHistory: [
            { date: '2024-03-05', type: 'صيانة وقائية', engineer: 'م. فهد السعيد', notes: 'جاري المعايرة', cost: 200 },
            { date: '2023-09-10', type: 'صيانة دورية', engineer: 'م. خالد العمري', notes: 'فحص شامل', cost: 150 }
        ]
    },
    {
        id: 'DEV009',
        name: 'جهاز التخدير',
        serialNumber: 'AN-2024-009',
        manufacturer: 'Mindray',
        model: 'A7',
        supplier: 'مايندراي الطبية',
        category: 'تخدير',
        type: 'anesthesia',
        department: 'surgery',
        status: 'operational',
        riskLevel: 'critical',
        purchaseDate: '2022-12-01',
        warrantyExpiry: '2025-12-01',
        expectedLifetime: '10 سنوات',
        lastMaintenance: '2024-02-10',
        lastMaintenanceType: 'صيانة دورية',
        nextMaintenance: '2024-08-10',
        location: 'غرفة العمليات 1',
        notes: '',
        accessories: ['دوائر التخدير', 'أقنعة التخدير', 'مبخرات'],
        maintenanceHistory: [
            { date: '2024-02-10', type: 'صيانة دورية', engineer: 'م. خالد العمري', notes: 'فحص شامل واختبار الأمان', cost: 250 }
        ]
    },
    {
        id: 'DEV010',
        name: 'سرير كهربائي',
        serialNumber: 'EB-2024-010',
        manufacturer: 'Hill-Rom',
        model: 'Centrella Smart+',
        supplier: 'هيل روم الطبية',
        category: 'أثاث طبي',
        type: 'bed',
        department: 'icu',
        status: 'operational',
        riskLevel: 'low',
        purchaseDate: '2023-05-15',
        warrantyExpiry: '2028-05-15',
        expectedLifetime: '15 سنة',
        lastMaintenance: '2024-01-30',
        lastMaintenanceType: 'فحص',
        nextMaintenance: '2024-07-30',
        location: 'العناية المركزة - سرير 2',
        notes: '',
        accessories: ['فرشة هوائية', 'حواجز السرير'],
        maintenanceHistory: [
            { date: '2024-01-30', type: 'فحص', engineer: 'م. فهد السعيد', notes: 'فحص المحركات والأزرار', cost: 50 }
        ]
    },
    {
        id: 'DEV011',
        name: 'جهاز قياس ضغط الدم',
        serialNumber: 'BP-2024-011',
        manufacturer: 'Omron',
        model: 'HEM-907XL',
        supplier: 'أومرون الطبية',
        category: 'تشخيصي',
        type: 'blood_pressure',
        department: 'cardiology',
        status: 'operational',
        riskLevel: 'low',
        purchaseDate: '2023-08-10',
        warrantyExpiry: '2025-08-10',
        expectedLifetime: '5 سنوات',
        lastMaintenance: '2024-02-15',
        lastMaintenanceType: 'معايرة',
        nextMaintenance: '2024-08-15',
        location: 'غرفة 102',
        notes: '',
        accessories: ['أساور قياس بأحجام مختلفة'],
        maintenanceHistory: [
            { date: '2024-02-15', type: 'معايرة', engineer: 'م. خالد العمري', notes: 'معايرة سنوية', cost: 50 }
        ]
    },
    {
        id: 'DEV012',
        name: 'جهاز غسيل الكلى',
        serialNumber: 'DL-2024-012',
        manufacturer: 'Fresenius',
        model: '5008S',
        supplier: 'فريزينيوس الطبية',
        category: 'علاجي',
        type: 'dialysis',
        department: 'icu',
        status: 'operational',
        riskLevel: 'critical',
        purchaseDate: '2022-01-20',
        warrantyExpiry: '2025-01-20',
        expectedLifetime: '10 سنوات',
        lastMaintenance: '2024-03-01',
        lastMaintenanceType: 'صيانة دورية',
        nextMaintenance: '2024-06-01',
        location: 'وحدة غسيل الكلى',
        notes: 'يستخدم يومياً',
        accessories: ['فلاتر الغسيل', 'خراطيم الدم'],
        maintenanceHistory: [
            { date: '2024-03-01', type: 'صيانة دورية', engineer: 'م. فهد السعيد', notes: 'فحص وتنظيف شامل', cost: 300 }
        ]
    }
];

// ==================== MAINTENANCE REQUESTS ====================
const MAINTENANCE_REQUESTS = [
    {
        id: 'MR001',
        deviceId: 'DEV003',
        deviceName: 'جهاز مراقبة المريض',
        serialNumber: 'PM-2024-003',
        department: 'icu',
        issueType: 'electrical',
        description: 'البطارية لا تشحن بشكل صحيح والجهاز ينطفئ فجأة',
        priority: 'high',
        status: 'in_progress',
        type: 'corrective',
        requestedBy: 'فاطمة الزهراء',
        requestedById: 'U003',
        requestDate: '2024-03-01T10:30:00',
        assignedTo: 'م. خالد العمري',
        assignedToId: 'U004',
        startDate: '2024-03-02T09:00:00',
        completedDate: null,
        estimatedTime: 4,
        notes: 'تم طلب بطارية جديدة من المورد',
        partsUsed: [],
        hasAlternative: true,
        images: [],
        updates: [
            { date: '2024-03-02T09:00:00', status: 'بدء العمل', note: 'تم استلام الطلب وبدء الفحص', by: 'م. خالد العمري' },
            { date: '2024-03-02T11:30:00', status: 'تحديث', note: 'تم تشخيص المشكلة - البطارية تالفة ويلزم استبدالها', by: 'م. خالد العمري' },
            { date: '2024-03-03T14:00:00', status: 'تحديث', note: 'تم طلب البطارية من المورد - وقت التوصيل المتوقع 3 أيام', by: 'م. خالد العمري' }
        ]
    },
    {
        id: 'MR002',
        deviceId: 'DEV005',
        deviceName: 'جهاز الموجات فوق الصوتية',
        serialNumber: 'US-2024-005',
        department: 'radiology',
        issueType: 'mechanical',
        description: 'مشكلة في المسبار - الصورة غير واضحة وتظهر خطوط',
        priority: 'critical',
        status: 'pending',
        type: 'corrective',
        requestedBy: 'د. أحمد محمد',
        requestedById: 'U002',
        requestDate: '2024-03-10T08:15:00',
        assignedTo: null,
        assignedToId: null,
        startDate: null,
        completedDate: null,
        estimatedTime: 8,
        notes: '',
        partsUsed: [],
        hasAlternative: false,
        images: [],
        updates: []
    },
    {
        id: 'MR003',
        deviceId: 'DEV008',
        deviceName: 'جهاز تحليل الدم',
        serialNumber: 'BA-2024-008',
        department: 'laboratory',
        issueType: 'calibration',
        description: 'يحتاج معايرة دورية - النتائج غير دقيقة',
        priority: 'medium',
        status: 'in_progress',
        type: 'preventive',
        requestedBy: 'فني المختبر',
        requestedById: 'U002',
        requestDate: '2024-03-05T13:45:00',
        assignedTo: 'م. فهد السعيد',
        assignedToId: 'U005',
        startDate: '2024-03-06T10:00:00',
        completedDate: null,
        estimatedTime: 3,
        notes: 'جاري العمل على المعايرة',
        partsUsed: ['محاليل المعايرة'],
        hasAlternative: true,
        images: [],
        updates: [
            { date: '2024-03-06T10:00:00', status: 'بدء العمل', note: 'بدء إجراءات المعايرة', by: 'م. فهد السعيد' }
        ]
    },
    {
        id: 'MR004',
        deviceId: 'DEV001',
        deviceName: 'جهاز تخطيط القلب',
        serialNumber: 'ECG-2024-001',
        department: 'cardiology',
        issueType: 'software',
        description: 'تحديث البرنامج مطلوب - إصدار جديد متاح',
        priority: 'low',
        status: 'completed',
        type: 'preventive',
        requestedBy: 'د. أحمد محمد',
        requestedById: 'U002',
        requestDate: '2024-02-15T11:00:00',
        assignedTo: 'م. خالد العمري',
        assignedToId: 'U004',
        startDate: '2024-02-16T09:00:00',
        completedDate: '2024-02-17T14:30:00',
        estimatedTime: 2,
        notes: 'تم تحديث البرنامج بنجاح إلى الإصدار 3.5',
        partsUsed: [],
        hasAlternative: true,
        images: [],
        updates: [
            { date: '2024-02-16T09:00:00', status: 'بدء العمل', note: 'بدء تحديث البرنامج', by: 'م. خالد العمري' },
            { date: '2024-02-17T14:30:00', status: 'مكتمل', note: 'تم التحديث بنجاح واختبار الجهاز', by: 'م. خالد العمري' }
        ]
    },
    {
        id: 'MR005',
        deviceId: 'DEV006',
        deviceName: 'جهاز صدمات القلب',
        serialNumber: 'DF-2024-006',
        department: 'emergency',
        issueType: 'inspection',
        description: 'فحص دوري شهري للتأكد من جاهزية الجهاز',
        priority: 'high',
        status: 'scheduled',
        type: 'preventive',
        requestedBy: 'النظام',
        requestedById: 'system',
        requestDate: '2024-03-25T00:00:00',
        scheduledDate: '2024-03-28T10:00:00',
        assignedTo: 'م. خالد العمري',
        assignedToId: 'U004',
        startDate: null,
        completedDate: null,
        estimatedTime: 1,
        notes: 'فحص دوري مجدول',
        partsUsed: [],
        hasAlternative: false,
        images: [],
        updates: []
    },
    {
        id: 'MR006',
        deviceId: 'DEV004',
        deviceName: 'جهاز التنفس الصناعي',
        serialNumber: 'VT-2024-004',
        department: 'icu',
        issueType: 'filter',
        description: 'استبدال الفلاتر الدورية',
        priority: 'medium',
        status: 'completed',
        type: 'preventive',
        requestedBy: 'فاطمة الزهراء',
        requestedById: 'U003',
        requestDate: '2024-02-18T09:00:00',
        assignedTo: 'م. فهد السعيد',
        assignedToId: 'U005',
        startDate: '2024-02-20T08:00:00',
        completedDate: '2024-02-20T10:30:00',
        estimatedTime: 2,
        notes: 'تم استبدال الفلاتر بنجاح',
        partsUsed: ['فلتر جهاز التنفس x2'],
        hasAlternative: true,
        images: [],
        updates: [
            { date: '2024-02-20T08:00:00', status: 'بدء العمل', note: 'بدء استبدال الفلاتر', by: 'م. فهد السعيد' },
            { date: '2024-02-20T10:30:00', status: 'مكتمل', note: 'تم الاستبدال واختبار الجهاز', by: 'م. فهد السعيد' }
        ]
    }
];

// ==================== INVENTORY ====================
const INVENTORY = [
    {
        id: 'INV001',
        code: 'BAT-001',
        name: 'بطارية جهاز المراقبة',
        category: 'spare_part',
        categoryName: 'قطع غيار',
        subcategory: 'بطاريات',
        quantity: 5,
        minQuantity: 3,
        unit: 'قطعة',
        price: 250,
        supplier: 'MedTech Supplies',
        location: 'رف A-1',
        lastRestocked: '2024-02-15',
        compatibleDevices: ['DEV003', 'DEV006'],
        notes: '',
        usageHistory: [
            { date: '2024-02-20', quantity: 2, department: 'icu', usedBy: 'م. خالد العمري', reason: 'صيانة' },
            { date: '2024-03-01', quantity: 1, department: 'emergency', usedBy: 'م. فهد السعيد', reason: 'استبدال' }
        ]
    },
    {
        id: 'INV002',
        code: 'CAB-ECG-001',
        name: 'كابل ECG',
        category: 'spare_part',
        categoryName: 'قطع غيار',
        subcategory: 'كابلات',
        quantity: 12,
        minQuantity: 5,
        unit: 'قطعة',
        price: 75,
        supplier: 'Philips Medical',
        location: 'رف A-2',
        lastRestocked: '2024-01-20',
        compatibleDevices: ['DEV001', 'DEV011'],
        notes: '',
        usageHistory: [
            { date: '2024-02-10', quantity: 3, department: 'cardiology', usedBy: 'م. خالد العمري', reason: 'صيانة' }
        ]
    },
    {
        id: 'INV003',
        code: 'FLT-VT-001',
        name: 'فلتر جهاز التنفس',
        category: 'consumable',
        categoryName: 'مستهلكات',
        subcategory: 'فلاتر',
        quantity: 2,
        minQuantity: 10,
        unit: 'قطعة',
        price: 45,
        supplier: 'Draeger Medical',
        location: 'رف B-1',
        lastRestocked: '2024-01-05',
        compatibleDevices: ['DEV004'],
        notes: 'مخزون منخفض - يجب الطلب فوراً',
        usageHistory: [
            { date: '2024-01-15', quantity: 5, department: 'icu', usedBy: 'م. فهد السعيد', reason: 'صيانة دورية' },
            { date: '2024-02-01', quantity: 8, department: 'surgery', usedBy: 'م. خالد العمري', reason: 'صيانة' },
            { date: '2024-02-20', quantity: 5, department: 'icu', usedBy: 'م. فهد السعيد', reason: 'استبدال دوري' }
        ]
    },
    {
        id: 'INV004',
        code: 'PRB-US-001',
        name: 'مسبار الموجات الصوتية',
        category: 'spare_part',
        categoryName: 'قطع غيار',
        subcategory: 'مسابر',
        quantity: 3,
        minQuantity: 2,
        unit: 'قطعة',
        price: 1500,
        supplier: 'Samsung Medical',
        location: 'رف C-1',
        lastRestocked: '2024-02-28',
        compatibleDevices: ['DEV005'],
        notes: '',
        usageHistory: []
    },
    {
        id: 'INV005',
        code: 'PPR-ECG-001',
        name: 'ورق تخطيط القلب',
        category: 'consumable',
        categoryName: 'مستهلكات',
        subcategory: 'ورق',
        quantity: 50,
        minQuantity: 20,
        unit: 'رزمة',
        price: 15,
        supplier: 'Medical Papers Co',
        location: 'رف D-1',
        lastRestocked: '2024-03-01',
        compatibleDevices: ['DEV001'],
        notes: '',
        usageHistory: [
            { date: '2024-03-05', quantity: 10, department: 'cardiology', usedBy: 'م. خالد العمري', reason: 'استخدام يومي' },
            { date: '2024-03-08', quantity: 5, department: 'emergency', usedBy: 'م. فهد السعيد', reason: 'استخدام' }
        ]
    },
    {
        id: 'INV006',
        code: 'ELC-ECG-001',
        name: 'أقطاب ECG',
        category: 'consumable',
        categoryName: 'مستهلكات',
        subcategory: 'أقطاب',
        quantity: 200,
        minQuantity: 100,
        unit: 'قطعة',
        price: 2,
        supplier: 'MedTech Supplies',
        location: 'رف D-2',
        lastRestocked: '2024-02-20',
        compatibleDevices: ['DEV001', 'DEV006'],
        notes: '',
        usageHistory: [
            { date: '2024-02-25', quantity: 50, department: 'cardiology', usedBy: 'م. خالد العمري', reason: 'استخدام يومي' },
            { date: '2024-03-02', quantity: 30, department: 'icu', usedBy: 'م. فهد السعيد', reason: 'استخدام' }
        ]
    },
    {
        id: 'INV007',
        code: 'LMP-XR-001',
        name: 'مصباح جهاز الأشعة',
        category: 'spare_part',
        categoryName: 'قطع غيار',
        subcategory: 'مصابيح',
        quantity: 1,
        minQuantity: 2,
        unit: 'قطعة',
        price: 800,
        supplier: 'Siemens Healthcare',
        location: 'رف C-2',
        lastRestocked: '2024-01-10',
        compatibleDevices: ['DEV002'],
        notes: 'مخزون منخفض',
        usageHistory: []
    },
    {
        id: 'INV008',
        code: 'GEL-US-001',
        name: 'جل الموجات الصوتية',
        category: 'consumable',
        categoryName: 'مستهلكات',
        subcategory: 'جل',
        quantity: 25,
        minQuantity: 10,
        unit: 'عبوة',
        price: 20,
        supplier: 'Medical Supplies Ltd',
        location: 'رف D-3',
        lastRestocked: '2024-02-25',
        compatibleDevices: ['DEV005'],
        notes: '',
        usageHistory: [
            { date: '2024-03-01', quantity: 5, department: 'radiology', usedBy: 'م. خالد العمري', reason: 'استخدام يومي' }
        ]
    },
    {
        id: 'INV009',
        code: 'TUB-INF-001',
        name: 'مجموعة التسريب الوريدي',
        category: 'consumable',
        categoryName: 'مستهلكات',
        subcategory: 'أنابيب',
        quantity: 100,
        minQuantity: 50,
        unit: 'قطعة',
        price: 8,
        supplier: 'B. Braun Medical',
        location: 'رف E-1',
        lastRestocked: '2024-03-05',
        compatibleDevices: ['DEV007'],
        notes: '',
        usageHistory: [
            { date: '2024-03-06', quantity: 20, department: 'surgery', usedBy: 'م. فهد السعيد', reason: 'استخدام' }
        ]
    },
    {
        id: 'INV010',
        code: 'SNS-SPO2-001',
        name: 'حساس SpO2',
        category: 'consumable',
        categoryName: 'مستهلكات',
        subcategory: 'حساسات',
        quantity: 30,
        minQuantity: 15,
        unit: 'قطعة',
        price: 35,
        supplier: 'GE Healthcare',
        location: 'رف B-2',
        lastRestocked: '2024-02-10',
        compatibleDevices: ['DEV003', 'DEV004'],
        notes: '',
        usageHistory: [
            { date: '2024-02-15', quantity: 5, department: 'icu', usedBy: 'م. خالد العمري', reason: 'استبدال' }
        ]
    }
];

// ==================== NOTIFICATIONS ====================
const NOTIFICATIONS = [
    {
        id: 'N001',
        type: 'maintenance',
        title: 'طلب صيانة جديد',
        message: 'تم إنشاء طلب صيانة لجهاز مراقبة المريض',
        date: '2024-03-01T10:30:00',
        read: false,
        forRoles: ['engineer', 'admin'],
        forDepartments: ['all'],
        relatedId: 'MR001',
        priority: 'high'
    },
    {
        id: 'N002',
        type: 'inventory',
        title: 'تنبيه مخزون منخفض',
        message: 'فلتر جهاز التنفس وصل للحد الأدنى (2 قطعة متبقية)',
        date: '2024-03-05T14:20:00',
        read: false,
        forRoles: ['inventory_manager', 'admin', 'engineer'],
        forDepartments: ['all'],
        relatedId: 'INV003',
        priority: 'critical'
    },
    {
        id: 'N003',
        type: 'device',
        title: 'جهاز خارج الخدمة',
        message: 'جهاز الموجات فوق الصوتية أصبح خارج الخدمة',
        date: '2024-03-10T09:15:00',
        read: true,
        forRoles: ['medical_staff', 'engineer', 'admin'],
        forDepartments: ['radiology', 'all'],
        relatedId: 'DEV005',
        priority: 'high'
    },
    {
        id: 'N004',
        type: 'maintenance',
        title: 'اكتمال صيانة',
        message: 'تم الانتهاء من صيانة جهاز تخطيط القلب',
        date: '2024-02-17T16:45:00',
        read: true,
        forRoles: ['medical_staff', 'admin'],
        forDepartments: ['cardiology', 'all'],
        relatedId: 'MR004',
        priority: 'low'
    },
    {
        id: 'N005',
        type: 'warranty',
        title: 'انتهاء ضمان قريب',
        message: 'ضمان جهاز الأشعة السينية ينتهي خلال 5 أشهر',
        date: '2024-03-08T10:00:00',
        read: false,
        forRoles: ['admin'],
        forDepartments: ['all'],
        relatedId: 'DEV002',
        priority: 'medium'
    },
    {
        id: 'N006',
        type: 'maintenance',
        title: 'صيانة وقائية مجدولة',
        message: 'موعد الصيانة الوقائية لجهاز صدمات القلب بعد 3 أيام',
        date: '2024-03-25T08:00:00',
        read: false,
        forRoles: ['engineer', 'admin'],
        forDepartments: ['emergency', 'all'],
        relatedId: 'MR005',
        priority: 'high'
    },
    {
        id: 'N007',
        type: 'inventory',
        title: 'تنبيه مخزون منخفض',
        message: 'مصباح جهاز الأشعة وصل للحد الأدنى',
        date: '2024-03-07T11:00:00',
        read: false,
        forRoles: ['inventory_manager', 'admin'],
        forDepartments: ['all'],
        relatedId: 'INV007',
        priority: 'high'
    }
];

// ==================== SUPPLIERS ====================
const SUPPLIERS = [
    { id: 'SUP001', name: 'MedTech Supplies', contact: 'محمد العلي', phone: '0501111111', email: 'contact@medtech.com' },
    { id: 'SUP002', name: 'Philips Medical', contact: 'أحمد السالم', phone: '0502222222', email: 'sales@philips.com' },
    { id: 'SUP003', name: 'Siemens Healthcare', contact: 'خالد الفهد', phone: '0503333333', email: 'info@siemens.com' },
    { id: 'SUP004', name: 'GE Healthcare', contact: 'فهد العتيبي', phone: '0504444444', email: 'support@ge.com' },
    { id: 'SUP005', name: 'Draeger Medical', contact: 'سعد المطيري', phone: '0505555555', email: 'sales@draeger.com' },
    { id: 'SUP006', name: 'Samsung Medical', contact: 'عبدالله القحطاني', phone: '0506666666', email: 'medical@samsung.com' },
    { id: 'SUP007', name: 'B. Braun Medical', contact: 'ناصر الدوسري', phone: '0507777777', email: 'info@bbraun.com' },
    { id: 'SUP008', name: 'Medical Papers Co', contact: 'راشد الشمري', phone: '0508888888', email: 'orders@medpapers.com' },
    { id: 'SUP009', name: 'Medical Supplies Ltd', contact: 'منصور العنزي', phone: '0509999999', email: 'sales@medsupplies.com' }
];

// ==================== DEVICE TYPES ====================
const DEVICE_TYPES = [
    { id: 'ecg', name: 'جهاز تخطيط القلب' },
    { id: 'xray', name: 'جهاز الأشعة السينية' },
    { id: 'monitor', name: 'جهاز مراقبة المريض' },
    { id: 'ventilator', name: 'جهاز التنفس الصناعي' },
    { id: 'ultrasound', name: 'جهاز الموجات فوق الصوتية' },
    { id: 'defibrillator', name: 'جهاز صدمات القلب' },
    { id: 'infusion_pump', name: 'مضخة التسريب' },
    { id: 'blood_analyzer', name: 'جهاز تحليل الدم' },
    { id: 'anesthesia', name: 'جهاز التخدير' },
    { id: 'bed', name: 'سرير كهربائي' },
    { id: 'blood_pressure', name: 'جهاز قياس الضغط' },
    { id: 'dialysis', name: 'جهاز غسيل الكلى' }
];

// ==================== INVENTORY CATEGORIES ====================
const INVENTORY_CATEGORIES = [
    { id: 'spare_part', name: 'قطع غيار' },
    { id: 'consumable', name: 'مستهلكات' },
    { id: 'tool', name: 'أدوات' }
];

// ==================== SCHEDULED REPORTS ====================
const SCHEDULED_REPORTS = [
    {
        id: 'SR001',
        type: 'devices',
        typeName: 'تقرير الأجهزة',
        frequency: 'monthly',
        frequencyName: 'شهرياً',
        email: 'admin@hospital.com',
        lastGenerated: '2024-03-01',
        nextGeneration: '2024-04-01',
        active: true
    },
    {
        id: 'SR002',
        type: 'maintenance',
        typeName: 'تقرير الصيانة',
        frequency: 'weekly',
        frequencyName: 'أسبوعياً',
        email: 'engineer@hospital.com',
        lastGenerated: '2024-03-08',
        nextGeneration: '2024-03-15',
        active: true
    }
];

// ==================== ACTIVITY LOG ====================
const ACTIVITY_LOG = [
    { id: 'ACT001', type: 'maintenance', action: 'تم إنشاء طلب صيانة', details: 'طلب صيانة لجهاز مراقبة المريض', user: 'فاطمة الزهراء', date: '2024-03-01T10:30:00' },
    { id: 'ACT002', type: 'device', action: 'تغيير حالة جهاز', details: 'جهاز الموجات الصوتية - من يعمل إلى خارج الخدمة', user: 'م. خالد العمري', date: '2024-03-10T09:15:00' },
    { id: 'ACT003', type: 'inventory', action: 'سحب من المخزون', details: 'تم سحب 2 قطعة من بطاريات جهاز المراقبة', user: 'م. خالد العمري', date: '2024-02-20T14:00:00' },
    { id: 'ACT004', type: 'maintenance', action: 'اكتمال صيانة', details: 'تم إصلاح جهاز تخطيط القلب', user: 'م. خالد العمري', date: '2024-02-17T16:45:00' },
    { id: 'ACT005', type: 'inventory', action: 'إضافة للمخزون', details: 'تم إضافة 50 رزمة ورق تخطيط القلب', user: 'سالم العتيبي', date: '2024-03-01T11:00:00' },
    { id: 'ACT006', type: 'user', action: 'تسجيل دخول', details: 'تسجيل دخول ناجح', user: 'مدير النظام', date: '2024-03-11T08:00:00' }
];

// ==================== HELPER FUNCTIONS ====================

function getDeviceById(id) {
    return DEVICES.find(d => d.id === id);
}

function getDevicesByDepartment(department) {
    if (department === 'all') return DEVICES;
    return DEVICES.filter(d => d.department === department);
}

function getDevicesByStatus(status) {
    return DEVICES.filter(d => d.status === status);
}

function getUserById(id) {
    return USERS.find(u => u.id === id);
}

function getUserByUsername(username) {
    return USERS.find(u => u.username === username);
}

function getUsersByRole(role) {
    return USERS.filter(u => u.role === role);
}

function getDepartmentById(id) {
    return DEPARTMENTS.find(d => d.id === id);
}

function getMaintenanceRequestById(id) {
    return MAINTENANCE_REQUESTS.find(m => m.id === id);
}

function getMaintenanceRequestsByDepartment(department) {
    if (department === 'all') return MAINTENANCE_REQUESTS;
    return MAINTENANCE_REQUESTS.filter(m => m.department === department);
}

function getMaintenanceRequestsByStatus(status) {
    return MAINTENANCE_REQUESTS.filter(m => m.status === status);
}

function getInventoryItemById(id) {
    return INVENTORY.find(i => i.id === id);
}

function getLowStockItems() {
    return INVENTORY.filter(i => i.quantity <= i.minQuantity);
}

function getOutOfStockItems() {
    return INVENTORY.filter(i => i.quantity === 0);
}

function getNotificationsByRole(role, department) {
    return NOTIFICATIONS.filter(n => {
        const roleMatch = n.forRoles.includes(role) || n.forRoles.includes('all');
        const deptMatch = n.forDepartments.includes(department) || n.forDepartments.includes('all');
        return roleMatch && deptMatch;
    });
}

function getUnreadNotifications(role, department) {
    return getNotificationsByRole(role, department).filter(n => !n.read);
}

// ==================== STATISTICS FUNCTIONS ====================

function getDeviceStats() {
    const total = DEVICES.length;
    const operational = DEVICES.filter(d => d.status === 'operational').length;
    const maintenance = DEVICES.filter(d => d.status === 'maintenance').length;
    const outOfService = DEVICES.filter(d => d.status === 'out_of_service').length;
    
    return {
        total,
        operational,
        maintenance,
        outOfService,
        operationalRate: ((operational / total) * 100).toFixed(1),
        maintenanceRate: ((maintenance / total) * 100).toFixed(1)
    };
}

function getMaintenanceStats() {
    const total = MAINTENANCE_REQUESTS.length;
    const pending = MAINTENANCE_REQUESTS.filter(m => m.status === 'pending').length;
    const inProgress = MAINTENANCE_REQUESTS.filter(m => m.status === 'in_progress').length;
    const completed = MAINTENANCE_REQUESTS.filter(m => m.status === 'completed').length;
    const scheduled = MAINTENANCE_REQUESTS.filter(m => m.status === 'scheduled').length;
    const critical = MAINTENANCE_REQUESTS.filter(m => m.priority === 'critical').length;
    
    return {
        total,
        pending,
        inProgress,
        completed,
        scheduled,
        critical,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    };
}

function getInventoryStats() {
    const total = INVENTORY.length;
    const lowStock = INVENTORY.filter(i => i.quantity <= i.minQuantity && i.quantity > 0).length;
    const outOfStock = INVENTORY.filter(i => i.quantity === 0).length;
    const totalValue = INVENTORY.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    
    return {
        total,
        lowStock,
        outOfStock,
        inStock: total - lowStock - outOfStock,
        totalValue
    };
}

function getDepartmentDeviceStats(department) {
    const devices = getDevicesByDepartment(department);
    return {
        total: devices.length,
        operational: devices.filter(d => d.status === 'operational').length,
        maintenance: devices.filter(d => d.status === 'maintenance').length,
        outOfService: devices.filter(d => d.status === 'out_of_service').length
    };
}

function getTopProblematicDevices(limit = 5) {
    const deviceFailures = DEVICES.map(d => ({
        ...d,
        failureCount: d.maintenanceHistory.filter(m => 
            m.type.includes('تصحيحية') || m.type.includes('إصلاح')
        ).length
    }));
    
    return deviceFailures
        .sort((a, b) => b.failureCount - a.failureCount)
        .slice(0, limit);
}

function getMaintenanceByDepartment() {
    const result = {};
    DEPARTMENTS.filter(d => d.id !== 'all').forEach(dept => {
        result[dept.id] = {
            name: dept.name,
            count: MAINTENANCE_REQUESTS.filter(m => m.department === dept.id).length
        };
    });
    return result;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEPARTMENTS,
        USERS,
        DEVICES,
        MAINTENANCE_REQUESTS,
        INVENTORY,
        NOTIFICATIONS,
        SUPPLIERS,
        DEVICE_TYPES,
        INVENTORY_CATEGORIES,
        SCHEDULED_REPORTS,
        ACTIVITY_LOG
    };
}
