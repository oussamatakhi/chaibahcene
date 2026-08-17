/* نافذة التقرير: زر إغلاق سفلي واحد فقط، مع إبقاء زر × العلوي */
(function(){
'use strict';
function clean(){
 const modal=document.getElementById('reportModal'); if(!modal)return;
 const card=modal.querySelector('.modal-card'); if(!card)return;
 // احذف زر الإغلاق النصي الصغير داخل شريط إجراءات التقرير، لكن لا تمس زر الإغلاق السفلي.
 [...card.querySelectorAll('button')].forEach(b=>{
   const txt=(b.textContent||'').replace(/\s+/g,' ').trim();
   const isCloseText=txt==='إغلاق النافذة'||txt==='إغلاق';
   if(isCloseText && !b.classList.contains('mobile-modal-close')) b.remove();
 });
 const bottoms=[...card.querySelectorAll('.mobile-modal-close')];
 bottoms.slice(1).forEach(b=>b.remove());
 if(!bottoms.length){
   const b=document.createElement('button');
   b.type='button'; b.className='mobile-modal-close ghost'; b.textContent='إغلاق النافذة';
   b.addEventListener('click',()=>{modal.hidden=true;});
   card.appendChild(b);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean);else clean();
new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});
})();
