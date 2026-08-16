const sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
const $ = id => document.getElementById(id);
let cache = {teachers:[], institutions:[], visits:[], seminars:[], dispatches:[]};
let authSubscription = null;

function openModal(id){ const el=$(id); if(el) el.hidden=false; }
function closeModal(id){ const el=$(id); if(el) el.hidden=true; }
function esc(v){return String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]))}
function fmtDate(v){return v?new Date(v+'T00:00:00').toLocaleDateString('ar-DZ'):'—'}
function today(){return new Date().toISOString().slice(0,10)}

function showLoginError(message){
  const box=$('loginError'); if(!box) return;
  box.textContent=message||''; box.style.display=message?'block':'none';
  box.style.padding=message?'10px 12px':'0'; box.style.marginTop=message?'12px':'0';
  box.style.background=message?'#fef2f2':'transparent'; box.style.border=message?'1px solid #fecaca':'0'; box.style.borderRadius=message?'8px':'0';
}
function showLogin(){$('loginView').hidden=false;$('dashboardView').hidden=true;}
function showApp(){$('loginView').hidden=true;$('dashboardView').hidden=false;loadAll();}

async function init(){
  try{
    if(!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY || window.SUPABASE_PUBLISHABLE_KEY.includes('ضع_')){showLoginError('إعدادات الاتصال بقاعدة البيانات غير مكتملة.');return;}
    const listener=sb.auth.onAuthStateChange((event,session)=>{console.log('Auth event:',event,!!session);if(event==='SIGNED_IN'&&session)showApp();else if(event==='SIGNED_OUT')showLogin();});
    authSubscription=listener?.data?.subscription||null;
    const {data,error}=await sb.auth.getSession();
    if(error){console.error('getSession error:',error);showLoginError('تعذر الاتصال بخدمة تسجيل الدخول: '+error.message);return;}
    if(data?.session)showApp();else showLogin();
  }catch(err){console.error('Initialization error:',err);showLoginError('حدث خطأ في تشغيل المنصة: '+(err.message||err));}
}

$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=e.submitter||e.target.querySelector('button[type="submit"]'); const email=$('email').value.trim(); const password=$('password').value; showLoginError('');
  if(!email||!password){showLoginError('أدخل البريد الإلكتروني وكلمة المرور.');return;}
  if(btn){btn.disabled=true;btn.textContent='جارٍ تسجيل الدخول...';}
  try{
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error){let msg=error.message||'بيانات الدخول غير صحيحة.';if(/invalid login credentials/i.test(msg))msg='البريد الإلكتروني أو كلمة المرور غير صحيحة.';if(/email not confirmed/i.test(msg))msg='الحساب موجود، لكن البريد الإلكتروني غير مؤكد.';showLoginError(msg);return;}
    if(!data?.session){showLoginError('تم تسجيل الدخول دون إنشاء جلسة.');return;}
    showLoginError('');showApp();
  }catch(err){console.error('Login exception:',err);showLoginError('تعذر تنفيذ تسجيل الدخول: '+(err.message||err));}
  finally{if(btn){btn.disabled=false;btn.textContent='تسجيل الدخول';}}
});

$('logoutBtn').onclick=async()=>{const {error}=await sb.auth.signOut();if(error)showLoginError('تعذر تسجيل الخروج: '+error.message);};

document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.section').forEach(x=>x.hidden=true);$(b.dataset.section).hidden=false;});

async function loadAll(){
 try{
  const [t,i,v,s,d]=await Promise.all([
   sb.from('teachers').select('*,institutions(name)').order('last_name'),
   sb.from('institutions').select('*').order('name'),
   sb.from('visits').select('*,teachers(first_name,last_name,employee_number),institutions(name)').order('scheduled_date'),
   sb.from('seminars').select('*').order('seminar_date'),
   sb.from('dispatches').select('*').order('dispatch_date',{ascending:false})
  ]);
  const errors=[t,i,v,s,d].filter(x=>x.error);if(errors.length)console.error('Database errors',errors);
  cache={teachers:t.data||[],institutions:i.data||[],visits:v.data||[],seminars:s.data||[],dispatches:d.data||[]};
  $('countTeachers').textContent=cache.teachers.length;$('countInstitutions').textContent=cache.institutions.length;$('countVisits').textContent=cache.visits.length;$('countSeminars').textContent=cache.seminars.length;
  renderTeachers();renderInstitutions();renderVisits();renderSeminars();renderDispatches();fillSelects();renderUpcoming();
 }catch(err){console.error('loadAll error:',err);}
}

