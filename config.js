// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";

// Fallback loader: the previous app-v2.js contains a syntax error, so load the stable application here.
(function(){
  var s=document.createElement('script');
  s.src='app-fix.js?v=20260816-2';
  s.defer=true;
  document.head.appendChild(s);
})();
