(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const fmtDate = v => v ? new Date(v + 'T00:00:00').toLocaleDateString('ar-DZ') : '—';

  const baseOpenReport = window.__ministerialOpenReport || window.openReport;
  if (typeof baseOpenReport !== 'function') {
    console.error('Ministerial report handler was not found.');
    return;
  }

  window.openReport = async function (visitId) {
    try {
      const client = window.supabase?.createClient && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY
        ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY)
        : null;
      if (!client) throw new Error('تعذر الاتصال بقاعدة البيانات.');

      const { data: visit, error: visitError } = await client
        .from('visits')
        .select('*,institutions(name,municipality,administrative_district)')
        .eq('id', visitId)
        .maybeSingle();
      if (visitError) throw visitError;
      if (!visit) {
        alert('تعذر العثور على بيانات الزيارة.');
        return;
      }

      let teacher = null;
      if (visit.teacher_id) {
        const { data, error } = await client
          .from('teachers')
          .select('*,institutions(name,municipality,administrative_district)')
          .eq('id', visit.teacher_id)
          .maybeSingle();
        if (error) throw error;
        teacher = data;
      }

      // report-template.js relies on these globals. app-fix.js keeps them private,
      // so provide the exact visit/teacher context required by the ministerial form.
      window.sb = client;
      window.cache = {
        teachers: teacher ? [teacher] : [],
        institutions: visit.institutions ? [visit.institutions] : [],
        visits: [visit],
        seminars: [],
        dispatches: []
      };

      await baseOpenReport(visitId);

      const form = $('ministerialReportForm');
      if (!form) {
        alert('تعذر تحميل نموذج التقرير الوزاري.');
        return;
      }

      // Ensure the title/context is visible even if another handler modified the modal.
      const modal = $('reportModal');
      if (modal) modal.hidden = false;

    } catch (e) {
      console.error('report-final:', e);
      alert('حدث خطأ أثناء فتح التقرير: ' + (e.message || e));
    }
  };

  console.log('Ministerial report handler ready.');
})();
