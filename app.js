const sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
const $ = id => document.getElementById(id);
let cache = {teachers:[], institutions:[], visits:[], seminars:[], dispatches:[]};

function openModal(id){$(id).hidden=false} function closeModal(id){$(id).hidden=true}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function fmtDate(v){return v?new Date(v+'T00:00:00').toLocaleDateString('ar-DZ'):'—'}

async function init(){
  const {data:{session}} = await sb.auth.getSession();
  if(session) showApp(); else showLogin();
  sb.auth.onAuthStateChange((_e,s)=>s?showApp():showLogin());
}
function showLogin(){$('loginView').hidden=false;$('dashboardView').hidden=true}
function showApp(){$('loginView').hidden=true;$('dashboardView').hidden=false;loadAll()}

$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); $('loginError').textContent='';
  const {error}=await sb.auth.signInWithPassword({email:$('email').value,password:$('password').value});
  if(error)$('loginError').textContent=error.message;
});
$('logoutBtn').onclick=()=>sb.auth.signOut();

document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');
 document.querySelectorAll('.section').forEach(x=>x.hidden=true);$(b.dataset.section).hidden=false;
});

async function loadAll(){
 const [t,i,v,s,d]=await Promise.all([
  sb.from('teachers').select('*,institutions(name)').order('last_name'),
  sb.from('institutions').select('*').order('name'),
  sb.from('visits').select('*,teachers(first_name,last_name),institutions(name)').order('scheduled_date'),
  sb.from('seminars').select('*').order('seminar_date'),
  sb.from('dispatches').select('*').order('dispatch_date',{ascending:false})
 ]);
 cache={teachers:t.data||[],institutions:i.data||[],visits:v.data||[],seminars:s.data||[],dispatches:d.data||[]};
 $('countTeachers').textContent=cache.teachers.length;$('countInstitutions').textContent=cache.institutions.length;$('countVisits').textContent=cache.visits.length;$('countSeminars').textContent=cache.seminars.length;
 renderTeachers();renderInstitutions();renderVisits();renderSeminars();renderDispatches();fillSelects();renderUpcoming();
}
function renderTeachers(){
 const q=($('teacherSearch')?.value||'').toLowerCase();
 const rows=cache.teachers.filter(x=>(x.first_name+' '+x.last_name+' '+(x.institutions?.name||'')).toLowerCase().includes(q));
 $('teachersTable').innerHTML=`<table><thead><tr><th>الأستاذ</th><th>المؤسسة</th><th>الرتبة</th><th>الدرجة</th><th>آخر تفتيش</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.last_name+' '+x.first_name)}</td><td>${esc(x.institutions?.name||'—')}</td><td>${esc(x.rank||'—')}</td><td>${esc(x.grade||'—')}</td><td>${fmtDate(x.last_inspection_date)}</td></tr>`).join('')}</tbody></table>`;
}
function renderInstitutions(){$('institutionsTable').innerHTML=`<table><thead><tr><th>المؤسسة</th><th>البلدية</th><th>المدير</th><th>الهاتف</th></tr></thead><tbody>${cache.institutions.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.municipality||'—')}</td><td>${esc(x.director_name||'—')}</td><td>${esc(x.phone||'—')}</td></tr>`).join('')}</tbody></table>`}
function renderVisits(){$('visitsTable').innerHTML=`<table><thead><tr><th>التاريخ</th><th>الأستاذ</th><th>المؤسسة</th><th>النوع</th><th>الحالة</th></tr></thead><tbody>${cache.visits.map(x=>`<tr><td>${fmtDate(x.scheduled_date)}</td><td>${esc((x.teachers?.last_name||'')+' '+(x.teachers?.first_name||''))}</td><td>${esc(x.institutions?.name||'—')}</td><td>${esc(x.visit_type)}</td><td><span class=\"badge\">${esc(x.status)}</span></td></tr>`).join('')}</tbody></table>`}
function renderSeminars(){$('seminarsTable').innerHTML=`<table><thead><tr><th>التاريخ</th><th>العنوان</th><th>المكان</th><th>الحالة</th></tr></thead><tbody>${cache.seminars.map(x=>`<tr><td>${fmtDate(x.seminar_date)}</td><td>${esc(x.title)}</td><td>${esc(x.location||'—')}</td><td><span class=\"badge\">${esc(x.status)}</span></td></tr>`).join('')}</tbody></table>`}
function renderDispatches(){$('dispatchesTable').innerHTML=`<table><thead><tr><th>التاريخ</th><th>رقم الإرسال</th><th>الجهة</th><th>الموضوع</th></tr></thead><tbody>${cache.dispatches.map(x=>`<tr><td>${fmtDate(x.dispatch_date)}</td><td>${esc(x.dispatch_number||'—')}</td><td>${esc(x.recipient||'—')}</td><td>${esc(x.subject||'—')}</td></tr>`).join('')}</tbody></table>`}
function renderUpcoming(){const v=cache.visits.filter(x=>x.scheduled_date>=new Date().toISOString().slice(0,10)).slice(0,6);$('upcomingVisits').innerHTML=v.length?'<ul class="upcoming">'+v.map(x=>`<li><b>${fmtDate(x.scheduled_date)}</b> — ${esc((x.teachers?.last_name||'')+' '+(x.teachers?.first_name||''))} — ${esc(x.institutions?.name||'')}</li>`).join('')+'</ul>':'<div class="empty">لا توجد زيارات قادمة.</div>'}
function fillSelects(){
 $('teacherInstitution').innerHTML='<option value="">— اختر —</option>'+cache.institutions.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
 $('visitInstitution').innerHTML='<option value="">— اختر —</option>'+cache.institutions.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
 $('visitTeacher').innerHTML='<option value="">— اختر —</option>'+cache.teachers.map(x=>`<option value="${x.id}">${esc(x.last_name+' '+x.first_name)}</option>`).join('');
}
function formObj(form){return Object.fromEntries(new FormData(form).entries())}
$('teacherForm').addEventListener('submit',async e=>{e.preventDefault();const o=formObj(e.target);o.experience_years=null;const {error}=await sb.from('teachers').insert(o);if(error)return alert(error.message);closeModal('teacherModal');e.target.reset();loadAll()});
$('institutionForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.from('institutions').insert(formObj(e.target));if(error)return alert(error.message);closeModal('institutionModal');e.target.reset();loadAll()});
$('visitForm').addEventListener('submit',async e=>{e.preventDefault();const o=formObj(e.target);const {error}=await sb.from('visits').insert(o);if(error)return alert(error.message);closeModal('visitModal');e.target.reset();loadAll()});
$('seminarForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.from('seminars').insert(formObj(e.target));if(error)return alert(error.message);closeModal('seminarModal');e.target.reset();loadAll()});
$('dispatchForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await sb.from('dispatches').insert(formObj(e.target));if(error)return alert(error.message);closeModal('dispatchModal');e.target.reset();loadAll()});
$('teacherSearch').addEventListener('input',renderTeachers);
init();
