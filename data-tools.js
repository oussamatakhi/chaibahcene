(() => {
  'use strict';
  const sb = window.supabase?.createClient?.(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
  if (!sb) return;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  let XLSX = null;

  function loadXLSX(){
    return new Promise((resolve,reject)=>{
      if(window.XLSX){XLSX=window.XLSX;return resolve(XLSX);}
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload=()=>{XLSX=window.XLSX;resolve(XLSX)};
      s.onerror=()=>reject(new Error('تعذر تحميل أداة Excel.'));
      document.head.appendChild(s);
    });
  }

  function addFieldAfter(id, html){
    const el=$(id); if(!el || document.getElementById(id+'Extra')) return;
    const wrap=document.createElement('div'); wrap.innerHTML=html; const node=wrap.firstElementChild; node.id=id+'Extra';
    el.closest('label')?.insertAdjacentElement('afterend', node);
  }

  function enhanceTeacherForm(){
    addFieldAfter('teacherGrade', '<label>السلم<input name="scale" id="teacherScale"></label>');
    addFieldAfter('teacherScale', '<label>الأقدمية في الدرجة<input name="grade_seniority" id="teacherGradeSeniority"></label>');
    addFieldAfter('teacherGradeSeniority', '<label>الإطار<input name="framework" id="teacherFramework"></label>');
    addFieldAfter('teacherFramework', '<label>تاريخ ومكان الميلاد<input name="birth_date_place" id="teacherBirthDatePlace"></label>');
    addFieldAfter('teacherBirthDatePlace', '<label>المؤهل العلمي<input name="qualification" id="teacherQualification"></label>');
    addFieldAfter('teacherQualification', '<label>الجنسية<input name="nationality" id="teacherNationality" value="جزائرية"></label>');
    addFieldAfter('teacherNationality', '<label>المادة<input name="subject" id="teacherSubject" value="التربية البدنية والرياضية"></label>');
  }

  function setExtraTeacherFields(t){
    [['teacherScale',t?.scale],['teacherGradeSeniority',t?.grade_seniority],['teacherFramework',t?.framework],['teacherBirthDatePlace',t?.birth_date_place],['teacherQualification',t?.qualification],['teacherNationality',t?.nationality||'جزائرية'],['teacherSubject',t?.subject||'التربية البدنية والرياضية']].forEach(([id,v])=>{if($(id))$(id).value=v||''});
  }

  function teacherFormValues(){
    const f=$('teacherForm'); const fd=new FormData(f); const o=Object.fromEntries(fd.entries());
    o.subject=o.subject||'التربية البدنية والرياضية'; o.nationality=o.nationality||'جزائرية';
    return o;
  }

  async function nextEmployeeNumber(){
    const {data,error}=await sb.from('teachers').select('employee_number');
    if(error) throw error;
    let max=0; (data||[]).forEach(r=>{const n=parseInt(String(r.employee_number||'').replace(/\D/g,''),10);if(Number.isFinite(n))max=Math.max(max,n)});
    return String(max+1).padStart(3,'0');
  }

  function attachTeacherSave(){
    const form=$('teacherForm'); if(!form || form.dataset.extraSave==='1') return;
    form.dataset.extraSave='1';
    form.addEventListener('submit', async e=>{
      // Capture phase is used so the old handler does not create a second conflicting save.
    }, true);
    form.addEventListener('submit', async e=>{
      e.preventDefault(); e.stopImmediatePropagation();
      const btn=form.querySelector('button[type=submit]'); if(btn){btn.disabled=true;btn.textContent='جارٍ الحفظ...'}
      try{
        const o=teacherFormValues();
        if(!o.last_name || !o.first_name || !o.institution_id) throw new Error('يرجى إدخال اللقب والاسم واختيار المؤسسة.');
        const id=o.id||''; delete o.id;
        if(!id) o.employee_number=await nextEmployeeNumber();
        else delete o.employee_number;
        const payload={first_name:o.first_name,last_name:o.last_name,employee_number:o.employee_number,rank:o.rank||null,subject:o.subject||null,institution_id:o.institution_id,municipality:o.municipality||null,appointment_date:o.appointment_date||null,grade:o.grade||null,experience_years:o.experience_years?Number(o.experience_years):null,phone:o.phone||null,email:o.email||null,notes:o.notes||null,birth_date_place:o.birth_date_place||null,nationality:o.nationality||'جزائرية',framework:o.framework||null,scale:o.scale||null,grade_seniority:o.grade_seniority||null,qualification:o.qualification||null};
        let r=id?await sb.from('teachers').update(payload).eq('id',id):await sb.from('teachers').insert(payload);
        if(r.error) throw r.error;
        alert(id?'تم تحديث ملف الأستاذ بنجاح.':'تمت إضافة الأستاذ بنجاح.');
        if(window.closeModal)window.closeModal('teacherModal');
        location.reload();
      }catch(err){alert('تعذر حفظ ملف الأستاذ: '+(err.message||err));}
      finally{if(btn){btn.disabled=false;btn.textContent='حفظ'}}
    }, false);
  }

  async function downloadTemplate(type){
    try{
      const x=await loadXLSX();
      const teacherCols=['اللقب','الاسم','الرتبة','الدرجة','السلم','الأقدمية في الدرجة','الإطار','تاريخ ومكان الميلاد','المؤهل العلمي','تاريخ أول تعيين','المؤسسة','البلدية','الجنسية','المادة','الهاتف','البريد الإلكتروني','ملاحظات'];
      const instCols=['اسم المؤسسة','نوع المؤسسة','البلدية','المقاطعة الإدارية','العنوان','اسم المدير','الهاتف','البريد الإلكتروني','ملاحظات'];
      const cols=type==='teachers'?teacherCols:instCols;
      const ws=x.utils.aoa_to_sheet([cols]); ws['!cols']=cols.map(()=>({wch:22}));
      const guide=type==='teachers'?
        [['تعليمات استيراد الأساتذة'],['املأ ورقة البيانات ثم احفظ الملف بصيغة XLSX.'],['رقم الموظف لا يُكتب في الملف؛ المنصة تنشئه آلياً.'],['يجب أن يطابق اسم المؤسسة الاسم المسجل في المنصة.'],['يمكن ترك الهاتف والبريد والملاحظات فارغة.']]:
        [['تعليمات استيراد المؤسسات'],['املأ ورقة البيانات ثم احفظ الملف بصيغة XLSX.'],['اسم المؤسسة حقل إلزامي.'],['نوع المؤسسة: ابتدائية / متوسطة / ثانوية.'],['المقاطعة الإدارية والبلدية تستعملان كما هما في السجلات الرسمية.']];
      const wg=x.utils.aoa_to_sheet(guide); wg['!cols']=[{wch:80}];
      const wb=x.utils.book_new();x.utils.book_append_sheet(wb,ws,'البيانات');x.utils.book_append_sheet(wb,wg,'تعليمات');
      x.writeFile(wb,type==='teachers'?'نموذج_استيراد_الاساتذة.xlsx':'نموذج_استيراد_المؤسسات.xlsx');
    }catch(e){alert(e.message||e)}
  }

  function normalize(v){return String(v??'').trim().replace(/\s+/g,' ').toLowerCase();}
  function excelDate(v){
    if(v instanceof Date) return v.toISOString().slice(0,10);
    if(typeof v==='number' && XLSX?.SSF) {const d=XLSX.SSF.parse_date_code(v);if(d)return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;}
    const s=String(v??'').trim(); if(!s)return null;
    const m=s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/); if(m)return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
    return s;
  }

  async function importInstitutions(file){
    const x=await loadXLSX(), wb=x.read(await file.arrayBuffer(),{type:'array'}), ws=wb.Sheets['البيانات']||wb.Sheets[wb.SheetNames[0]], rows=x.utils.sheet_to_json(ws,{defval:''});
    if(!rows.length)throw new Error('الملف لا يحتوي على بيانات.');
    const {data:existing,error}=await sb.from('institutions').select('*');if(error)throw error;
    let added=0,updated=0,skipped=0;
    for(const r of rows){const name=String(r['اسم المؤسسة']||'').trim();if(!name){skipped++;continue} const found=(existing||[]).find(x=>normalize(x.name)===normalize(name)); const payload={name,institution_type:String(r['نوع المؤسسة']||'ابتدائية').trim()||'ابتدائية',municipality:String(r['البلدية']||'').trim()||null,administrative_district:String(r['المقاطعة الإدارية']||'').trim()||null,address:String(r['العنوان']||'').trim()||null,director_name:String(r['اسم المدير']||'').trim()||null,phone:String(r['الهاتف']||'').trim()||null,email:String(r['البريد الإلكتروني']||'').trim()||null,notes:String(r['ملاحظات']||'').trim()||null};
      const q=found?await sb.from('institutions').update(payload).eq('id',found.id):await sb.from('institutions').insert(payload); if(q.error)throw q.error; found?updated++:added++;
    }
    alert(`تم الاستيراد بنجاح.\nمضافة: ${added}\nمحدثة: ${updated}\nمتجاهلة: ${skipped}`);location.reload();
  }

  async function importTeachers(file){
    const x=await loadXLSX(), wb=x.read(await file.arrayBuffer(),{type:'array'}), ws=wb.Sheets['البيانات']||wb.Sheets[wb.SheetNames[0]], rows=x.utils.sheet_to_json(ws,{defval:''});
    if(!rows.length)throw new Error('الملف لا يحتوي على بيانات.');
    const [{data:teachers,error:te},{data:institutions,error:ie}]=await Promise.all([sb.from('teachers').select('*'),sb.from('institutions').select('*')]);if(te)throw te;if(ie)throw ie;
    let added=0,updated=0,skipped=0,missing=[];
    for(const r of rows){const last=String(r['اللقب']||'').trim(),first=String(r['الاسم']||'').trim(),iname=String(r['المؤسسة']||'').trim();if(!last||!first||!iname){skipped++;continue}
      const inst=(institutions||[]).find(x=>normalize(x.name)===normalize(iname));if(!inst){missing.push(`${last} ${first} ← ${iname}`);continue}
      const payload={last_name:last,first_name:first,rank:String(r['الرتبة']||'').trim()||null,grade:String(r['الدرجة']||'').trim()||null,scale:String(r['السلم']||'').trim()||null,grade_seniority:String(r['الأقدمية في الدرجة']||'').trim()||null,framework:String(r['الإطار']||'').trim()||null,birth_date_place:String(r['تاريخ ومكان الميلاد']||'').trim()||null,qualification:String(r['المؤهل العلمي']||'').trim()||null,appointment_date:excelDate(r['تاريخ أول تعيين']),institution_id:inst.id,municipality:String(r['البلدية']||inst.municipality||'').trim()||null,nationality:String(r['الجنسية']||'جزائرية').trim()||'جزائرية',subject:String(r['المادة']||'التربية البدنية والرياضية').trim()||'التربية البدنية والرياضية',phone:String(r['الهاتف']||'').trim()||null,email:String(r['البريد الإلكتروني']||'').trim()||null,notes:String(r['ملاحظات']||'').trim()||null};
      const found=(teachers||[]).find(x=>normalize(x.first_name)===normalize(first)&&normalize(x.last_name)===normalize(last)&&x.institution_id===inst.id);
      if(found){const q=await sb.from('teachers').update(payload).eq('id',found.id);if(q.error)throw q.error;updated++;}
      else {payload.employee_number=await nextEmployeeNumber();const q=await sb.from('teachers').insert(payload);if(q.error)throw q.error;teachers.push(payload);added++;}
    }
    let msg=`تم الاستيراد بنجاح.\nمضافة: ${added}\nمحدثة: ${updated}\nمتجاهلة: ${skipped}`;if(missing.length)msg+=`\n\nمؤسسات غير موجودة (${missing.length}):\n`+missing.slice(0,15).join('\n')+(missing.length>15?'\n...':'');alert(msg);location.reload();
  }

  function addImportUI(){
    const tHead=document.querySelector('#teachers .page-head');
    if(tHead && !document.getElementById('teacherImportBtn')){
      const box=document.createElement('div');box.className='head-actions';box.style.display='flex';box.style.gap='8px';box.innerHTML='<button class="ghost" id="teacherTemplateBtn">تحميل نموذج Excel</button><button class="ghost" id="teacherImportBtn">استيراد Excel</button><input id="teacherExcel" type="file" accept=".xlsx,.xls" hidden>';
      tHead.appendChild(box);$('teacherTemplateBtn').onclick=()=>downloadTemplate('teachers');$('teacherImportBtn').onclick=()=>$('teacherExcel').click();$('teacherExcel').onchange=e=>{const f=e.target.files?.[0];if(f)importTeachers(f).catch(err=>alert('فشل استيراد الأساتذة: '+(err.message||err)))};
    }
    const iHead=document.querySelector('#institutions .page-head');
    if(iHead && !document.getElementById('institutionImportBtn')){
      const box=document.createElement('div');box.className='head-actions';box.style.display='flex';box.style.gap='8px';box.innerHTML='<button class="ghost" id="institutionTemplateBtn">تحميل نموذج Excel</button><button class="ghost" id="institutionImportBtn">استيراد Excel</button><input id="institutionExcel" type="file" accept=".xlsx,.xls" hidden>';
      iHead.appendChild(box);$('institutionTemplateBtn').onclick=()=>downloadTemplate('institutions');$('institutionImportBtn').onclick=()=>$('institutionExcel').click();$('institutionExcel').onchange=e=>{const f=e.target.files?.[0];if(f)importInstitutions(f).catch(err=>alert('فشل استيراد المؤسسات: '+(err.message||err)))};
    }
  }

  function patchReportText(){
    const modal=$('reportModal'); if(!modal)return;
    modal.querySelectorAll('span,h2,h3,p,label,button').forEach(el=>{if(el.textContent){el.textContent=el.textContent.replaceAll('الإسم','الاسم').replaceAll('الخالصة','الخلاصة').replaceAll('العالمة','العلامة').replaceAll('مراقبة اعمال التلاميذ','مراقبة أعمال التلاميذ').replaceAll('الزيارات التربوي','الزيارات التربوية');}});
  }
  function patchOpenReport(){
    const base=window.openReport;if(typeof base!=='function'||base.__dataEnhanced)return;
    const wrapped=async function(id){await base(id);enhanceTeacherForm();patchReportText();const v=window.cache?.visits?.find?.(x=>x.id===id);const t=window.cache?.teachers?.find?.(x=>x.id===v?.teacher_id);const f=$('ministerialReportForm');if(f&&t){[['birth_date_place',t.birth_date_place],['framework',t.framework||t.rank],['scale',t.scale],['grade_seniority',t.grade_seniority],['qualification',t.qualification]].forEach(([n,v])=>{if(f.elements[n])f.elements[n].value=v||''});if(f.elements['last_name'])f.elements['last_name'].readOnly=true;if(f.elements['first_name'])f.elements['first_name'].readOnly=true;if(f.elements['institution'])f.elements['institution'].readOnly=true;if(f.elements['municipality'])f.elements['municipality'].readOnly=true;if(f.elements['administrative_district'])f.elements['administrative_district'].readOnly=true;if(f.elements['first_appointment'])f.elements['first_appointment'].readOnly=true;if(f.elements['framework'])f.elements['framework'].readOnly=true;if(f.elements['scale'])f.elements['scale'].readOnly=true;if(f.elements['grade'])f.elements['grade'].readOnly=true;if(f.elements['grade_seniority'])f.elements['grade_seniority'].readOnly=true;if(f.elements['qualification'])f.elements['qualification'].readOnly=true;if(f.elements['birth_date_place'])f.elements['birth_date_place'].readOnly=true;}};
    wrapped.__dataEnhanced=true;window.openReport=wrapped;
  }
  function init(){enhanceTeacherForm();attachTeacherSave();addImportUI();patchOpenReport();setInterval(()=>{enhanceTeacherForm();attachTeacherSave();addImportUI();patchOpenReport();patchReportText()},1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
