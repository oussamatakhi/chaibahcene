// إعدادات Supabase
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";
window.GOOGLE_DRIVE_CLIENT_ID = "";
(function(){'use strict';
if(window.supabase&&!window.__APP_SUPABASE_CLIENT){window.__APP_SUPABASE_CLIENT=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);window.supabaseClient=window.__APP_SUPABASE_CLIENT}
function showApp(){const l=document.getElementById('loginView'),d=document.getElementById('dashboardView');if(l)l.hidden=true;if(d)d.hidden=false}
async function startAfterAuth(){showApp();if(typeof window.startApp==='function'){try{await window.startApp()}catch(e){console.error(e)}}}
function bindLogin(){const f=document.getElementById('loginForm');if(!f||f.dataset.configLoginBound==='1')return;f.dataset.configLoginBound='1';f.addEventListener('submit',async function(e){e.preventDefault();e.stopImmediatePropagation();const b=e.submitter||f.querySelector('button[type="submit"]'),email=(document.getElementById('email')?.value||'').trim(),password=document.getElementById('password')?.value||'',msg=document.getElementById('loginError');if(!email||!password)return;if(b){b.disabled=true;b.textContent='جارٍ تسجيل الدخول...'}if(msg){msg.textContent='';msg.style.display='none'}try{const r=await window.__APP_SUPABASE_CLIENT.auth.signInWithPassword({email,password});if(r.error){if(msg){msg.textContent=/invalid login credentials/i.test(r.error.message)?'البريد الإلكتروني أو كلمة المرور غير صحيحة.':r.error.message;msg.style.display='block'}return}if(r.data?.session)await startAfterAuth()}catch(err){if(msg){msg.textContent='تعذر تسجيل الدخول: '+(err?.message||'خطأ غير معروف');msg.style.display='block'}}finally{if(b){b.disabled=false;b.textContent='تسجيل الدخول'}}},true)}
async function restoreSession(){const c=window.__APP_SUPABASE_CLIENT;if(!c)return;try{const{data}=await c.auth.getSession();if(data?.session)await startAfterAuth()}catch(e){console.error(e)}}
function init(){bindLogin();restoreSession()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
