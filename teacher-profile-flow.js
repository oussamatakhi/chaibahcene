/* تنظيم عرض الأستاذ: الاسم = المعلومات الشخصية، زر «الملف» = الزيارات والسجل */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const fmt=v=>v?new Date(v+'T00:00:00').toLocaleDateString('ar-DZ'):'—';
  window.viewTeacherInfo=function(id){
    const t=(window.cache?.teachers||[]).find(x=>x.id===id); if(!t)return;
    $('teacherProfile').innerHTML=`
      <div class="profile-head"><div class="profile-avatar">${esc((t.last_name||'').charAt(0))}</div>
      <div><h2>${esc((t.last_name||'')+' '+(t.first_name||''))}</h2>
      <p>${esc(t.rank||'أستاذ التربية البدنية والرياضية')} — ${esc(t.institutions?.name||'دون مؤسسة')}</p>
      <span class="badge">${esc(t.employee_number||'—')}</span></div></div>
      <div class="profile-actions"><button class="primary" onclick="editTeacher('${id}');closeModal('teacherProfileModal')">تعديل الملف</button></div>
      <div class="profile-grid">
      <div><span>اللقب</span><b>${esc(t.last_name||'—')}</b></div><div><span>الاسم</span><b>${esc(t.first_name||'—')}</b></div>
      <div><span>رقم الموظف</span><b>${esc(t.employee_number||'—')}</b></div><div><span>الرتبة</span><b>${esc(t.rank||'—')}</b></div>
      <div><span>الدرجة</span><b>${esc(t.grade||'—')}</b></div><div><span>المؤسسة</span><b>${esc(t.institutions?.name||'—')}</b></div>
      <div><span>المقاطعة الإدارية</span><b>${esc(t.institutions?.administrative_district||'—')}</b></div>
      <div><span>البلدية</span><b>${esc(t.municipality||t.institutions?.municipality||'—')}</b></div>
      <div><span>تاريخ الميلاد</span><b>${fmt(t.birth_date)}</b></div><div><span>مكان الميلاد</span><b>${esc(t.birth_place||'—')}</b></div>
      <div><span>تاريخ التعيين</span><b>${fmt(t.appointment_date)}</b></div><div><span>الهاتف</span><b>${esc(t.phone||'—')}</b></div>
      <div><span>البريد الإلكتروني</span><b>${esc(t.email||'—')}</b></div><div><span>الجنسية</span><b>${esc(t.nationality||'—')}</b></div>
      <div><span>الإطار</span><b>${esc(t.framework||'—')}</b></div><div><span>السلم</span><b>${esc(t.scale||'—')}</b></div>
      <div><span>أقدمية الدرجة</span><b>${esc(t.grade_seniority||'—')}</b></div><div><span>المؤهل</span><b>${esc(t.qualification||'—')}</b></div>
      </div><div class="panel profile-panel"><h3>ملاحظات</h3><div>${esc(t.notes||'لا توجد ملاحظات.')}</div></div>`;
    openModal('teacherProfileModal');
  };
  window.viewTeacherFile=function(id){
    const t=(window.cache?.teachers||[]).find(x=>x.id===id); if(!t)return;
    const vs=(window.cache?.visits||[]).filter(v=>v.teacher_id===id).sort((a,b)=>String(b.scheduled_date||'').localeCompare(String(a.scheduled_date||'')));
    const box=$('teacherFileContent'); if(!box)return;
    box.innerHTML=`<div class="profile-head"><div class="profile-avatar">${esc((t.last_name||'').charAt(0))}</div><div><h2>ملف الأستاذ: ${esc((t.last_name||'')+' '+(t.first_name||''))}</h2><p>${esc(t.institutions?.name||'دون مؤسسة')}</p></div></div>
      <div class="profile-actions"><button class="primary" onclick="openVisitForTeacher('${id}');closeModal('teacherFileModal')">+ برمجة زيارة</button><button class="ghost" onclick="viewTeacherInfo('${id}');closeModal('teacherFileModal')">معلومات الأستاذ</button></div>
      <div class="panel profile-panel"><h3>سجل الزيارات (${vs.length})</h3>${vs.length?`<div class="table-wrap"><table><thead><tr><th>التاريخ</th><th>النوع</th><th>المؤسسة</th><th>المكان</th><th>الحالة</th><th>التقرير</th></tr></thead><tbody>${vs.map(v=>`<tr><td>${fmt(v.scheduled_date)}</td><td>${esc(v.visit_type||'—')}</td><td>${esc(v.institutions?.name||t.institutions?.name||'—')}</td><td>${esc(v.field_location||'الملعب / الفضاء الرياضي')}</td><td>${esc(v.status||'مجدولة')}</td><td><button class="small-btn" onclick="openReport('${v.id}')">التقرير</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">لا توجد زيارات مسجلة لهذا الأستاذ.</div>'}</div>`;
    openModal('teacherFileModal');
  };
})();
