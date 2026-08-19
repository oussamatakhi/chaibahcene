(() => {
  'use strict';
  const API = 'https://qaimjtdiyatouqsqfthb.supabase.co/functions/v1/teacher-registration?v=3';
  const days = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس'];
  const slots = [['08:00','09:00'],['09:00','10:00'],['10:00','11:00'],['11:00','12:00'],['12:00','13:00'],['13:00','14:00'],['14:00','15:00'],['15:00','16:00'],['16:00','17:00']];
  const scheduleEl = document.getElementById('schedule');
  const form = document.getElementById('registrationForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');

  function buildSchedule() {
    scheduleEl.innerHTML = days.map((day, dayIndex) => `<section class="day"><h3>${day}</h3><div class="slots">${slots.map(([start,end]) => `<div class="slot"><div class="time">${start} – ${end}</div><input data-day="${dayIndex}" data-start="${start}" data-end="${end}" placeholder="القسم (مثال: 3AP)"></div>`).join('')}</div></section>`).join('');
  }

  async function loadInstitutions() {
    const select = document.getElementById('institution_id');
    try {
      const r = await fetch(API);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'تعذر تحميل المؤسسات');
      select.innerHTML = '<option value="">اختر المؤسسة</option>' + (data.institutions || []).map(i => `<option value="${i.id}">${escapeHtml(i.name)}${i.municipality ? ' — ' + escapeHtml(i.municipality) : ''}</option>`).join('');
    } catch (e) {
      select.innerHTML = '<option value="">تعذر تحميل المؤسسات</option>';
      showError(e.message);
    }
  }

  function escapeHtml(v) { return String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function showError(msg) { status.className = 'err'; status.textContent = msg; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className=''; status.textContent=''; submitBtn.disabled=true; submitBtn.textContent='جارٍ مطابقة الأستاذ وحفظ البيانات...';
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    delete payload.employee_number;
    payload.schedule = [...scheduleEl.querySelectorAll('input[data-day]')].filter(i => i.value.trim()).map(i => ({day_of_week:Number(i.dataset.day),start_time:i.dataset.start,end_time:i.dataset.end,section:i.value.trim()}));
    try {
      const r = await fetch(API, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'تعذر حفظ الاستمارة');
      if (data.ambiguous_match) {
        showError('تعذر تحديد الأستاذ بشكل آمن: توجد أكثر من مطابقة. تم حفظ الطلب للمراجعة ولم يتم إنشاء سجل أستاذ مكرر.');
        submitBtn.disabled=false; submitBtn.textContent='إرسال الاستمارة';
        return;
      }
      form.innerHTML = `<div class="result"><div>تم حفظ بيانات الأستاذ وربطها بسجله في قاعدة البيانات بنجاح.</div><strong>رقم الطلب: ${escapeHtml(data.request_number)}</strong><p>${data.matched_existing_teacher ? 'تم التعرف على الأستاذ الموجود مسبقاً باستعمال الاسم واللقب والمؤسسة، ولم يتم إنشاء سجل مكرر.' : 'لم يوجد سجل مطابق، لذلك تم إنشاء سجل الأستاذ وربط طلب التسجيل به.'}</p></div>`;
    } catch (err) {
      showError(err.message);
      submitBtn.disabled=false; submitBtn.textContent='إرسال الاستمارة';
    }
  });

  buildSchedule();
  loadInstitutions();
})();