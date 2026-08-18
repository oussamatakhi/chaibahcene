(()=>{'use strict';
function fix(){
 document.querySelectorAll('button,input[type="button"],input[type="submit"],input[type="reset"],.btn,.primary,.secondary,.ghost,.small-btn,.link-btn,.nav,.close,.mobile-menu-btn,.filter-btn,.clear-filters').forEach(e=>e.style.fontFamily="'Cairo',sans-serif");
 document.querySelectorAll('select option').forEach(o=>{if(o.textContent.trim()==='مجدولة')o.textContent='مبرمجة'});
}
window.fixGlobalUI=fix;
document.addEventListener('DOMContentLoaded',fix,{once:true});
setTimeout(fix,500);
})();