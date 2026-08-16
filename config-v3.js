// إعدادات Supabase - إصدار جديد لتجاوز التخزين المؤقت للمتصفح
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";

(function(){
  window.addEventListener('load', function(){
    // حفظ معالج التقرير الوزاري قبل تحميل التطبيق المستقر.
    window.__ministerialOpenReport = window.openReport;

    var app=document.createElement('script');
    app.src='app-fix.js?v=20260817-4';
    app.onload=function(){
      var finalFix=document.createElement('script');
      finalFix.src='report-final.js?v=20260817-2';
      document.head.appendChild(finalFix);
    };
    app.onerror=function(){console.error('تعذر تحميل التطبيق المستقر app-fix.js');};
    document.head.appendChild(app);
  });
})();
