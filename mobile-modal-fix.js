/* تحسين النوافذ المنبثقة على الهاتف */
(function(){
  function setup(){
    document.querySelectorAll('.modal').forEach(function(modal){
      if(modal.dataset.mobileCloseReady==='1') return;
      const card=modal.querySelector('.modal-card');
      if(!card) return;
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='mobile-modal-close ghost';
      btn.textContent='إغلاق النافذة';
      btn.addEventListener('click',function(){
        modal.hidden=true;
      });
      card.appendChild(btn);
      modal.dataset.mobileCloseReady='1';
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup); else setup();
  new MutationObserver(setup).observe(document.body,{childList:true,subtree:true});
})();
