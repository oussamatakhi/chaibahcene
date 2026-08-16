(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const fmtDate = v => v ? new Date(v+'T00:00:00').toLocaleDateString('ar-DZ') : '—';
  const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);

  window.openReport = async function(visitId) {
    const modal = $('reportModal'), form = $('reportForm');
    if (!modal || !form) { alert('واجهة التقرير غير محملة. أعد تحميل الصفحة بـ Ctrl + F5.'); return; }

    // افتح النافذة أولاً حتى لا يتوقف الزر بسبب استعلام قاعدة البيانات.
    modal.hidden = false;
    if ($('reportHeader')) $('reportHeader').innerHTML = '<div class="report-title"><h2>تقرير الزيارة التربوية</h2><span>جارٍ تحميل بيانات الزيارة...</span></div>';

    try {
      const { data: v, error: ve } = await client.from('visits').select('*,teachers(first_name,last_name,rank,grade,appointment_date),institutions(name,municipality,administrative_district)').eq('id', visitId).maybeSingle();
      if (ve) throw ve;
      if (!v) throw new Error('لم يتم العثور على الزيارة.');
      const t = v.teachers || {};

      form.reset();
      $('reportId').value = '';
      $('reportVisitId').value = visitId;
      if ($('reportInspectionDate')) $('reportInspectionDate').value = v.scheduled_date || new Date().toISOString().slice(0,10);
      if ($('reportTeacherRank')) $('reportTeacherRank').value = t.rank || '';
      if ($('reportTeacherGrade')) $('reportTeacherGrade').value = t.grade || '';
      if ($('reportAppointmentDate')) $('reportAppointmentDate').value = t.appointment_date || '';
      if ($('reportTeacherSignature')) $('reportTeacherSignature').value = t.last_name ? `${t.last_name} ${t.first_name || ''}` : '';
      if ($('reportHeader')) $('reportHeader').innerHTML = `<div class="report-title"><h2>تقرير الزيارة التربوية</h2><p>${esc(t.last_name || '')} ${esc(t.first_name || '')}</p><span>${esc(v.institutions?.name || '')} | ${esc(v.field_location || 'الملعب / الفضاء الرياضي')} | ${fmtDate(v.scheduled_date)}</span></div>`;

      const { data } = await client.from('visit_reports').select('*').eq('visit_id', visitId).maybeSingle();
      if (data) {
        Object.entries(data).forEach(([k,val]) => {
          const el = form.querySelector(`[name="${k}"]`);
          if (el && val !== null) el.value = val;
        });
        $('reportId').value = data.id || '';
        $('reportVisitId').value = visitId;
      }
    } catch (e) {
      console.error('openReport:', e);
      if ($('reportHeader')) $('reportHeader').innerHTML = `<div class="report-title"><h2>تقرير الزيارة التربوية</h2><p style="color:#b91c1c">تعذر تحميل بعض بيانات الزيارة: ${esc(e.message)}</p></div>`;
    }
  };

  // منع أي onclick قديم من تعطيل زر التقرير، واعتماد الدالة الجديدة.
  document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || (btn.textContent || '').trim() !== 'التقرير') return;
    const m = (btn.getAttribute('onclick') || '').match(/openReport\(['\"]([^'\"]+)['\"]\)/);
    if (!m) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.openReport(m[1]);
  }, true);
})();
