/* إصلاح مركزي للنوافذ المنبثقة */
(function(){
  'use strict';
  function show(id){
    const el=document.getElementById(id); if(!el)return false;
    el.hidden=false; el.removeAttribute('hidden'); el.style.display='grid';
    document.body.classList.add('modal-open'); return true;
  }
  function hide(id){
    const el=document.getElementById(id); if(!el)return false;
    el.hidden=true; el.setAttribute('hidden',''); el.style.display='none';
    if(!document.querySelector('.modal:not([hidden])'))document.body.classList.remove('modal-open'); return true;
  }
  window.openModal=show; window.closeModal=hide;
  window.openNewTeacherModal=function(){if(typeof window.resetTeacherForm==='function')window.resetTeacherForm();return show('teacherModal')};
  window.openNewVisitModal=function(){if(typeof window.resetVisitForm==='function')window.resetVisitForm();return show('visitModal')};
  function bind(){document.addEventListener('click',function(e){const close=e.target.closest('.modal .close,.modal .mobile-modal-close');if(close){const modal=close.closest('.modal');if(modal)hide(modal.id);return}if(e.target.classList.contains('modal'))hide(e.target.id)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  if(!document.querySelector('script[data-institution-edit-fix]')){const s=document.createElement('script');s.src='institution-edit-fix.js?v=20260817-1';s.dataset.institutionEditFix='1';document.head.appendChild(s)}
})();
