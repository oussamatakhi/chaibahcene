// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
window.GOOGLE_DRIVE_CLIENT_ID = "";
(function(){
 const bust=()=>{
  document.querySelectorAll('script[src^="app-v2.js"]').forEach(s=>{s.src='app-v2.js?v=20260818-5'});
  document.querySelectorAll('script[src^="teacher-page-final.js"]').forEach(s=>{s.src='teacher-page-final.js?v=20260818-4'});
 };
 bust();
 window.addEventListener('load',function(){
  try{ if(window.supabase && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY && !window.supabaseClient){ window.supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY); } }catch(e){ console.error(e); }
  if(!document.getElementById('loginFixScript')){var s=document.createElement('script');s.id='loginFixScript';s.src='login-fix.js?v=20260818-2';document.body.appendChild(s)}
 });
})();
