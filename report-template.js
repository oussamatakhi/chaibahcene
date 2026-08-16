(function(){
'use strict';

const DEFAULT_ADVICE='عمالا بالبرنامج السنوي للزيارات التربوي تم القيام بزيارة ميدانية للأستاذ {teacher} ومن خلال\n\nالملاحظة المباشرة للحصة تبين أن الأستاذ يظهر مستوى جيد من الجدية والإنضباط أثناء أداء مهامه\n\nمع إحترام التوجيهات المقدمة من طرفنا ولقد تم تسجيل حسن تسيير الحصة وفق مراحلها البيداغوجية\n\nوكما تم تسجيل حسن تسيير الفضاء وإحترام قواعد السلامة ،إضافة إلى ضبط المتعلمين وتوزيع الأدوار\n\nمما سمح باندماجهم في الأنشطة المقترحة .';
const DEFAULT_CONCLUSION='بناء على ما سبق نثمن هذا الأداء و نشجعه على تطوير الممارسات البيداغوجية بما\nيخدم جودة التعلمات.';

function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));}
function wordsInt(n){
  const u=['صفر','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة','أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر','عشرون'];
  n=Math.max(0,Math.min(20,Math.round(n)));
  return u[n];
}
function scoreWords(v){
  if(v===''||v==null||isNaN(Number(v))) return '';
  let n=Number(v); if(n<0||n>20)return '';
  if(Number.isInteger(n)) return wordsInt(n);
  const whole=Math.floor(n), frac=Math.round((n-whole)*100);
  if(frac===0)return wordsInt(whole);
  const f=String(frac).padStart(2,'0');
  return wordsInt(whole)+' فاصلة '+f.split('').map(Number).join('');
}
window.scoreToWords=scoreWords;

const fields=[
 ['institution','المؤسسة'],['municipality','البلدية'],['administrative_district','الدائرة'],['school_year','السنة الدراسية'],
 ['last_name','اللقب'],['first_name','الإسم'],['birth_date_place','تاريخ ومكان الميلاد'],['first_appointment','تاريخ أول تعيين'],['framework','الإطار'],
 ['scale','السلم'],['grade','الدرجة'],['grade_seniority','الأقدمية في الدرجة'],['qualification','المؤهل العلمي'],['last_inspection','تاريخ آخر تفتيش'],['previous_score','العلامة السابقة'],
 ['inspection_date','تاريخ التفتيش'],['lesson_duration','مدة الحصة'],['class_level','القسم'],['pupils_count','عدد التلاميذ'],['hall_listening','القاعة هل هي صالحة من حيث الاستماع'],['logical_sequence','هل تسلسلها منطقي'],['lesson_goals','هل حقق الدرس أهدافه'],['lighting','الإضاءة'],['cleanliness','النظافة'],['heating','التدفئة'],['ventilation','التهوية'],
 ['information_value','المعلومات، قيمتها'],['student_participation','مشاركة التلاميذ'],['lesson_type','نوع الدرس'],['lesson_topic','الموضوع'],['is_scheduled','هل هو مقرر'],
 ['program_distributed','هل هو موزع على السنة الدراسية'],['applications_exist','هل هناك تطبيقات عن الدرس'],['distribution_respected','هل التوزيع محترم'],['applications_suitable','هل هي مناسبة'],
 ['memo_exists','هل هي موجودة'],['memo_value','قيمتها'],['board','السبورة'],['book','الكتاب'],['other_aids','وسائل أخرى'],['textbook_record','دفتر النصوص: هل هو مستعمل حسب التوجيهات التربوية'],
 ['pupil_notebooks_monitored','دفاتر التلاميذ هل هي مراقبة'],['pupils_care','هل يعتني بها التلاميذ'],['general_assessment','التقدير العام'],['advice','النصائح والإرشادات'],['conclusion','الخالصة'],['ack_date','تاريخ الاطلاع'],['report_date','تاريخ تحرير التقرير']
];

