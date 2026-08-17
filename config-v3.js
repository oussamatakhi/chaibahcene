// إعدادات Supabase - إصدار جديد لتجاوز التخزين المؤقت للمتصفح
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
// ضع هنا Google OAuth 2.0 Client ID الخاص بتطبيق الويب بعد إنشائه في Google Cloud Console.
window.GOOGLE_DRIVE_CLIENT_ID = "";
(function(){
 window.addEventListener('load',function(){
  try{ if(window.supabase && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY){ window.supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY); } }catch(e){ console.error(e); }
 });
})();
