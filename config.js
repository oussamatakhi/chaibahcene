// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";

// تحميل التطبيق المستقر ثم إصلاح زر التقرير بعد اكتمال تحميل التطبيق.
(function(){
  var s=document.createElement('script');
  s.src='app-fix.js?v=20260817-1';
  s.defer=true;
  document.head.appendChild(s);
  window.addEventListener('load', function(){
    var h=document.createElement('script');
    h.src='report-hotfix.js?v=20260817-2';
    document.head.appendChild(h);
  });
})();