function inputRow(name,label,type='text',extra=''){return `<label class="rt-field"><span>${label}</span><input name="${name}" type="${type}" ${extra}></label>`;}
function textareaRow(name,label,extra=''){return `<label class="rt-field rt-full"><span>${label}</span><textarea name="${name}" ${extra}></textarea></label>`;}
function buildModal(){
 const old=document.getElementById('reportModal'); if(!old)return;
 old.innerHTML=`<div class="modal-card report-entry-card"><button class="close" onclick="closeModal('reportModal')">×</button><div class="rt-entry-head"><h2>تقرير الزيارة التربوية</h2><p>النموذج الوزاري المعتمد — التربية البدنية والرياضية</p></div><form id="ministerialReportForm" class="rt-form"><input type="hidden" name="id"><input type="hidden" name="visit_id">
 <div class="rt-group"><h3>بيانات النموذج</h3><div class="rt-grid">${fields.slice(0,15).map(x=>inputRow(x[0],x[1])).join('')}</div></div>
 <div class="rt-group"><h3>ظروف التفتيش — إنجاز الدرس</h3><div class="rt-grid">${fields.slice(15,27).map(x=>inputRow(x[0],x[1])).join('')}</div></div>
 <div class="rt-group"><h3>تحضير الدرس والبرنامج والوسائل</h3><div class="rt-grid">${fields.slice(27,41).map(x=>inputRow(x[0],x[1])).join('')}</div></div>
 <div class="rt-group"><h3>التقرير التربوي والإرشادات</h3><div class="rt-grid">${inputRow('score','العلامة بالأرقام','number','min="0" max="20" step="0.01" id="rtScore"')} ${inputRow('score_in_words','العلامة بالحروف','text','id="rtScoreWords" readonly')} ${textareaRow('general_assessment','التقدير العام')} ${textareaRow('advice','النصائح والإرشادات')} ${textareaRow('conclusion','الخالصة')} ${inputRow('inspector_name','السيد المفتش','text','value="شعيب أحسن"')} ${inputRow('report_date','بتاريخ','date')} ${inputRow('ack_date','اطلع (ت) عليه المعني(ة) بالأمر بتاريخ','date')} ${inputRow('teacher_signature_name','اسم الأستاذ للتوقيع')} </div></div>
 <div class="report-actions"><button type="submit" class="primary">حفظ التقرير</button><button type="button" class="ghost" id="rtPrintBtn">طباعة التقرير</button></div></form></div>`;
 const form=document.getElementById('ministerialReportForm');
 form.querySelector('#rtScore').addEventListener('input',e=>{form.querySelector('#rtScoreWords').value=scoreWords(e.target.value);});
 form.addEventListener('submit',saveReport);
 form.querySelector('#rtPrintBtn').onclick=printMinisterialReport;
}
function val(form,n){return form.elements[n]?form.elements[n].value.trim():'';}
function setv(form,n,v){if(form.elements[n])form.elements[n].value=v==null?'':v;}

window.openReport=async function(visitId){
 buildModal();
 const v=window.cache?.visits?.find(x=>x.id===visitId); if(!v)return;
 const t=window.cache?.teachers?.find(x=>x.id===v.teacher_id);
 const form=document.getElementById('ministerialReportForm');
 form.reset();setv(form,'id','');setv(form,'visit_id',visitId);
 setv(form,'institution',v.institutions?.name||'');setv(form,'municipality',t?.municipality||v.institutions?.municipality||'');setv(form,'administrative_district',v.institutions?.administrative_district||'');
 setv(form,'last_name',t?.last_name||'');setv(form,'first_name',t?.first_name||'');setv(form,'first_appointment',t?.appointment_date||'');setv(form,'framework',t?.rank||'');setv(form,'grade',t?.grade||'');setv(form,'last_inspection',t?.last_inspection_date||'');setv(form,'previous_score',t?.last_inspection_score||'');setv(form,'inspection_date',v.scheduled_date||'');setv(form,'class_level','');setv(form,'pupils_count','');setv(form,'lesson_topic','');setv(form,'inspector_name','شعيب أحسن');setv(form,'teacher_signature_name',t?`${t.last_name} ${t.first_name}`:'');
 setv(form,'advice',DEFAULT_ADVICE.replace('{teacher}',t?`${t.last_name} ${t.first_name}`:'....................'));setv(form,'conclusion',DEFAULT_CONCLUSION);setv(form,'general_assessment','');
 const {data,error}=await window.sb.from('visit_reports').select('*').eq('visit_id',visitId).maybeSingle();
 if(error) console.warn(error);
 if(data){
   setv(form,'id',data.id);setv(form,'visit_id',visitId);
   Object.entries(data.template_data||{}).forEach(([k,v])=>setv(form,k,v));
   if(data.score!=null)setv(form,'score',data.score);
   if(data.score_in_words)setv(form,'score_in_words',data.score_in_words); else setv(form,'score_in_words',scoreWords(data.score));
   if(data.inspection_date)setv(form,'inspection_date',data.inspection_date);
   if(data.inspector_name)setv(form,'inspector_name',data.inspector_name);
   if(data.teacher_signature_name)setv(form,'teacher_signature_name',data.teacher_signature_name);
 } else {setv(form,'score_in_words',scoreWords(val(form,'score')));}
 openModal('reportModal');
};

