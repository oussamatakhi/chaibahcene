(()=>{'use strict';
const $=id=>document.getElementById(id);
let busy=false,timer=null;
function norm(v){return String(v||'').replace(/\s+/g,' ').trim()}
function blockLegacyCombinedField(){const f=$('teacherForm');if(!f)return;
  [...f.querySelectorAll('label')].forEach(l=>{const text=norm(l.textContent);const input=l.querySelector('#teacherBirthDatePlace,[name="birth_date_place"]');if(/تاريخ\s*ومكان\s*الميلاد/.test(text)||input)l.remove()});
  const old=$('teacherBirthDatePlace');if(old)old.remove();
  const extra=$('teacherFrameworkExtra');
  if(extra&&/تاريخ\s*ومكان\s*الميلاد/.test(norm(extra.textContent)))extra.remove();
  /* حارس يمنع data-tools-v2 القديم من إعادة إنشاء الحقل الموحد */
  if(!document.getElementById('teacherFrameworkExtra')){const guard=document.createElement('span');guard.id='teacherFrameworkExtra';guard.hidden=true;guard.dataset.legacyBirthGuard='1';f.appendChild(guard)}
}
function ensureBirthFields(){const f=$('teacherForm');if(!f)return;blockLegacyCombinedField();const appointment=$('teacherAppointmentDate');if(!appointment)return;
  if(!$('teacherBirthDate')){const l=document.createElement('label');l.dataset.birthSplit='date';l.innerHTML='<span>تاريخ الميلاد</span><input id="teacherBirthDate" name="birth_date" type="date">';appointment.closest('label')?.insertAdjacentElement('afterend',l)}
  if(!$('teacherBirthPlace')){const anchor=$('teacherBirthDate');const l=document.createElement('label');l.dataset.birthSplit='place';l.innerHTML='<span>مكان الميلاد</span><input id="teacherBirthPlace" name="birth_place" type="text">';anchor?.closest('label')?.insertAdjacentElement('afterend',l)}
}
function normalizeModal(){const m=$('teacherModal');if(!m)return;m.hidden=false;m.style.display='';m.classList.remove('show','open','active');void m.offsetWidth;m.classList.add('show');ensureBirthFields()}
function closeNormalize(){const m=$('teacherModal');if(!m)return;m.hidden=true;m.style.display='none';m.classList.remove('show','open','active')}
function wrapUpdate(){if(typeof window.updateTeacher!=='function'||window.updateTeacher.__birthSplitFix)return;const original=window.updateTeacher;const wrapped=async function(id){if(busy)return;busy=true;try{await original(id);ensureBirthFields();normalizeModal()}finally{busy=false}};wrapped.__birthSplitFix=true;window.updateTeacher=wrapped}
function observe(){const f=$('teacherForm'),m=$('teacherModal');if(!f||!m)return;if(f.dataset.birthSplitObserver==='2')return;f.dataset.birthSplitObserver='2';const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!busy){ensureBirthFields();wrapUpdate()}},30)});obs.observe(f,{childList:true,subtree:true});wrapUpdate();ensureBirthFields()}
function init(){observe();setTimeout(observe,300);setTimeout(observe,1000);setTimeout(observe,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.teacherUpdateUIFix={ensureBirthFields,normalizeModal,closeNormalize};})();