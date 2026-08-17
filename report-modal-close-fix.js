/* إصلاح نافذة التقرير - بدون مراقبة مستمرة للـ DOM */
(function(){
'use strict';
function clean(){
 const modal=document.getElementById('reportModal'); if(!modal)return;
 const card=modal.querySelector('.modal-card'); if(!card)return;
 [...card.querySelectorAll('button')].forEach(function(b){
   const txt=(b.textContent||'').replace(/\s+/g,' ').trim();
   if((txt==='إغلاق النافذة'||txt==='إغلاق') && !b.classList.contains('mobile-modal-close')) b.remove();
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
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});else clean();
})();
