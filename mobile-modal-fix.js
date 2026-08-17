/* تحسين النوافذ المنبثقة على الهاتف - نسخة مستقرة بدون مراقبة مستمرة للـ DOM */
(function(){
  'use strict';
  function setup(){
    document.querySelectorAll('.modal').forEach(function(modal){
      const card=modal.querySelector('.modal-card');
      if(!card) return;
      const closeButtons=Array.from(card.querySelectorAll('.mobile-modal-close'));
      closeButtons.slice(1).forEach(function(btn){btn.remove();});
      if(!card.querySelector('.mobile-modal-close')){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='mobile-modal-close ghost';
        btn.textContent='إغلاق النافذة';
        btn.addEventListener('click',function(){modal.hidden=true;});
        card.appendChild(btn);
      }
    });
    document.querySelectorAll('#teachersTable .actions .small-btn').forEach(function(btn){
      if(btn.textContent.trim()==='الملف') btn.textContent='سجل';
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
  new MutationObserver(setup).observe(document.body,{childList:true,subtree:true});
})();
