(()=>{'use strict';
const $=id=>document.getElementById(id);
let busy=false,timer=null;
function norm(v){return String(v||'').replace(/\s+/g,' ').trim()}
function renameBirthPlaceLabel(){const f=$('teacherForm');if(!f)return;[...f.querySelectorAll('label,span,div')].forEach(el=>{if(el.children.length>0)return;const text=norm(el.textContent);if(text==='تاريخ ومكان الميلاد')el.textContent='مكان الميلاد';});}
function normalizeModal(){const m=$('teacherModal');if(!m)return;m.hidden=false;m.style.display='';m.classList.remove('show','open','active');void m.offsetWidth;m.classList.add('show');renameBirthPlaceLabel()}
function closeNormalize(){const m=$('teacherModal');if(!m)return;m.hidden=true;m.style.display='none';m.classList.remove('show','open','active')}
function wrapUpdate(){if(typeof window.updateTeacher!=='function'||window.updateTeacher.__labelFix)return;const original=window.updateTeacher;const wrapped=async function(id){if(busy)return;busy=true;try{await original(id);renameBirthPlaceLabel();normalizeModal()}finally{busy=false}};wrapped.__labelFix=true;window.updateTeacher=wrapped}
function observe(){const f=$('teacherForm'),m=$('teacherModal');if(!f||!m)return;if(f.dataset.birthLabelObserver==='1')return;f.dataset.birthLabelObserver='1';const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!busy){renameBirthPlaceLabel();wrapUpdate()}},20)});obs.observe(f,{childList:true,subtree:true});wrapUpdate();renameBirthPlaceLabel()}
function init(){observe();setTimeout(observe,300);setTimeout(observe,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.teacherUpdateUIFix={renameBirthPlaceLabel,normalizeModal,closeNormalize};})();