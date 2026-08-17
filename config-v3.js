// إعدادات Supabase - إصدار جديد لتجاوز التخزين المؤقت للمتصفح
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
// Google OAuth 2.0 Client ID لتطبيق الويب. يملأ بعد إنشاء بيانات الاعتماد في Google Cloud.
window.GOOGLE_DRIVE_CLIENT_ID = "";
(function(){
 window.addEventListener('load',function(){
  try{ if(window.supabase && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY){ window.supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY); } }catch(e){ console.error(e); }
  // تحميل واجهة الوثائق فقط بعد اكتمال الصفحة، دون التأثير على شاشة الدخول.
  if(!document.getElementById('documentsDriveCss')){var c=document.createElement('link');c.id='documentsDriveCss';c.rel='stylesheet';c.href='documents-drive.css?v=1';document.head.appendChild(c)}
  if(!document.getElementById('documentsDriveScript')){var s=document.createElement('script');s.id='documentsDriveScript';s.src='documents-drive.js?v=20260818-1';document.body.appendChild(s)}
 });
})();
