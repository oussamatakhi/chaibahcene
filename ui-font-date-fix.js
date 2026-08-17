(()=>{'use strict';
function fix(){document.documentElement.style.setProperty('--app-font','Cairo');document.body.style.fontFamily="'Cairo',Tahoma,Arial,sans-serif";document.querySelectorAll('input[type="date"]').forEach(el=>{el.removeAttribute('dir');el.removeAttribute('lang');el.removeAttribute('inputmode');el.style.removeProperty('direction');el.style.removeProperty('text-align');el.style.removeProperty('unicode-bidi');el.removeAttribute('readonly');el.removeAttribute('disabled');});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
new MutationObserver(fix).observe(document.documentElement,{subtree:true,childList:true});
})();