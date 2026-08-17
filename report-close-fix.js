/* إصلاح خاص بنافذة التقرير: إزالة زر الإغلاق الصغير بجانب الطباعة، والإبقاء على الزر السفلي */
(function(){
  'use strict';
  function clean(){
    const modal=document.getElementById('reportModal');
    if(!modal) return;
    const card=modal.querySelector('.modal-card');
    if(!card) return;
    // أي زر إغلاق صغير أُضيف بجانب أزرار التقرير يُحذف.
    card.querySelectorAll('button').forEach(function(btn){
      if(btn.classList.contains('close')) return;
      const text=(btn.textContent||'').trim();
      const isSmallClose=text==='إغلاق النافذة' || text==='إغلاق' || btn.getAttribute('aria-label')==='إغلاق النافذة';
      if(isSmallClose && !btn.classList.contains('mobile-modal-close')) btn.remove();
    });
    // توحيد أزرار الإغلاق السفلية إلى زر واحد فقط.
    const bottoms=Array.from(card.querySelectorAll('.mobile-modal-close'));
    bottoms.slice(1).forEach(function(b){b.remove();});
    if(!bottoms.length){
      const b=document.createElement('button');
      b.type='button'; b.className='mobile-modal-close ghost'; b.textContent='إغلاق النافذة';
      b.addEventListener('click',function(){modal.hidden=true;});
      card.appendChild(b);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',clean); else clean();
  new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});
})();
