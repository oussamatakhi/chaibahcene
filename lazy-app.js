(()=>{'use strict';
let started=false, loading=null;
const scripts=['app-v2.js?v=20260818-7','report-template.js?v=20260817-4','report-bridge.js?v=20260817-4','report-fix.js?v=20260817-4','data-tools-v2.js?v=20260817-2','report-text-fix.js?v=20260817-2','teacher-birth-fields.js?v=20260817-3','teacher-form-final.js?v=20260818-3','report-teacher-autofill.js?v=20260817-1','teacher-save-final.js?v=20260818-2','mobile-menu.js?v=20260818-2','mobile-modal-fix.js?v=20260818-1','report-modal-close-fix.js?v=20260818-1','teacher-page-final.js?v=20260818-3','visit-type-fix.js?v=20260818-1','modal-open-fix.js?v=20260818-1'];
function load(src){return new Promise((resolve,reject)=>{if([...document.scripts].some(s=>s.src.includes(src.split('?')[0]))){resolve();return}const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('تعذر تحميل '+src));document.body.appendChild(s)})}
window.startApp=async function(){if(started)return loading||Promise.resolve();started=true;loading=scripts.reduce((p,src)=>p.then(()=>load(src)),Promise.resolve()).then(()=>{if(typeof window.loadAll==='function')return window.loadAll()}).catch(err=>{console.error(err);started=false;throw err});return loading};
window.__APP_READY_LOADER__=true;
})();
