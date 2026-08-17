(function(){
  'use strict';

  function addBottomCloseButtons(){
    document.querySelectorAll('.modal .modal-card').forEach(function(card){
      if(card.querySelector('.modal-close-bottom')) return;

      var modal = card.closest('.modal');
      if(!modal || !modal.id) return;

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'modal-close-bottom ghost';
      button.textContent = 'إغلاق النافذة';
      button.setAttribute('aria-label','إغلاق النافذة');
      button.addEventListener('click', function(){
        if(typeof window.closeModal === 'function'){
          window.closeModal(modal.id);
        } else {
          modal.hidden = true;
        }
      });

      card.appendChild(button);
    });
  }

  function install(){
    addBottomCloseButtons();

    var observer = new MutationObserver(function(){
      addBottomCloseButtons();
    });
    observer.observe(document.body, {subtree:true, childList:true});
  }

  var style = document.createElement('style');
  style.textContent = `
    .modal-close-bottom{
      display:block;
      width:100%;
      margin-top:18px;
      padding:11px 16px;
      text-align:center;
      font-family:inherit;
      font-weight:700;
      cursor:pointer;
    }
    .modal-close-bottom:hover{background:#f8fafc}
    .modal-close-bottom:focus{outline:2px solid #94a3b8;outline-offset:2px}
  `;
  document.head.appendChild(style);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