function renderTeachers(){
 const q=($('teacherSearch')?.value||'').toLowerCase();
 const rows=cache.teachers.filter(x=>(x.first_name+' '+x.last_name+' '+(x.employee_number||'')+' '+(x.institutions?.name||'')).toLowerCase().includes(q));
 $('teachersTable').innerHTML=`<table><thead><tr><th>رقم الموظف</th><th>الأستاذ</th><th>المؤسسة</th><th>الرتبة</th><th>الدرجة</th><th>آخر تفتيش</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.employee_number||'—')}</td><td>${esc(x.last_name+' '+x.first_name)}</td><td>${esc(x.institutions?.name||'—')}</td><td>${esc(x.rank||'—')}</td><td>${esc(x.grade||'—')}</td><td>${fmtDate(x.last_inspection_date)}</td></tr>`).join('')}</tbody></table>`;
}

function renderInstitutions(){
 $('institutionsTable').innerHTML=`<table><thead><tr><th>المؤسسة</th><th>النوع</th><th>البلدية</th><th>المقاطعة الإدارية</th><th>المدير</th><th>الهاتف</th></tr></thead><tbody>${cache.institutions.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.institution_type||'—')}</td><td>${esc(x.municipality||'—')}</td><td>${esc(x.administrative_district||'—')}</td><td>${esc(x.director_name||'—')}</td><td>${esc(x.phone||'—')}</td></tr>`).join('')}</tbody></table>`;
}

function renderVisits(){
 $('visitsTable').innerHTML=`<table><thead><tr><th>التاريخ</th><th>الأستاذ</th><th>المؤسسة</th><th>النوع</th><th>المكان</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>${cache.visits.map(x=>`<tr><td>${fmtDate(x.scheduled_date)}</td><td>${esc((x.teachers?.last_name||'')+' '+(x.teachers?.first_name||''))}</td><td>${esc(x.institutions?.name||'—')}</td><td>${esc(x.visit_type||'—')}</td><td>${esc(x.field_location||'الملعب / الفضاء الرياضي')}</td><td><span class="badge">${esc(x.status||'مبرمجة')}</span></td><td class="actions"><button class="action-btn edit" onclick="editVisit('${x.id}')">تعديل</button><button class="action-btn delete" onclick="deleteVisit('${x.id}')">حذف</button></td></tr>`).join('')}</tbody></table>`;
}

function renderSeminars(){$('seminarsTable').innerHTML=`<table><thead><tr><th>التاريخ</th><th>العنوان</th><th>المكان</th><th>الحالة</th></tr></thead><tbody>${cache.seminars.map(x=>`<tr><td>${fmtDate(x.seminar_date)}</td><td>${esc(x.title)}</td><td>${esc(x.location||'—')}</td><td><span class="badge">${esc(x.status||'مجدولة')}</span></td></tr>`).join('')}</tbody></table>`}
function renderDispatches(){$('dispatchesTable').innerHTML=`<table><thead><tr><th>التاريخ</th><th>رقم الإرسال</th><th>الجهة</th><th>الموضوع</th></tr></thead><tbody>${cache.dispatches.map(x=>`<tr><td>${fmtDate(x.dispatch_date)}</td><td>${esc(x.dispatch_number||'—')}</td><td>${esc(x.recipient||'—')}</td><td>${esc(x.subject||'—')}</td></tr>`).join('')}</tbody></table>`}
function renderUpcoming(){const v=cache.visits.filter(x=>x.scheduled_date>=today()).slice(0,6);$('upcomingVisits').innerHTML=v.length?'<ul class="upcoming">'+v.map(x=>`<li><b>${fmtDate(x.scheduled_date)}</b> — ${esc((x.teachers?.last_name||'')+' '+(x.teachers?.first_name||''))} — ${esc(x.institutions?.name||'')} — ${esc(x.visit_type||'')}</li>`).join('')+'</ul>':'<div class="empty">لا توجد زيارات قادمة.</div>'}

