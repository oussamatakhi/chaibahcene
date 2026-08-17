(()=>{'use strict';
const $=id=>document.getElementById(id);
function documentsInit(){
 const section=$('documents'); if(!section||section.dataset.ready==='1')return;
 section.dataset.ready='1';
 const panel=section.querySelector('.panel'); if(!panel)return;
 panel.innerHTML=`<div class="documents-box">
 <div class="documents-toolbar"><div><h3>الوثائق والأرشيف</h3><p>إدارة الوثائق المرجعية للمفتش والوصول إليها بسهولة.</p></div><label class="primary doc-upload-label">+ رفع وثيقة<input id="documentFile" type="file" hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"></label></div>
 <div class="documents-note">يمكنك رفع الوثائق المرجعية مثل المناشير، التعليمات، المذكرات، النصوص التنظيمية والوثائق التربوية. سيتم تفعيل التخزين السحابي عند ربط Storage.</div>
 <div id="documentsList" class="documents-list"><div class="empty">لا توجد وثائق مضافة بعد.</div></div></div>`;
 const f=$('documentFile'); if(f)f.addEventListener('change',()=>{if(f.files?.length){alert('تم اختيار الملف «'+f.files[0].name+'». ربط الرفع الفعلي بالتخزين السحابي سيكون في المرحلة التالية.');f.value=''}});
}
const oldShow=window.showApp; if(oldShow){window.showApp=function(){oldShow();setTimeout(documentsInit,0)}}
document.addEventListener('DOMContentLoaded',documentsInit);
new MutationObserver(()=>{if($('documents')&&!$('documents').hidden)documentsInit()}).observe(document.body,{childList:true,subtree:true});
})();