async function saveReport(e){
 e.preventDefault();const form=e.target;const o={};fields.forEach(([n])=>o[n]=val(form,n));
 const score=o.score===''?null:Number(o.score);o.score_in_words=scoreWords(score);setv(form,'score_in_words',o.score_in_words);
 const id=val(form,'id'),visitId=val(form,'visit_id');
 const payload={visit_id:visitId,inspection_date:o.inspection_date||null,inspector_name:o.inspector_name||'شعيب أحسن',teacher_rank:o.framework||null,teacher_grade:o.grade||null,appointment_date:o.first_appointment||null,previous_inspection_date:o.last_inspection||null,previous_score:o.previous_score===''?null:Number(o.previous_score),lesson_subject:'التربية البدنية والرياضية',lesson_topic:o.lesson_topic||null,lesson_type:o.lesson_type||null,class_level:o.class_level||null,pupils_count:o.pupils_count===''?null:Number(o.pupils_count),lesson_execution:o.logical_sequence||null,preparation:o.memo_value||null,pupils_participation:o.student_participation||null,program_application:o.program_distributed||null,lesson_plan:o.memo_exists||null,teaching_aids:o.other_aids||null,text_book:o.book||null,pupils_work_monitoring:o.pupil_notebooks_monitored||null,strengths:'',recommendations:o.advice||null,conclusion:o.conclusion||null,general_assessment:o.general_assessment||null,score,score_in_words:o.score_in_words||null,inspector_signature_name:o.inspector_name||'شعيب أحسن',teacher_signature_name:o.teacher_signature_name||null,report_status:'معتمد',template_data:o};
 const r=id?await window.sb.from('visit_reports').update(payload).eq('id',id):await window.sb.from('visit_reports').insert(payload);
 if(r.error){alert('تعذر حفظ التقرير: '+r.error.message);return;}
 await window.sb.from('visits').update({status:'منجزة'}).eq('id',visitId);
 const v=window.cache?.visits?.find(x=>x.id===visitId);if(v?.teacher_id)await window.sb.from('teachers').update({last_inspection_date:o.inspection_date||null,last_inspection_score:score}).eq('id',v.teacher_id);
 alert('تم حفظ التقرير بنجاح.');
}

