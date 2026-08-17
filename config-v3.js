// إعدادات Supabase - إصدار جديد لتجاوز التخزين المؤقت للمتصفح
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
(function(){
 window.addEventListener('load',function(){
  window.__ministerialOpenReport=window.openReport;
  var scripts=['app-fix.js?v=20260817-8','report-final.js?v=20260817-6','visit-teacher-search.js?v=20260817-5','report-autofill-v2.js?v=20260817-5','report-text-corrections.js?v=20260817-5','report-text-corrections-v2.js?v=20260817-4','modal-bottom-close.js?v=20260817-3','teacher-birth-fields.js?v=20260817-2','report-date-rtl-only.js?v=20260817-1'];
  var i=0;function next(){if(i>=scripts.length)return;var s=document.createElement('script');s.src=scripts[i++];s.onload=next;s.onerror=next;document.head.appendChild(s)}next();
 });
})();
