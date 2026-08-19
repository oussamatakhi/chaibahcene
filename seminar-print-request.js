(()=>{'use strict';
const C=()=>window.__APP_SUPABASE_CLIENT||window.supabaseClient||window.sb;
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const currentYear=()=>new Date().getFullYear();
const todayText=()=>new Intl.DateTimeFormat('ar-DZ',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());
const D=v=>v?new Intl.DateTimeFormat('ar-DZ',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v+'T00:00:00')):'.........................................';
async function printSeminarRequest(id){
 const c=C();
 if(!c)return alert('تعذر الاتصال بقاعدة البيانات.');
 const[sr,ar]=await Promise.all([
  c.from('seminars').select('*').eq('id',id).single(),
  c.from('seminar_attendance').select('teacher_id,teachers(first_name,last_name,institutions(name))').eq('seminar_id',id).order('teacher_id')
 ]);
 if(sr.error)return alert('تعذر تحميل بيانات الندوة: '+sr.error.message);
 if(ar.error)return alert('تعذر تحميل قائمة الأساتذة المعنيين: '+ar.error.message);
 const s=sr.data||{};
 const rows=(ar.data||[]).map((x,i)=>`<tr><td>${i+1}</td><td>${E((x.teachers?.last_name||'')+' '+(x.teachers?.first_name||''))}</td><td>${E(x.teachers?.institutions?.name||'—')}</td></tr>`).join('');
 const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>طلب برمجة ندوة تكوينية</title><style>
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;color:#000;font-family:'Sakkal Majalla','Sakkal Majalla Regular',serif;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.request-page{width:210mm;min-height:297mm;padding:13mm 18mm 12mm;position:relative;page-break-after:always}
.header-top{text-align:center;font-size:21px;line-height:1.08;margin:0 0 8mm}
.header-top div{margin:0}
.header-columns{display:grid;grid-template-columns:1fr 1fr;direction:ltr;font-size:19px;line-height:1.18;min-height:32mm}
.header-columns .column{direction:rtl}
.header-columns .right{text-align:right}
.header-columns .left{text-align:left}
.header-columns .line{margin:0 0 1.5mm}
.subject-block{margin-top:4mm;text-align:right;font-size:20px;line-height:1.25}
.subject-block .line{margin:0 0 1.5mm}
.body-block{margin-top:10mm;font-size:20px;line-height:1.55;text-align:right}
.body-block .intro{text-align:justify;text-justify:inter-word;margin:0 0 6mm;line-height:1.65}
.data-line{margin:0 0 2mm;white-space:normal}
.closing{text-align:center;font-size:20px;margin-top:13mm;line-height:1.3}
.signature{position:absolute;left:18mm;right:18mm;bottom:25mm;font-size:19px;line-height:1.35;text-align:left;direction:ltr}
.signature .date,.signature .inspector{direction:rtl;text-align:left}
.signature .date{margin-bottom:10mm}
.signature .name{margin-top:1mm}
.attachment{width:210mm;min-height:297mm;padding:13mm 17mm 14mm;page-break-before:always}
.attachment-head{text-align:center;font-size:18px;line-height:1.15;margin-bottom:7mm}
.attachment h2{text-align:center;font-size:25px;margin:0 0 2mm}
.attachment .seminar-title{text-align:center;font-size:19px;margin-bottom:6mm}
.attachment-note{text-align:right;font-size:18px;margin-bottom:4mm}
.attachment table{width:100%;border-collapse:collapse;font-size:18px;direction:rtl}
.attachment thead{display:table-header-group}
.attachment tr{page-break-inside:avoid}
.attachment th,.attachment td{border:1.2px solid #000;padding:3mm 2.5mm;text-align:center;line-height:1.1}
.attachment th{font-size:19px;background:#f4f4f4}
.attachment th:first-child,.attachment td:first-child{width:18mm}
.attachment th:nth-child(2),.attachment td:nth-child(2){width:78mm}
.empty{text-align:center;font-size:18px;padding:8mm}
@media print{html,body{background:#fff}.request-page{page-break-after:always}.attachment{page-break-before:always}}
</style></head><body>
<section class="request-page">
 <div class="header-top"><div>الجمهورية الجزائرية الديمقراطية الشعبية</div><div>وزارة التربية الوطنية</div></div>
 <div class="header-columns">
  <div class="column right">
   <div class="line">مديرية التربية لولاية الأغواط</div>
   <div class="line">مفتشية التعليم الابتدائي</div>
   <div class="line">مادة : التربية البدنية و الرياضية المقاطعة الثانية</div>
   <div class="line">ارسال رقم: &nbsp;&nbsp;&nbsp;/م.ت.إ/${currentYear()}</div>
  </div>
  <div class="column left">
   <div class="line">الى السيد: مدير التربية لولاية الأغواط</div>
   <div class="line">مكتب التكوين و التفتيش</div>
  </div>
 </div>
 <div class="subject-block">
  <div class="line">الموضوع : طلب برمجة ندوة تكوينية</div>
  <div class="line">المرفقات : قائمة الأساتذة المعنيين</div>
 </div>
 <div class="body-block">
  <div class="intro">في إطار البرنامج المسطر فيم يخص تكوين الأساتذة، يشرفني أن نطلب منكم برمجة ندوة بالمعلومات التالية</div>
  <div class="data-line">عنوان الندوة : ${E(s.title||'...............................................................')}</div>
  <div class="data-line">تاريخ الندوة : ${D(s.seminar_date)}</div>
  <div class="data-line">المكان : ${E(s.location||'...............................................................')}</div>
  <div class="data-line">المؤطرون : ${E(s.facilitators||'...............................................................')}</div>
 </div>
 <div class="closing">تقبلوا سيدي عبارات الاحترام والتقدير</div>
 <div class="signature">
  <div class="date">الأغواط في : ${todayText()}</div>
  <div class="inspector">السيد : مفتش المادة<div class="name">أحسن شعيب</div></div>
 </div>
</section>
<section class="attachment">
 <div class="attachment-head"><div>الجمهورية الجزائرية الديمقراطية الشعبية</div><div>وزارة التربية الوطنية</div><div>مديرية التربية لولاية الأغواط</div><div>مفتشية التعليم الابتدائي — مادة : التربية البدنية و الرياضية — المقاطعة الثانية</div></div>
 <h2>قائمة الأساتذة المعنيين</h2>
 <div class="seminar-title">الندوة : ${E(s.title||'—')}</div>
 <div class="attachment-note">المرفقات : قائمة الأساتذة المعنيين</div>
 <table><thead><tr><th>الرقم</th><th>الاسم واللقب</th><th>مؤسسة العمل</th></tr></thead><tbody>${rows||'<tr><td colspan="3" class="empty">لا توجد قائمة أساتذة مرتبطة بهذه الندوة.</td></tr>'}</tbody></table>
</section>
</body></html>`;
 const w=window.open('','_blank','width=900,height=800');
 if(!w)return alert('يرجى السماح بالنوافذ المنبثقة لطباعة الطلب.');
 w.document.open();w.document.write(html);w.document.close();w.focus();setTimeout(()=>w.print(),500);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-print-seminar]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();printSeminarRequest(b.getAttribute('data-print-seminar'))},true);
window.printSeminarRequest=printSeminarRequest;
})();