# منصة مفتش المادة

نسخة أولية قابلة للنشر كـ PWA لإدارة عمل مفتش مادة التربية البدنية والرياضية.

## قبل التشغيل
افتح `config.js` وضع **Publishable key** لمشروع Supabase:
`https://qaimjtdiyatouqsqfthb.supabase.co`

لا تستخدم Service Role Key داخل المتصفح.

## قاعدة البيانات
تم إنشاء الجداول في مشروع Supabase وتشمل:
- institutions
- teachers
- visits
- visit_reports
- seminars
- seminar_attendance
- dispatches
- dispatch_items
- documents

## تسجيل الدخول
أنشئ حساب المفتش من Supabase Authentication ثم استخدم البريد وكلمة المرور في الصفحة.

## النشر المجاني
يمكن رفع الملفات إلى GitHub Pages. بعد تفعيل Pages سيكون الموقع متاحاً برابط دائم من GitHub.

## ملاحظة
هذه نسخة MVP. الخطوة التالية هي استكمال:
1. نموذج التقرير التربوي بالتفصيل وفق النموذج الرسمي المرفوع.
2. توليد PDF.
3. إدارة الوثائق وSupabase Storage.
4. التقويم الشهري للزيارات.
5. تحسين الصلاحيات وإعدادات المفتش.
