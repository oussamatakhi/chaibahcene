(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const fmtDate = v => v ? new Date(v+'T00:00:00').toLocaleDateString('ar-DZ') : '—';

  window.openReport = async function(visitId) {
    try {
      const visits = window.__inspectorCache?.visits || null;
      const cache = window.cache || null;
      const list = visits || cache?.visits || [];
      const v = list.find(x => String(x.id) === String(visitId));
      if (!v) { alert('تعذر العثور على بيانات الزيارة. أعد تحميل الصفحة ثم حاول مرة أخرى.'); return; }

      const teachers = window.__inspectorCache?.teachers || cache?.teachers || [];
      const t = teachers.find(x => String(x.id) === String(v.teacher_id)) || v.teachers || {};
      const modal = $('reportModal');
      const form = $('reportForm');
      if (!modal || !form) { alert('واجهة التقرير غير محملة. أعد تحميل الصفحة بـ Ctrl + F5.'); return; }

      form.reset();
      $('reportId').value = '';
      $('reportVisitId').value = visitId;
      if ($('reportInspectionDate')) $('reportInspectionDate').value = v.scheduled_date || new Date().toISOString().slice(0,10);
      if ($('reportTeacherRank')) $('reportTeacherRank').value = t.rank || '';
      if ($('reportTeacherGrade')) $('reportTeacherGrade').value = t.grade || '';
      if ($('reportAppointmentDate')) $('reportAppointmentDate').value = t.appointment_date || '';
      if ($('reportTeacherSignature')) $('reportTeacherSignature').value = t.last_name ? `${t.last_name} ${t.first_name || ''}` : '';
      if ($('reportHeader')) $('reportHeader').innerHTML = `<div class="report-title"><h2>تقرير الزيارة التربوية</h2><p>${esc(t.last_name || '')} ${esc(t.first_name || '')}</p><span>${esc(v.institutions?.name || '')} | ${esc(v.field_location || 'الملعب / الفضاء الرياضي')} | ${fmtDate(v.scheduled_date)}</span></div>`;

      // افتح التقرير فوراً، ولا تنتظر استعلام قاعدة البيانات.
      modal.hidden = false;

      // تحميل التقرير السابق إن وجد، دون منع فتح النموذج عند وجود خطأ في الاستعلام.
      try {
        const client = window.supabase?.createClient && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY
          ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY) : null;
        if (client) {
          const { data } = await client.from('visit_reports').select('*').eq('visit_id', visitId).maybeSingle();
          if (data) {
            Object.entries(data).forEach(([k,val]) => {
              const el = form.querySelector(`[name="${k}"]`);
              if (el && val !== null) el.value = val;
            });
            $('reportId').value = data.id || '';
            $('reportVisitId').value = visitId;
          }
        }
      } catch (e) { console.warn('تعذر تحميل التقرير السابق، تم فتح النموذج رغم ذلك:', e); }
    } catch (e) {
      console.error('openReport hotfix:', e);
      alert('حدث خطأ أثناء فتح التقرير: ' + e.message);
    }
  };

  // إصلاح الكاش المحلي: app-fix يستخدم متغيراً محلياً، لذلك نلتقط البيانات من DOM عند الحاجة.
  document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if ((btn.textContent || '').trim() === 'التقرير') {
      const m = (btn.getAttribute('onclick') || '').match(/openReport\(['\"]([^'\"]+)['\"]\)/);
      if (m) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.openReport(m[1]);
      }
    }
  }, true);
})();
