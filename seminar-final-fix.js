(()=>{'use strict';
const $=id=>document.getElementById(id),C=()=>window.__APP_SUPABASE_CLIENT||window.supabaseClient||window.sb;
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function teachers(){return window.__platformData?.teachers||window.cache?.teachers||[]}
function restoreTeacherFields(f){
 f.querySelectorAll('.seminar-extra-fields').forEach(x=>x.remove());
 f.querySelectorAll('.seminar-choice-options,.seminar-teachers-list,.seminar-teacher-choice').forEach(x=>x.closest('.full')?.remove()||x.remove());
 const oldSelects=[...f.querySelectorAll('select[name="teacher_ids"]')];
 let select=oldSelects[0];
 oldSelects.slice(1).forEach(x=>x.closest('label')?.remove()||x.remove());
 if(!select){const box=document.createElement('label');box.className='full';box.innerHTML='<span>الأساتذة المعنيون بالندوة</span><select id="seminarTeachers" name="teacher_ids" multiple size="8"></select>';f.querySelector('button[type=submit]').before(box);select=box.querySelector('select')}
 select.id=select.id||'seminarTeachers';select.name='teacher_ids';select.multiple=true;select.size=8;
 select.innerHTML=teachers().map(t=>`<option value="${E(t.id)}">${E((t.last_name||'')+' '+(t.first_name||''))} — ${E(t.institutions?.name||'دون مؤسسة')}</option>`).join('');
 let oldFac=[...f.querySelectorAll('input[name="facilitators"],textarea[name="facilitators"],input[name="moderators"],textarea[name="moderators"]')];oldFac.forEach(x=>x.closest('label')?.remove()||x.remove());
 const fac=document.createElement('label');fac.className='full';fac.innerHTML='<span>المؤطرون</span><input type="text" name="facilitators" placeholder="أدخل أسماء المؤطرين">';select.closest('label')?.after(fac)||select.parentElement?.after(fac);
 return select;
}
function addStyles(){if($('seminarTeacherStyle'))return;const s=document.createElement('style');s.id='seminarTeacherStyle';s.textContent='.seminar-extra-fields,.seminar-choice-options,.seminar-teachers-list,.seminar-teacher-choice{display:none!important}#seminarTeachers{width:100%;min-height:180px;padding:11px 12px;border:1px solid #dbe2ea;border-radius:9px;font-family:Cairo,sans-serif;background:#fff}#seminarTeachers option{padding:7px 6px}';document.head.appendChild(s)}
async function save(f,select){const data=Object.fromEntries(new FormData(f).entries());const ids=[...select.selectedOptions].map(o=>o.value);if(!ids.length){alert('يرجى اختيار أستاذ واحد على الأقل.');return}const client=C();if(!client){alert('تعذر الاتصال بقاعدة البيانات.');return}const seminarId=crypto.randomUUID();const payload={id:seminarId,title:data.title,seminar_date:data.seminar_date,start_time:data.start_time||null,end_time:data.end_time||null,location:data.location||null,theme:data.theme||null,objectives:data.objectives||null,status:'مبرمجة'};if(data.facilitators!==undefined)payload.facilitators=data.facilitators||null;const r=await client.from('seminars').insert(payload);if(r.error){alert('تعذر تسجيل الندوة: '+r.error.message);return}const a=await client.from('seminar_attendance').insert(ids.map(id=>({seminar_id:seminarId,teacher_id:id,present:true})));if(a.error){alert('تم تسجيل الندوة لكن تعذر ربط الأساتذة: '+a.error.message);return}alert('تم تسجيل الندوة بنجاح');f.reset();restoreTeacherFields(f);window.closeModal?.('seminarModal');await window.loadAll?.()}
function init(){const f=$('seminarForm');if(!f||f.dataset.sf3)return;f.dataset.sf3='1';addStyles();const select=restoreTeacherFields(f);f.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();const btn=f.querySelector('button[type=submit]');if(btn){btn.disabled=true;btn.textContent='جارٍ الحفظ...'}try{await save(f,select)}finally{if(btn){btn.disabled=false;btn.textContent='حفظ'}}},true)}
setTimeout(init,400);window.addEventListener('load',()=>setTimeout(init,900));window.initSeminarTeacherSelection=init;
})();