export type Language = 'en' | 'ar';

export interface Translations {
  // Navigation
  home: string;
  dashboard: string;
  products: string;
  allProducts: string;
  manageProducts: string;
  productTypes: string;
  categories: string;
  customers: string;
  allCustomers: string;
  accountBalances: string;
  analytics: string;
  notesAndCommunication: string;
  vendors: string;
  allVendors: string;
  performanceAnalytics: string;
  branches: string;
  inventory: string;
  stockOverview: string;
  warehouseManagement: string;
  purchaseOrders: string;
  goodsReceipts: string;
  orders: string;
  allOrders: string;
  createOrder: string;
  orderTemplates: string;
  statusTracking: string;
  orderPipeline: string;
  pointOfSale: string;
  trackOrder: string;
  userManagement: string;
  allUsers: string;
  rolesAndPermissions: string;
  activityLogs: string;
  security: string;
  profile: string;
  
  // Common
  notifications: string;
  helpAndSupport: string;
  settings: string;
  signOut: string;
  new: string;
  
  // Dashboard
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  totalOrders: string;
  todaysRevenue: string;
  pipelineOrders: string;
  lowStockAlert: string;
  availableMenu: string;
  navigateToDifferentSections: string;
  quickActions: string;
  commonTasksAndShortcuts: string;
  addProduct: string;
  newCustomer: string;
  posSystem: string;
  todaysSchedule: string;
  recentActivity: string;
  latestUpdatesAndNotifications: string;
  performanceOverview: string;
  keyMetricsAndTrends: string;
  yourAchievements: string;
  recentAccomplishmentsAndMilestones: string;
  topPerformer: string;
  customerSatisfaction: string;
  rating: string;
  goalAchieved: string;
  q1TargetsMet: string;
  
  // Status
  active: string;
  completed: string;
  inProgress: string;
  needRestocking: string;
  activeCustomerBase: string;
  activeVendors: string;
  activeLocations: string;
  itemsNeedRestocking: string;
  activeProducts: string;
  
  // Time
  today: string;
  thisWeek: string;
  thisMonth: string;
  vsLastMonth: string;
  
  // Actions
  view: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  submit: string;
  search: string;
  filter: string;
  sort: string;
  export: string;
  import: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    products: 'Products',
    allProducts: 'All Products',
    manageProducts: 'Manage Products',
    productTypes: 'Product Types',
    categories: 'Categories',
    customers: 'Customers',
    allCustomers: 'All Customers',
    accountBalances: 'Account Balances',
    analytics: 'Analytics',
    notesAndCommunication: 'Notes & Communication',
    vendors: 'Vendors',
    allVendors: 'All Vendors',
    performanceAnalytics: 'Performance Analytics',
    branches: 'Branches',
    inventory: 'Inventory',
    stockOverview: 'Stock Overview',
    warehouseManagement: 'Warehouse Management',
    purchaseOrders: 'Purchase Orders',
    goodsReceipts: 'Goods Receipts',
    orders: 'Orders',
    allOrders: 'All Orders',
    createOrder: 'Create Order',
    orderTemplates: 'Order Templates',
    statusTracking: 'Status Tracking',
    orderPipeline: 'Order Pipeline',
    pointOfSale: 'Point of Sale',
    trackOrder: 'Track Order',
    userManagement: 'User Management',
    allUsers: 'All Users',
    rolesAndPermissions: 'Roles & Permissions',
    activityLogs: 'Activity Logs',
    security: 'Security',
    profile: 'Profile',
    
    // Common
    notifications: 'Notifications',
    helpAndSupport: 'Help & Support',
    settings: 'Settings',
    signOut: 'Sign Out',
    new: 'New',
    
    // Dashboard
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    totalOrders: 'Total Orders',
    todaysRevenue: "Today's Revenue",
    pipelineOrders: 'Pipeline Orders',
    lowStockAlert: 'Low Stock Alert',
    availableMenu: 'Available Menu',
    navigateToDifferentSections: 'Navigate to different sections',
    quickActions: 'Quick Actions',
    commonTasksAndShortcuts: 'Common tasks and shortcuts',
    addProduct: 'Add Product',
    newCustomer: 'New Customer',
    posSystem: 'POS System',
    todaysSchedule: "Today's Schedule",
    recentActivity: 'Recent Activity',
    latestUpdatesAndNotifications: 'Latest updates and notifications',
    performanceOverview: 'Performance Overview',
    keyMetricsAndTrends: 'Key metrics and trends',
    yourAchievements: 'Your Achievements',
    recentAccomplishmentsAndMilestones: 'Recent accomplishments and milestones',
    topPerformer: 'Top Performer',
    customerSatisfaction: 'Customer Satisfaction',
    rating: 'rating',
    goalAchieved: 'Goal Achieved',
    q1TargetsMet: 'Q1 targets met',
    
