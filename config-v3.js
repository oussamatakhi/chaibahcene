// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
window.GOOGLE_DRIVE_CLIENT_ID = "";
(function(){
 'use strict';
 // استخدم عميلاً واحداً فقط في كامل التطبيق لمنع تضارب جلسة المصادقة.
 if(window.supabase && !window.__APP_SUPABASE_CLIENT){
  const originalCreateClient=window.supabase.createClient.bind(window.supabase);
  window.__APP_SUPABASE_CLIENT=originalCreateClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
  window.supabase.createClient=function(){return window.__APP_SUPABASE_CLIENT};
  window.supabaseClient=window.__APP_SUPABASE_CLIENT;
 }
 function bindLogin(){
  const f=document.getElementById('loginForm');
  if(!f||f.dataset.configLoginBound==='1')return;
  f.dataset.configLoginBound='1';
  f.addEventListener('submit',async function(e){
   e.preventDefault();e.stopImmediatePropagation();
   const btn=e.submitter||f.querySelector('button[type="submit"]');
   const email=(document.getElementById('email')?.value||'').trim();
   const password=document.getElementById('password')?.value||'';
   const msg=document.getElementById('loginError');
   if(!email||!password)return;
   if(btn){btn.disabled=true;btn.textContent='جارٍ تسجيل الدخول...';}
   if(msg){msg.textContent='';msg.style.display='none';}
   try{
    const result=await window.__APP_SUPABASE_CLIENT.auth.signInWithPassword({email,password});
    if(result.error){if(msg){msg.textContent=/invalid login credentials/i.test(result.error.message)?'البريد الإلكتروني أو كلمة المرور غير صحيحة.':result.error.message;msg.style.display='block';}return;}
    if(result.data?.session){
     document.getElementById('loginView').hidden=true;
     document.getElementById('dashboardView').hidden=false;
     if(typeof window.loadAll==='function')window.loadAll();
    }
   }catch(err){if(msg){msg.textContent='تعذر تسجيل الدخول: '+(err?.message||'خطأ غير معروف');msg.style.display='block';}}
   finally{if(btn){btn.disabled=false;btn.textContent='تسجيل الدخول';}}
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindLogin);else bindLogin();
 // منع إعادة تحميل ملفات التطبيق قسراً بأرقام قديمة.
 const bust=()=>{
  document.querySelectorAll('script[src^="app-v2.js"]').forEach(s=>{s.src='app-v2.js?v=20260818-6'});
  document.querySelectorAll('script[src^="teacher-page-final.js"]').forEach(s=>{s.src='teacher-page-final.js?v=20260818-5'});
 };
 bust();
 // طبقة إصلاح نهائية بعد اكتمال تحميل جميع ملفات المنصة: تعيد ربط التنقل وتسترجع البيانات حتى لو فشل أحد الملفات الإضافية.
 window.addEventListener('load',function(){
  if(document.querySelector('script[data-platform-repair="1"]'))return;
  const s=document.createElement('script');
  s.src='app-repair.js?v=20260818-1';
  s.dataset.platformRepair='1';
  document.body.appendChild(s);
 });
})();
