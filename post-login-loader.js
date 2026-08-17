/* تحميل ملفات الوحدات الثقيلة بعد الدخول فقط، لتسريع شاشة تسجيل الدخول */
(function(){
'use strict';
let loaded=false;
const files=[
 'report-template.js?v=20260817-5',
 'report-bridge.js?v=20260817-5',
 'report-fix.js?v=20260817-5',
 'data-tools-v2.js?v=20260817-3',
 'report-text-fix.js?v=20260817-3',
 'teacher-birth-fields.js?v=20260817-4',
 'report-teacher-autofill.js?v=20260817-2',
 'teacher-save-final.js?v=20260818-3',
 'mobile-menu.js?v=20260818-2',
 'mobile-modal-fix.js?v=20260818-2',
 'report-modal-close-fix.js?v=20260818-2'
];
function loadOne(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}
async function loadAfterLogin(){
 if(loaded)return; loaded=true;
 for(const f of files){try{await loadOne(f)}catch(e){console.warn('تعذر تحميل الوحدة:',f,e)}}
}
async function check(){try{if(window.sb){const {data}=await window.sb.auth.getSession();if(data?.session)loadAfterLogin();window.sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'&&session)loadAfterLogin();});}}catch(e){console.warn('post-login loader',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);else check();
})();
