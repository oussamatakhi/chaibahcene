// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";

// تشغيل التطبيق المستقر بعد اكتمال ملفات نموذج التقرير، ثم إعادة ربط زر التقرير
// بالدالة الوزارية الصحيحة مع تزويدها بسياق الزيارة والأستاذ من Supabase.
(function(){
  window.addEventListener('load', function(){
    window.__ministerialOpenReport = window.openReport;

    var app=document.createElement('script');
    app.src='app-fix.js?v=20260817-3';
    app.onload=function(){
      var finalFix=document.createElement('script');
      finalFix.src='report-final.js?v=20260817-1';
      document.head.appendChild(finalFix);
    };
    app.onerror=function(){console.error('تعذر تحميل التطبيق المستقر app-fix.js');};
    document.head.appendChild(app);
  });
})();