    // Status
    active: 'active',
    completed: 'completed',
    inProgress: 'in progress',
    needRestocking: 'Need restocking',
    activeCustomerBase: 'Active customer base',
    activeVendors: 'active vendors',
    activeLocations: 'Active locations',
    itemsNeedRestocking: 'Items need restocking',
    activeProducts: 'active products',
    
    // Time
    today: 'today',
    thisWeek: 'this week',
    thisMonth: 'this month',
    vsLastMonth: 'vs last month',
    
    // Actions
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    allProducts: 'جميع المنتجات',
    manageProducts: 'إدارة المنتجات',
    productTypes: 'أنواع المنتجات',
    categories: 'الفئات',
    customers: 'العملاء',
    allCustomers: 'جميع العملاء',
    accountBalances: 'أرصدة الحسابات',
    analytics: 'التحليلات',
    notesAndCommunication: 'الملاحظات والتواصل',
    vendors: 'الموردون',
    allVendors: 'جميع الموردين',
    performanceAnalytics: 'تحليلات الأداء',
    branches: 'الفروع',
    inventory: 'المخزون',
    stockOverview: 'نظرة عامة على المخزون',
    warehouseManagement: 'إدارة المستودعات',
    purchaseOrders: 'أوامر الشراء',
    goodsReceipts: 'إيصالات البضائع',
    orders: 'الطلبات',
    allOrders: 'جميع الطلبات',
    createOrder: 'إنشاء طلب',
    orderTemplates: 'قوالب الطلبات',
    statusTracking: 'تتبع الحالة',
    orderPipeline: 'خط أنابيب الطلبات',
    pointOfSale: 'نقطة البيع',
    trackOrder: 'تتبع الطلب',
    userManagement: 'إدارة المستخدمين',
    allUsers: 'جميع المستخدمين',
    rolesAndPermissions: 'الأدوار والصلاحيات',
    activityLogs: 'سجلات النشاط',
    security: 'الأمان',
    profile: 'الملف الشخصي',
    
    // Common
    notifications: 'الإشعارات',
    helpAndSupport: 'المساعدة والدعم',
    settings: 'الإعدادات',
    signOut: 'تسجيل الخروج',
    new: 'جديد',
    
    // Dashboard
    goodMorning: 'صباح الخير',
    goodAfternoon: 'مساء الخير',
    goodEvening: 'مساء الخير',
    totalOrders: 'إجمالي الطلبات',
    todaysRevenue: 'إيرادات اليوم',
    pipelineOrders: 'طلبات خط الأنابيب',
    lowStockAlert: 'تنبيه المخزون المنخفض',
    availableMenu: 'القائمة المتاحة',
    navigateToDifferentSections: 'التنقل إلى أقسام مختلفة',
    quickActions: 'الإجراءات السريعة',
    commonTasksAndShortcuts: 'المهام الشائعة والاختصارات',
    addProduct: 'إضافة منتج',
    newCustomer: 'عميل جديد',
    posSystem: 'نظام نقاط البيع',
    todaysSchedule: 'جدول اليوم',
    recentActivity: 'النشاط الأخير',
    latestUpdatesAndNotifications: 'أحدث التحديثات والإشعارات',
    performanceOverview: 'نظرة عامة على الأداء',
    keyMetricsAndTrends: 'المقاييس والاتجاهات الرئيسية',
    yourAchievements: 'إنجازاتك',
    recentAccomplishmentsAndMilestones: 'الإنجازات والمعالم الأخيرة',
    topPerformer: 'الأداء المتميز',
    customerSatisfaction: 'رضا العملاء',
    rating: 'تقييم',
    goalAchieved: 'تم تحقيق الهدف',
    q1TargetsMet: 'تم تحقيق أهداف الربع الأول',
    
    // Status
    active: 'نشط',
    completed: 'مكتمل',
    inProgress: 'قيد التقدم',
    needRestocking: 'يحتاج إعادة تخزين',
    activeCustomerBase: 'قاعدة عملاء نشطة',
    activeVendors: 'موردين نشطين',
    activeLocations: 'مواقع نشطة',
    itemsNeedRestocking: 'عناصر تحتاج إعادة تخزين',
    activeProducts: 'منتجات نشطة',
    
    // Time
    today: 'اليوم',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    vsLastMonth: 'مقارنة بالشهر الماضي',
    
    // Actions
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    export: 'تصدير',
    import: 'استيراد',
  },
};

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language][key] || key;
}
