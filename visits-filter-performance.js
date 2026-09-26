(()=>{'use strict';
// تم تعطيل إعادة رسم جدول الزيارات من هذا الملف حتى لا يتعارض مع app-v2.js.
// يبقى هذا الملف مسؤولاً فقط عن تسجيل وجود الفلاتر دون تغيير محتوى الجدول.
window.renderVisitsFiltered=()=>{if(typeof window.renderVisits==='function')window.renderVisits()};
})();