(()=>{'use strict';
const $=id=>document.getElementById(id),days=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس'];
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const client=()=>window.__APP_SUPABASE_CLIENT||window.supabaseClient||window.sb;
const data=()=>window.__platformData||window.cache||{};
const teacher=id=>(data().teachers||[]).find(x=>String(x.id)===String(id));
let currentId=null,currentRows=[];
function ensureModal(){
 const modal=$('teacherScheduleModal');
 if(!modal)return null;
 modal.style.zIndex='3000';
 modal.hidden=false;modal.style.display='none';
 const close=modal.querySelector('.close');
 if(close)close.onclick=()=>{modal.hidden=true;modal.style.display='none'};
 return modal;
}
function showEditor(){
 const b=$('teacherScheduleView');if(!b)return;
 b.innerHTML='<div class="profile-head"><div><h2>تعديل الجدول الأسبوعي</h2><p>يمكن إضافة الحصص أو تعديلها أو حذفها ثم حفظ التغييرات.</p></div></div><div id="scheduleEditRows"></div><div class="profile-actions"><button type="button" class="ghost" id="addScheduleEditRow">+ إضافة حصة</button><button type="button" class="primary" id="saveScheduleEdit">حفظ الجدول</button><button type="button" class="ghost" id="cancelScheduleEdit">إلغاء</button></div>';
 const rows=$('scheduleEditRows');
 const add=(v={})=>{const r=document.createElement('div');r.className='schedule-row';r.style.cssText='display:grid;grid-template-columns:1.2fr 1fr 1fr 1.4fr auto;gap:8px;align-items:center;margin:8px 0';r.innerHTML='<select class="schedule-day"><option value="">اليوم</option>'+days.map((d,i)=>'<option value="'+i+'">'+d+'</option>').join('')+'</select><input class="schedule-start" type="time"><input class="schedule-end" type="time"><input class="schedule-section" placeholder="القسم"><button type="button" class="small-btn danger">حذف</button>';r.querySelector('.schedule-day').value=String(v.day_of_week??'');r.querySelector('.schedule-start').value=String(v.start_time||'').slice(0,5);r.querySelector('.schedule-end').value=String(v.end_time||'').slice(0,5);r.querySelector('.schedule-section').value=v.section||'';r.querySelector('button').onclick=()=>r.remove();rows.appendChild(r)};
 currentRows.forEach(add);if(!currentRows.length)add();
 $('addScheduleEditRow').onclick=()=>add();
 $('cancelScheduleEdit').onclick=()=>renderView();
 $('saveScheduleEdit').onclick=saveEdited;
}
async function saveEdited(){
 const c=client(),items=[...document.querySelectorAll('#scheduleEditRows .schedule-row')].map(r=>({day_of_week:r.querySelector('.schedule-day').value,start_time:r.querySelector('.schedule-start').value,end_time:r.querySelector('.schedule-end').value,section:r.querySelector('.schedule-section').value.trim()})).filter(x=>x.day_of_week!==''||x.start_time||x.end_time||x.section);
 for(const x of items){if(x.day_of_week===''||!x.start_time||!x.end_time||!x.section)return alert('يرجى إكمال اليوم والتوقيت والقسم لكل حصة.');if(x.end_time<=x.start_time)return alert('وقت نهاية الحصة يجب أن يكون بعد وقت بدايتها.')}
 const btn=$('saveScheduleEdit');if(btn){btn.disabled=true;btn.textContent='جارٍ الحفظ...'}
 try{const del=await c.from('teacher_schedule').delete().eq('teacher_id',currentId);if(del.error)throw del.error;if(items.length){const ins=await c.from('teacher_schedule').insert(items.map(x=>({...x,day_of_week:Number(x.day_of_week),teacher_id:currentId})));if(ins.error)throw ins.error}alert('تم حفظ الجدول الأسبوعي بنجاح.');await renderView()}catch(e){alert('تعذر حفظ الجدول الأسبوعي: '+(e.message||e))}finally{if(btn){btn.disabled=false;btn.textContent='حفظ الجدول'}}
}
function renderView(){
 const b=$('teacherScheduleView'),t=teacher(currentId);if(!b)return;
 b.innerHTML='<div class="profile-head"><div><h2>الجدول الأسبوعي للأستاذ</h2><p>'+esc(t?((t.last_name||'')+' '+(t.first_name||'')):'')+'</p><span class="badge">'+esc(t?.institutions?.name||data().institutions?.find(x=>String(x.id)===String(t?.institution_id))?.name||'دون مؤسسة')+'</span></div></div><div class="profile-actions"><button type="button" class="primary" id="editWeeklySchedule">تعديل الجدول الأسبوعي</button></div>'+(currentRows.length?'<div class="table-wrap"><table><thead><tr><th>اليوم</th><th>التوقيت</th><th>القسم</th></tr></thead><tbody>'+currentRows.map(x=>'<tr><td>'+esc(days[Number(x.day_of_week)]||x.day_of_week)+'</td><td>'+esc(String(x.start_time||'').slice(0,5))+' – '+esc(String(x.end_time||'').slice(0,5))+'</td><td>'+esc(x.section||'—')+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty">لا توجد حصص مسجلة لهذا الأستاذ.</div>');
 $('editWeeklySchedule').onclick=showEditor;
}
async function show(id){
 currentId=id;const modal=ensureModal(),b=$('teacherScheduleView');modal.hidden=false;modal.style.display='grid';b.innerHTML='<div class="empty">جارٍ تحميل الجدول...</div>';
 const c=client(),q=await c.from('teacher_schedule').select('day_of_week,start_time,end_time,section').eq('teacher_id',id).order('day_of_week').order('start_time');
 if(q.error){b.innerHTML='<div class="empty">تعذر تحميل الجدول الأسبوعي: '+esc(q.error.message)+'</div>';return}
 currentRows=q.data||[];renderView();
}
window.showTeacherWeeklySchedule=show;
function addRecordButton(id){const a=document.querySelector('#teacherProfile .profile-actions');if(!a||a.querySelector('.weekly-schedule-record-btn'))return;const b=document.createElement('button');b.type='button';b.className='ghost weekly-schedule-record-btn';b.textContent='جدول التوقيت';b.onclick=()=>show(id);a.insertBefore(b,a.firstChild)}
function hookProfile(){const old=window.viewTeacher;if(typeof old!=='function'||old.__scheduleProfileHook)return;const wrapped=function(id){const r=old.apply(this,arguments);setTimeout(()=>addRecordButton(id),80);return r};wrapped.__scheduleProfileHook=true;window.viewTeacher=wrapped}
function addDeleteButtons(){const box=$('visitsTable');if(!box)return;box.querySelectorAll('tbody tr').forEach(row=>{if(row.dataset.directDelete==='1')return;const cells=row.querySelectorAll('td');if(cells.length<6)return;const status=(cells[4]?.textContent||'').trim();if(!/مجدولة|مبرمجة/.test(status)){row.dataset.directDelete='1';return}const edit=[...row.querySelectorAll('.actions button')].find(b=>/تعديل/.test(b.textContent));if(!edit)return;const m=String(edit.getAttribute('onclick')||'').match(/['"]([^'"]+)['"]/);if(!m)return;const b=document.createElement('button');b.type='button';b.className='small-btn danger';b.textContent='حذف';b.onclick=async()=>{if(!confirm('هل تريد حذف هذه الزيارة المبرمجة؟'))return;const q=await client().from('visits').delete().eq('id',m[1]);if(q.error)return alert('تعذر حذف الزيارة: '+q.error.message);await window.loadAll?.()};edit.insertAdjacentElement('afterend',b);row.dataset.directDelete='1'})}
function init(){hookProfile();const v=$('visitsTable');if(v&&!v.dataset.scheduleDeleteObserver){v.dataset.scheduleDeleteObserver='1';new MutationObserver(()=>setTimeout(addDeleteButtons,60)).observe(v,{childList:true,subtree:true})}addDeleteButtons()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500));else setTimeout(init,500);
window.addEventListener('load',()=>setTimeout(init,900));
})();