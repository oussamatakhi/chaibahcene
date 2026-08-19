(()=>{'use strict';
const $=id=>document.getElementById(id);
let busy=false,timer=null;
function norm(v){return String(v||'').replace(/\s+/g,' ').trim()}
function removeCombined(){const f=$('teacherForm');if(!f)return;
  const nodes=[...f.querySelectorAll('*')];
  nodes.forEach(el=>{
    const text=norm(el.textContent);
    if(!/تاريخ\s*ومكان\s*الميلاد/.test(text))return;
    const parent=el.closest('label');
    if(parent){parent.remove();return}
    if(el.children.length===0)el.remove();
  });
  ['teacherBirthDatePlace','teacherBirthDatePlaceInput','teacherBirth'].forEach(id=>{const e=$(id);if(e){const p=e.closest('label')||e.closest('.form-group')||e;e.remove();if(p!==e)p.remove()}});
}
function addField(id,name,label,type,afterId){if($(id))return;const anchor=$(afterId);if(!anchor)return;const wrapper=document.createElement('label');wrapper.dataset.teacherBirthSplit='1';const span=document.createElement('span');span.textContent=label;const input=document.createElement('input');input.id=id;input.name=name;input.type=type;wrapper.append(span,input);const anchorLabel=anchor.closest('label');if(anchorLabel)anchorLabel.insertAdjacentElement('afterend',wrapper);}
function splitBirth(){const f=$('teacherForm');if(!f)return;removeCombined();addField('teacherBirthDate','birth_date','تاريخ الميلاد','date','teacherAppointmentDate');addField('teacherBirthPlace','birth_place','مكان الميلاد','text','teacherBirthDate');}
function normalizeModal(){const m=$('teacherModal');if(!m)return;m.hidden=false;m.style.display='';m.classList.remove('show','open','active');void m.offsetWidth;m.classList.add('show');}
function closeNormalize(){const m=$('teacherModal');if(!m)return;m.hidden=true;m.style.display='none';m.classList.remove('show','open','active')}
async function reopen(id){const m=$('teacherModal');if(!m)return;normalizeModal();splitBirth();if(window.teacherSaveV2?.loadTeacher)await window.teacherSaveV2.loadTeacher(id);splitBirth();normalizeModal()}
function wrapUpdate(){if(typeof window.updateTeacher!=='function'||window.updateTeacher.__splitFix)return;const original=window.updateTeacher;const wrapped=async function(id){if(busy)return;busy=true;try{const m=$('teacherModal');if(m){m.hidden=true;m.style.display='none';m.classList.remove('show','open','active')}splitBirth();await original(id);splitBirth();normalizeModal();if(window.teacherSaveV2?.loadTeacher)await window.teacherSaveV2.loadTeacher(id);splitBirth();normalizeModal()}finally{busy=false}};wrapped.__splitFix=true;window.updateTeacher=wrapped}
function observe(){const f=$('teacherForm'),m=$('teacherModal');if(!f||!m)return;if(f.dataset.birthSplitObserver==='1')return;f.dataset.birthSplitObserver='1';const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!busy){splitBirth();wrapUpdate()}},20)});obs.observe(f,{childList:true,subtree:true});wrapUpdate();splitBirth();}
function init(){observe();setTimeout(observe,300);setTimeout(observe,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.teacherUpdateUIFix={splitBirth,normalizeModal,closeNormalize,reopen};})();