function fillSelects(){
 $('teacherInstitution').innerHTML='<option value="">— اختر —</option>'+cache.institutions.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
 $('visitInstitution').innerHTML='<option value="">— اختر —</option>'+cache.institutions.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
 $('visitTeacher').innerHTML='<option value="">— اختر —</option>'+cache.teachers.map(x=>`<option value="${x.id}">${esc(x.last_name+' '+x.first_name+' — '+(x.employee_number||''))}</option>`).join('');
}

function formObj(form){return Object.fromEntries(new FormData(form).entries());}
function resetVisitForm(){
 $('visitForm').reset();$('visitId').value='';$('visitModalTitle').textContent='برمجة زيارة';$('visitSaveBtn').textContent='حفظ';$('visitLocation').value='الملعب / الفضاء الرياضي';$('visitType').value='توجيهية';
}
function openNewVisitModal(){resetVisitForm();openModal('visitModal');}

window.editVisit=async function(id){
 const v=cache.visits.find(x=>x.id===id);if(!v)return;
 $('visitId').value=v.id;$('visitTeacher').value=v.teacher_id||'';$('visitInstitution').value=v.institution_id||'';$('visitDate').value=v.scheduled_date||'';$('visitTime').value=v.scheduled_time||'';$('visitType').value=v.visit_type||'توجيهية';$('visitLocation').value=v.field_location||'الملعب / الفضاء الرياضي';$('visitObjective').value=v.objective||'';$('visitModalTitle').textContent='تعديل الزيارة';$('visitSaveBtn').textContent='حفظ التعديلات';openModal('visitModal');};

window.deleteVisit=async function(id){
 const v=cache.visits.find(x=>x.id===id);if(!v)return;
 const teacher=(v.teachers?.last_name||'')+' '+(v.teachers?.first_name||'');
 if(!confirm(`هل تريد حذف الزيارة المبرمجة للأستاذ ${teacher} بتاريخ ${fmtDate(v.scheduled_date)}؟`))return;
 const {error}=await sb.from('visits').delete().eq('id',id);
 if(error){alert('تعذر حذف الزيارة: '+error.message);return;}
 await loadAll();
};

$('teacherForm').addEventListener('submit',async e=>{e.preventDefault();const o=formObj(e.target);delete o.employee_number;o.experience_years=null;const {error}=await sb.from('teachers').insert(o);if(error){alert('تعذر إضافة الأستاذ: '+error.message);return;}closeModal('teacherModal');e.target.reset();await loadAll();});
$('institutionForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.from('institutions').insert(formObj(e.target));if(error){alert('تعذر إضافة المؤسسة: '+error.message);return;}closeModal('institutionModal');e.target.reset();await loadAll();});
$('visitForm').addEventListener('submit',async e=>{
 e.preventDefault();const o=formObj(e.target);const id=o.id;delete o.id;
 if(!o.institution_id)o.institution_id=null;
 if(!o.scheduled_time)o.scheduled_time=null;
 if(id){const {error}=await sb.from('visits').update(o).eq('id',id);if(error){alert('تعذر تعديل الزيارة: '+error.message);return;}}
 else{const {error}=await sb.from('visits').insert(o);if(error){alert('تعذر إضافة الزيارة: '+error.message);return;}}
 closeModal('visitModal');resetVisitForm();await loadAll();
});
$('seminarForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.from('seminars').insert(formObj(e.target));if(error){alert('تعذر إضافة الندوة: '+error.message);return;}closeModal('seminarModal');e.target.reset();await loadAll();});
$('dispatchForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.from('dispatches').insert(formObj(e.target));if(error){alert('تعذر إضافة جدول الإرسال: '+error.message);return;}closeModal('dispatchModal');e.target.reset();await loadAll();});
$('teacherSearch').addEventListener('input',renderTeachers);

init();