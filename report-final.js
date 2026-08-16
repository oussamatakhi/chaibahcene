(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));

  const baseOpenReport = window.__ministerialOpenReport || window.openReport;
  if (typeof baseOpenReport !== 'function') {
    console.error('Ministerial report handler was not found.');
    return;
  }

  // Fields that come from the teacher/institution database and must not be
  // manually entered by the inspector.
  const AUTO_FIELDS = [
    'institution', 'municipality', 'administrative_district',
    'school_year', 'last_name', 'first_name', 'birth_date_place',
    'first_appointment', 'framework', 'scale', 'grade', 'grade_seniority',
    'qualification', 'last_inspection', 'previous_score'
  ];

  const pick = (obj, ...keys) => {
    for (const key of keys) {
      const value = obj?.[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return '';
  };

  function academicYear() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    return m >= 9 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
  }

  function setField(form, name, value) {
    const el = form?.elements?.[name];
    if (!el) return;
    el.value = value == null ? '' : String(value);
    el.readOnly = true;
    el.classList.add('auto-filled');
    el.title = 'يُملأ آلياً من قاعدة بيانات الأستاذ';
  }

  function markAutoFields(form) {
    AUTO_FIELDS.forEach(name => {
      const el = form?.elements?.[name];
      if (!el) return;
      el.readOnly = true;
      el.classList.add('auto-filled');
      el.title = 'يُملأ آلياً من قاعدة بيانات الأستاذ';
      const label = el.closest('label');
      if (label && !label.querySelector('.auto-note')) {
        const note = document.createElement('small');
        note.className = 'auto-note';
        note.textContent = 'بيانات آلية من قاعدة البيانات';
        label.appendChild(note);
      }
    });
  }

  function fillFromDatabase(form, visit, teacher) {
    const institution = visit?.institutions || teacher?.institutions || {};

    setField(form, 'institution', pick(institution, 'name'));
    setField(form, 'municipality', pick(teacher, 'municipality') || pick(institution, 'municipality'));
    setField(form, 'administrative_district', pick(institution, 'administrative_district'));
    setField(form, 'school_year', academicYear());
    setField(form, 'last_name', pick(teacher, 'last_name'));
    setField(form, 'first_name', pick(teacher, 'first_name'));

    const birth = pick(teacher, 'birth_date_place') ||
      ([pick(teacher, 'birth_date'), pick(teacher, 'birth_place')].filter(Boolean).join(' / '));
    setField(form, 'birth_date_place', birth);

    setField(form, 'first_appointment', pick(teacher, 'appointment_date', 'first_appointment'));
    setField(form, 'framework', pick(teacher, 'rank', 'framework'));
    setField(form, 'scale', pick(teacher, 'scale'));
    setField(form, 'grade', pick(teacher, 'grade'));
    setField(form, 'grade_seniority', pick(teacher, 'grade_seniority'));
    setField(form, 'qualification', pick(teacher, 'qualification'));
    setField(form, 'last_inspection', pick(teacher, 'last_inspection_date', 'last_inspection'));
    setField(form, 'previous_score', pick(teacher, 'last_inspection_score', 'previous_score'));
  }

  function addAutoStyle() {
    if (document.getElementById('reportAutoFillStyle')) return;
    const style = document.createElement('style');
    style.id = 'reportAutoFillStyle';
    style.textContent = `
      #ministerialReportForm .auto-filled {
        background: #f1f5f9 !important;
        border-color: #94a3b8 !important;
        color: #334155 !important;
        cursor: not-allowed;
      }
      #ministerialReportForm .auto-note {
        display: block;
        margin-top: 3px;
        color: #64748b;
        font-size: 11px;
      }
    `;
    document.head.appendChild(style);
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

      addAutoStyle();
      fillFromDatabase(form, visit, teacher);
      markAutoFields(form);

      const modal = $('reportModal');
      if (modal) modal.hidden = false;
    } catch (e) {
      console.error('report-final:', e);
      alert('حدث خطأ أثناء فتح التقرير: ' + (e.message || e));
    }
  };

  console.log('Ministerial report handler ready — teacher data auto-filled.');
})();
