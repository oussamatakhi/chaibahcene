/* إصلاح تكرار زر إغلاق نافذة التقرير */
(function(){
  'use strict';
  function cleanReportCloseButtons(){
    const modal=document.getElementById('reportModal');
    if(!modal) return;
    const card=modal.querySelector('.modal-card');
    if(!card) return;
    const buttons=Array.from(card.querySelectorAll('button')).filter(btn=>
      (btn.textContent||'').replace(/\s+/g,' ').trim()==='إغلاق النافذة'
    );
    // نحتفظ بزر واحد فقط في أسفل نافذة التقرير.
    buttons.slice(1).forEach(btn=>btn.remove());
    if(buttons.length===0){
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='mobile-modal-close ghost';
      btn.textContent='إغلاق النافذة';
      btn.addEventListener('click',()=>{modal.hidden=true;});
      card.appendChild(btn);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cleanReportCloseButtons);
  else cleanReportCloseButtons();
  new MutationObserver(cleanReportCloseButtons).observe(document.body,{childList:true,subtree:true});
})();
