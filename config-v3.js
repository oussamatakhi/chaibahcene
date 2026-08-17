// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
window.GOOGLE_DRIVE_CLIENT_ID = "";
(function(){
 'use strict';
 // إصلاح تسجيل الدخول يُربط فوراً، قبل تحميل بقية ملفات التطبيق، حتى لا تمنعه أخطاء أي ملف آخر.
 function bindLogin(){
  const f=document.getElementById('loginForm');
  if(!f||f.dataset.configLoginBound==='1')return;
  f.dataset.configLoginBound='1';
  f.addEventListener('submit',async function(e){
   e.preventDefault();
   e.stopImmediatePropagation();
   const btn=e.submitter||f.querySelector('button[type="submit"]');
   const email=(document.getElementById('email')?.value||'').trim();
   const password=document.getElementById('password')?.value||'';
   const msg=document.getElementById('loginError');
   if(!email||!password)return;
   if(btn){btn.disabled=true;btn.textContent='جارٍ تسجيل الدخول...';}
   if(msg){msg.textContent='';msg.style.display='none';}
   try{
    const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
    const result=await client.auth.signInWithPassword({email,password});
    if(result.error){
     if(msg){msg.textContent=/invalid login credentials/i.test(result.error.message)?'البريد الإلكتروني أو كلمة المرور غير صحيحة.':result.error.message;msg.style.display='block';}
     return;
    }
    if(result.data&&result.data.session){
     const login=document.getElementById('loginView');
     const app=document.getElementById('dashboardView');
     if(login)login.hidden=true;
     if(app)app.hidden=false;
     if(typeof window.loadAll==='function')window.loadAll();
     else window.location.reload();
    }
   }catch(err){
    if(msg){msg.textContent='تعذر تسجيل الدخول: '+(err&&err.message?err.message:'خطأ غير معروف');msg.style.display='block';}
   }finally{
    if(btn){btn.disabled=false;btn.textContent='تسجيل الدخول';}
   }
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindLogin);else bindLogin();
 const bust=()=>{
  document.querySelectorAll('script[src^="app-v2.js"]').forEach(s=>{s.src='app-v2.js?v=20260818-5'});
  document.querySelectorAll('script[src^="teacher-page-final.js"]').forEach(s=>{s.src='teacher-page-final.js?v=20260818-4'});
 };
 bust();
 window.addEventListener('load',function(){
  try{ if(window.supabase && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY && !window.supabaseClient){ window.supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY); } }catch(e){ console.error(e); }
 });
})();
