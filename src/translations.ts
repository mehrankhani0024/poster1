export const translations = {
  fa: {
    appTitle: 'PrintSheet Pro',
    appSubtitle: 'چیدمان اتوماتیک و بسته‌بندی عکس برای چاپ بدون تغییر نسبت ابعاد',
    
    // Header & Navigation
    language: 'English',
    directPrint: 'چاپ مستقیم',
    exportPdf: 'خروجی PDF',
    exportPng: 'دانلود عکس PNG',
    exportAllPng: 'دانلود PNG همه برگه‌ها',
    exportZip: 'دانلود ZIP (همه برگه‌ها)',
    uploadPhotos: 'آپلود عکس‌ها',
    settings: 'تنظیمات چیدمان',
    photoList: 'لیست تصاویر',
    
    // Tabs & Sections
    tabLayout: 'برگه و چیدمان',
    tabPhotos: 'مدیریت عکس‌ها',
    tabFrame: 'تنظیمات کادر و عکس',
    
    // Paper & Layout settings
    paperSizeLabel: 'اندازه کاغذ (برگه چاپ):',
    orientationLabel: 'جهت برگه:',
    portrait: 'عمودی (Portrait)',
    landscape: 'افقی (Landscape)',
    
    presetLabel: 'پریست‌های چیدمان سریع:',
    presetAuto: 'خودکار (بر اساس ابعاد عکس هدف)',
    preset4A5onA3: '۴ عدد A5 در یک برگه A3',
    preset2A4onA3: '۲ عدد A4 در یک برگه A3',
    preset8A6onA3: '۸ عدد A6 در یک برگه A3',
    preset2A5onA4: '۲ عدد A5 در یک برگه A4',
    preset4A6onA4: '۴ عدد A6 در یک برگه A4',
    preset9_35x5: '۹ عدد ۳.۵x۵ اینچ در A4',
    presetCustomGrid: 'شبکه‌بندی سفارشی (سطر و ستون)',
    
    targetPhotoSize: 'اندازه عکس هدف:',
    columns: 'تعداد ستون:',
    rows: 'تعداد سطر:',
    marginMM: 'حاشیه برگه (میلی‌متر):',
    gapMM: 'فاصله بین عکس‌ها (میلی‌متر):',
    
    // Checkboxes & Tools
    cropMarks: 'علامت‌های برش (Crop Marks)',
    safeMargin: 'کادر ایمن چاپ (۳ میلی‌متر)',
    showRulers: 'خط‌کش میلی‌متری',
    
    // Photo Editing & Non-Distortion
    fitModeLabel: 'حالت قرارگیری عکس (بدون دفرمه شدن):',
    fitContain: 'کامل بدون برش (با رنگ پس‌زمینه کادر)',
    fitCover: 'پر کردن کادر (بدون کشیدگی تصویر)',
    bgColorLabel: 'رنگ پس‌زمینه کادر (فضای خالی):',
    bgColorWhite: 'سفید',
    bgColorBlack: 'مشکی',
    bgColorEdgeAuto: 'تشخیص هوشمند رنگ عکس',
    
    rotatePhoto: 'چرخش عکس:',
    rotate90: '۹۰ درجه',
    rotate180: '۱۸۰ درجه',
    rotate270: '۲۷۰ درجه',
    rotateReset: 'صفر درجه',
    
    zoomLabel: 'بزرگنمایی (زوم داخل کادر):',
    offsetYLabel: 'جابه‌جایی عمودی:',
    offsetXLabel: 'جابه‌جایی افقی:',
    
    duplicateToNext: 'تکرار در فریم‌های بعدی',
    duplicateAllPages: 'پر کردن تمام برگه‌ها با این عکس',
    replacePhoto: 'جایگزینی عکس',
    clearSlot: 'حذف از این فریم',
    
    // Batch Auto Arrange
    autoArrangeTitle: 'چیدمان خودکار عکس‌ها',
    autoArrangeDesc: 'تنظیم ۵۰+ عکس uploaded در چندین برگه A3/A4 به صورت اتوماتیک بدون تغییر نسبت ابعاد',
    autoFillBtn: 'چیدمان خودکار تمام عکس‌ها',
    clearAllPhotos: 'حذف تمام عکس‌ها',
    
    // Page Navigator
    pageIndicator: 'برگه {current} از {total}',
    addPage: 'افزودن برگه جدید',
    deletePage: 'حذف این برگه',
    duplicatePage: 'کپی از برگه',
    
    // Canvas Controls
    zoomIn: 'بزرگنمایی',
    zoomOut: 'کوچکنمایی',
    resetView: 'بازنشانی نما',
    fitToScreen: 'جاگیری در صفحه',
    
    // Empty states & Notifications
    dragDropText: 'عکس‌های خود را بکشید و اینجا رها کنید (امکان آپلود دسته‌ای ۵۰+ عکس)',
    orClickToBrowse: 'یا برای انتخاب فایل‌ها کلیک کنید',
    noPhotosUploaded: 'هنوز عکسی آپلود نشده است.',
    photosUploadedCount: '{count} عکس آپلود شد.',
    slotsAvailableCount: '{total} فریم در {pages} برگه آماده است.',
    
    // Export Modal & Notifications
    generatingPdf: 'در حال ساخت فایل PDF با کیفیت ۳۰۰ DPI...',
    generatingPng: 'در حال ساخت عکس PNG با کیفیت عالی...',
    generatingZip: 'در حال فشرده‌سازی و ساخت فایل ZIP...',
    downloadComplete: 'دانلود با موفقیت انجام شد!',
    
    // Instructions & Notice
    aspectNotice: 'تضمین عدم دفرمه شدن: ابعاد اصلی و نسبت عکس‌های شما کاملاً حفظ می‌شود.',
    selectSlotPrompt: 'روی هر فریم کلیک کنید تا آن را ویرایش یا جابه‌جا کنید.',
    emptySlotText: 'فریم خالی - برای افزودن عکس کلیک کنید',
  },
  en: {
    appTitle: 'PrintSheet Pro',
    appSubtitle: 'Automated Photo Print Imposition & Layout (Zero Distortion)',
    
    // Header & Navigation
    language: 'فارسی',
    directPrint: 'Direct Print',
    exportPdf: 'Export PDF',
    exportZip: 'Download ZIP (All Sheets)',
    uploadPhotos: 'Upload Photos',
    settings: 'Layout Settings',
    photoList: 'Photo List',
    
    // Tabs & Sections
    tabLayout: 'Sheet & Layout',
    tabPhotos: 'Photos & Auto-Fit',
    tabFrame: 'Frame & Options',
    
    // Paper & Layout settings
    paperSizeLabel: 'Paper Size (Target Sheet):',
    orientationLabel: 'Orientation:',
    portrait: 'Portrait',
    landscape: 'Landscape',
    
    presetLabel: 'Quick Layout Presets:',
    presetAuto: 'Auto (Based on target photo size)',
    preset4A5onA3: '4 x A5 on A3 Paper',
    preset2A4onA3: '2 x A4 on A3 Paper',
    preset8A6onA3: '8 x A6 on A3 Paper',
    preset2A5onA4: '2 x A5 on A4 Paper',
    preset4A6onA4: '4 x A6 on A4 Paper',
    preset9_35x5: '9 x 3.5x5" on A4 Paper',
    presetCustomGrid: 'Custom Grid (Rows & Cols)',
    
    targetPhotoSize: 'Target Photo Size:',
    columns: 'Columns:',
    rows: 'Rows:',
    marginMM: 'Page Margin (mm):',
    gapMM: 'Photo Gap (mm):',
    
    // Checkboxes & Tools
    cropMarks: 'Crop Marks (Cut Lines)',
    safeMargin: 'Print Safe Area (3mm)',
    showRulers: 'Millimeter Rulers',
    
    // Photo Editing & Non-Distortion
    fitModeLabel: 'Photo Fit Mode (No Distortion):',
    fitContain: 'Fit inside (Contain + Background Match)',
    fitCover: 'Fill Frame (Crop without stretching)',
    bgColorLabel: 'Frame Padding Color:',
    bgColorWhite: 'White',
    bgColorBlack: 'Black',
    bgColorEdgeAuto: 'Auto-Match Image Edge Color',
    
    rotatePhoto: 'Rotate Photo:',
    rotate90: '90°',
    rotate180: '180°',
    rotate270: '270°',
    rotateReset: '0°',
    
    zoomLabel: 'Inner Frame Zoom:',
    offsetYLabel: 'Vertical Position:',
    offsetXLabel: 'Horizontal Position:',
    
    duplicateToNext: 'Duplicate to Next Frames',
    duplicateAllPages: 'Fill All Sheets with This Photo',
    replacePhoto: 'Replace Photo',
    clearSlot: 'Clear This Frame',
    
    // Batch Auto Arrange
    autoArrangeTitle: 'Automated Photo Imposition',
    autoArrangeDesc: 'Automatically layout 50+ uploaded photos onto multiple print sheets without stretching.',
    autoFillBtn: 'Auto-Arrange All Uploads',
    clearAllPhotos: 'Clear All Photos',
    
    // Page Navigator
    pageIndicator: 'Sheet {current} of {total}',
    addPage: 'Add New Sheet',
    deletePage: 'Delete Sheet',
    duplicatePage: 'Duplicate Sheet',
    
    // Canvas Controls
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',
    fitToScreen: 'Fit to Screen',
    
    // Empty states & Notifications
    dragDropText: 'Drag & drop photos here (Supports batch upload of 50+ photos)',
    orClickToBrowse: 'or click to browse files',
    noPhotosUploaded: 'No photos uploaded yet.',
    photosUploadedCount: '{count} photo(s) uploaded.',
    slotsAvailableCount: '{total} frames available across {pages} sheet(s).',
    
    // Export Modal & Notifications
    generatingPdf: 'Rendering 300 DPI High Resolution PDF...',
    generatingZip: 'Compressing and generating ZIP file...',
    downloadComplete: 'Download finished successfully!',
    
    // Instructions & Notice
    aspectNotice: 'Zero Distortion Guarantee: Original aspect ratio of every photo is 100% preserved.',
    selectSlotPrompt: 'Click on any frame to edit, rotate, pan, or replace.',
    emptySlotText: 'Empty Frame - Click to assign photo',
  }
};
