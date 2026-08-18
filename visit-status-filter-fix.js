(()=>{'use strict';
function fixVisitStatusFilter(){
 const candidates=[document.querySelector('#visitStatus'),document.querySelector('[name="status"]')].filter(Boolean);
 candidates.forEach(sel=>{
  [...sel.options].forEach(o=>{
   if(o.value==='مجدولة'||o.textContent.trim()==='مجدولة'){o.value='مبرمجة';o.textContent='مبرمجة';}
  });
  if(sel.dataset.statusFilterFixed)return;
  sel.dataset.statusFilterFixed='1';
  sel.addEventListener('change',()=>{
   const value=sel.value;
   if(typeof window.renderVisitsFiltered==='function') window.renderVisitsFiltered({status:value});
   else if(typeof window.applyVisitFilters==='function') window.applyVisitFilters();
  });
 });
}
window.fixVisitStatusFilter=fixVisitStatusFilter;
document.addEventListener('DOMContentLoaded',fixVisitStatusFilter);
setTimeout(fixVisitStatusFilter,500);
})();