function reportPrintHTML(form){
 const v=window.cache?.visits?.find(x=>x.id===val(form,'visit_id'));const t=window.cache?.teachers?.find(x=>x.id===v?.teacher_id);
 const V=n=>esc(val(form,n));
 const fixedAdvice=V('advice')||DEFAULT_ADVICE.replace('{teacher}',t?`${t.last_name} ${t.first_name}`:'....................');
 const fixedConclusion=V('conclusion')||DEFAULT_CONCLUSION;
 return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>التقرير التربوي</title><style>
 @page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#111;font-family:'Sakkal Majalla','Sakkal Majalla Regular',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:210mm;height:297mm;position:relative;padding:8mm 8mm 7mm;overflow:hidden;page-break-after:always}.page:last-child{page-break-after:auto}.minister-head{height:43mm;position:relative;font-size:16px;font-weight:700;line-height:1.25}.gov{position:absolute;top:0;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;font-size:16px}.gov div+div{margin-top:2px}.right-head{position:absolute;top:16mm;right:0;width:82mm;text-align:right;line-height:1.45}.left-head{position:absolute;top:16mm;left:0;width:78mm;text-align:left;direction:rtl;line-height:1.45}.title-box{position:absolute;top:36mm;left:50%;transform:translateX(-50%);width:94mm;height:21mm;background:#d9d9d9;border:1.2px solid #111;box-shadow:4px 4px 0 #111;text-align:center;padding-top:3mm;font-size:19px;line-height:1.2}.info{height:45mm;font-size:15px;line-height:1.45}.line{display:flex;justify-content:space-between;gap:8mm;margin-bottom:1.5mm}.line>div{flex:1;white-space:nowrap}.label{font-weight:700}.value{display:inline-block;min-width:22mm;border-bottom:1px dotted #111;padding:0 1mm;text-align:center}.value.long{min-width:45mm}.two-col{display:grid;grid-template-columns:1fr 1fr;border-top:1.2px solid #111;border-bottom:0;height:164mm;font-size:14px}.col{padding:4mm 6mm}.col:first-child{border-right:1.2px solid #111;direction:rtl}.col h3{text-align:right;text-decoration:underline;margin:0 0 4mm;font-size:17px}.item{margin-bottom:3mm;line-height:1.55}.item .dots{display:inline-block;border-bottom:1px dotted #111;min-width:35mm;min-height:5mm}.item .wide{min-width:60mm}.section-title{font-weight:700;text-decoration:underline;margin-top:4mm}.page2-title{width:78mm;height:14mm;margin:0 auto 6mm;background:#d9d9d9;border:1.2px solid #111;box-shadow:4px 4px 0 #111;text-align:center;font-size:20px;padding-top:1.5mm}.advice-box{border:1px solid #777;height:141mm;padding:10mm 12mm;font-size:18px;line-height:2.05}.advice-box h3{margin:0 0 5mm;font-size:18px;text-decoration:underline}.advice-text{white-space:pre-line}.conclusion{font-weight:700;margin-top:3mm}.sign-area{border-top:1.4px solid #111;margin-top:12mm;padding-top:4mm;height:52mm;position:relative;font-size:16px}.sign-title{text-align:center;font-weight:700;margin-bottom:2mm}.sign-col{position:absolute;top:12mm;width:45%;line-height:1.7}.sign-right{right:0}.sign-left{left:0;border-left:1px solid #111;padding-left:7mm}.sig{margin-top:8mm;text-decoration:underline;font-weight:700}.num{font-weight:700}.small{font-size:14px}
 </style></head><body>
 <div class="page"><div class="minister-head"><div class="gov"><div>الجمهورية الجزائرية الديمقراطية الشعبية</div><div>وزارة التربية الوطنية</div></div><div class="right-head">مديرية التربية لولاية الأغواط<br>مفتشية التعليم الابتدائي<br>المقاطعة: الثانية</div><div class="left-head">المؤسسة : <span class="value long">${V('institution')}</span><br>البلدية : <span class="value">${V('municipality')}</span><br>الدائرة : <span class="value">${V('administrative_district')}</span></div><div class="title-box">التقرير التربوي<br>لأستاذ التعليم الابتدائي</div></div>
 <div class="info"><div class="line"><div><span class="label">المادة :</span> التربية البدنية والرياضية</div><div><span class="label">السنة الدراسية :</span> <span class="value">${V('school_year')}</span></div></div><div class="line"><div><span class="label">اللقب والإسم :</span> <span class="value long">${V('last_name')} ${V('first_name')}</span></div><div><span class="label">الجنسية :</span> جزائرية</div></div><div class="line"><div><span class="label">تاريخ ومكان الميلاد :</span> <span class="value long">${V('birth_date_place')}</span></div><div><span class="label">تاريخ أول تعيين :</span> <span class="value">${V('first_appointment')}</span></div><div><span class="label">الإطار :</span> <span class="value">${V('framework')}</span></div></div><div class="line"><div><span class="label">السلم والدرجة :</span> <span class="value">${V('scale')}</span></div><div><span class="label">الدرجة :</span> <span class="value">${V('grade')}</span></div><div><span class="label">الأقدمية في الدرجة :</span> <span class="value">${V('grade_seniority')}</span></div></div><div class="line"><div><span class="label">المؤهل العلمي :</span> <span class="value long">${V('qualification')}</span></div><div><span class="label">تاريخ آخر تفتيش :</span> <span class="value">${V('last_inspection')}</span></div><div><span class="label">العلامة :</span> <span class="value">${V('previous_score')}</span></div></div></div>
 <div class="two-col"><div class="col"><h3>إنجاز الدرس</h3><div class="item"><b>المعلومات، قيمتها :</b> <span class="dots wide">${V('information_value')}</span></div><div class="item"><b>هل تسلسلها منطقي ؟</b> <span class="dots">${V('logical_sequence')}</span></div><div class="item"><b>هل حقق الدرس أهدافه ؟</b> <span class="dots">${V('lesson_goals')}</span></div><div class="section-title">مشاركة التلاميذ:</div><div class="item"><span class="dots wide">${V('student_participation')}</span></div><div class="section-title">التطبيقات:</div><div class="item"><b>هل هناك تطبيقات عن الدرس ؟</b> <span class="dots">${V('applications_exist')}</span></div><div class="item"><b>هل هي مناسبة ؟</b> <span class="dots">${V('applications_suitable')}</span></div><div class="section-title">الوسائل التعليمية</div><div class="item"><b>السبورة :</b> <span class="dots">${V('board')}</span></div><div class="item"><b>الكتاب :</b> <span class="dots">${V('book')}</span></div><div class="item"><b>وسائل أخرى :</b> <span class="dots">${V('other_aids')}</span></div><div class="section-title">مراقبة أعمال التلاميذ :</div><div class="item"><b>دفاتر التلاميذ هل هي مراقبة ؟</b> <span class="dots">${V('pupil_notebooks_monitored')}</span></div><div class="item"><b>هل يعتني بها التلاميذ ؟</b> <span class="dots">${V('pupils_care')}</span></div></div>
 <div class="col"><h3>ظروف التفتيش:</h3><div class="item"><b>تاريخ التفتيش :</b> <span class="dots">${V('inspection_date')}</span> <b>مدة الحصة :</b> <span class="dots">${V('lesson_duration')}</span></div><div class="item"><b>القسم :</b> <span class="dots">${V('class_level')}</span> <b>عدد التلاميذ :</b> <span class="dots">${V('pupils_count')}</span></div><div class="item"><b>القاعة هل هي صالحة من حيث الاستماع ؟</b> <span class="dots wide">${V('hall_listening')}</span></div><div class="item"><b>الإضاءة ؟</b> <span class="dots">${V('lighting')}</span> <b>النظافة ؟</b> <span class="dots">${V('cleanliness')}</span></div><div class="item"><b>التدفئة ؟</b> <span class="dots">${V('heating')}</span> <b>التهوية ؟</b> <span class="dots">${V('ventilation')}</span></div><div class="section-title">تحضير الدرس:</div><div class="item"><b>نوع الدرس :</b> <span class="dots wide">${V('lesson_type')}</span></div><div class="item"><b>الموضوع :</b> <span class="dots wide">${V('lesson_topic')}</span></div><div class="item"><b>هل هو مقرر ؟</b> <span class="dots">${V('is_scheduled')}</span></div><div class="section-title">البرنامج :</div><div class="item"><b>هل هو موزع على السنة الدراسية ؟</b> <span class="dots">${V('program_distributed')}</span></div><div class="item"><b>هل التوزيع محترم ؟</b> <span class="dots wide">${V('distribution_respected')}</span></div><div class="section-title">المذكرة:</div><div class="item"><b>هل هي موجودة ؟</b> <span class="dots">${V('memo_exists')}</span></div><div class="item"><b>قيمتها :</b> <span class="dots wide">${V('memo_value')}</span></div><div class="section-title">دفتر النصوص:</div><div class="item"><b>هل هو مستعمل حسب التوجيهات التربوية ؟</b> <span class="dots wide">${V('textbook_record')}</span></div></div></div></div>
 <div class="page"><div class="page2-title">الإرشادات التربوية</div><div class="advice-box"><h3>النصائح و الإرشادات :</h3><div class="advice-text">${esc(fixedAdvice)}</div><div class="conclusion"><b>الخالصة :</b><br>${esc(fixedConclusion)}</div></div><div class="sign-area"><div class="sign-title">التقدير العام بعد حضور الدرس والاطلاع على الملف الإداري ومناقشة الأستاذ (ة)</div><div class="sign-col sign-right">العلامة بالحروف : <b>${V('score_in_words')}</b><br>بالأرقام / <b class="num">${V('score')}</b><br>اطلع (ت) عليه المعني(ة) بالأمر بتاريخ : ${V('ack_date')}<div class="sig">الإمضاء</div></div><div class="sign-col sign-left">تقرير حرره مفتش مادة التربية البدنية و الرياضية<br>السيد المفتش: <b>${V('inspector_name')||'شعيب أحسن'}</b> بتاريخ : ${V('report_date')}<div class="sig">الإمضاء</div></div></div></div>
 </body></html>`;
}
window.printMinisterialReport=function(){const form=document.getElementById('ministerialReportForm');if(!form)return;const w=window.open('','_blank');if(!w)return;w.document.open();w.document.write(reportPrintHTML(form));w.document.close();setTimeout(()=>w.print(),500);};

buildModal();
})();