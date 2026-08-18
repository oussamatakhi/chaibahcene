(()=>{'use strict';
const TEXTS=new Set(['غلق النافذة','إغلاق النافذة']);
function clean(){document.querySelectorAll('.modal button').forEach(b=>{if(TEXTS.has((b.textContent||'').replace(/\s+/g,' ').trim()))b.remove()})}
function schedule(){setTimeout(clean,0);setTimeout(clean,80)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
window.addEventListener('load',schedule,{once:true});
document.addEventListener('click',e=>{if(e.target.closest('button,[role="button"]'))schedule()},{passive:true});
window.__CLEAN_MODAL_CLOSE_TEXTS__=clean;
})();