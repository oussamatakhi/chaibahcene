(()=>{'use strict';
function resetDateInputs(root=document){root.querySelectorAll('input[type="date"]').forEach(el=>{el.removeAttribute('dir');el.removeAttribute('lang');el.style.removeProperty('direction');el.style.removeProperty('text-align');el.style.removeProperty('unicode-bidi');el.removeAttribute('inputmode');el.removeAttribute('readonly');el.removeAttribute('disabled');});}
function init(){resetDateInputs();new MutationObserver(()=>resetDateInputs()).observe(document.body,{subtree:true,childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();