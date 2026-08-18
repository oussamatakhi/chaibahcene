(()=>{'use strict';
function setupSafeStatusFilter(){
 const root=document.querySelector('#visits'); if(!root)return;
 root.querySelectorAll('select').forEach(sel=>{
  const hasProgrammed=[...sel.options].some(o=>o.textContent.trim()==='مبرمجة'||o.value==='مبرمجة'||o.value==='مجدولة');
  if(!hasProgrammed||sel.dataset.safeStatusFilter)return;
  sel.dataset.safeStatusFilter='1';
  [...sel.options].forEach(o=>{if(o.textContent.trim()==='مجدولة'||o.value==='مجدولة'){o.textContent='مبرمجة';o.value='مبرمجة';}});
  sel.addEventListener('change',()=>{
   const value=String(sel.value||'').trim();
   const table=root.querySelector('#visitsTable table');
   if(!table)return;
   table.querySelectorAll('tbody tr').forEach(row=>{
    const cells=row.querySelectorAll('td');
    const statusCell=cells[cells.length-2];
    const status=String(statusCell?.textContent||'').trim();
    const show=!value||value==='الكل'||(value==='مبرمجة'&&(status==='مبرمجة'||status==='مجدولة'))||status===value;
    row.hidden=!show;
   });
  });
 });
}
window.fixVisitStatusFilter=setupSafeStatusFilter;
new MutationObserver(setupSafeStatusFilter).observe(document.body,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupSafeStatusFilter,{once:true});else setupSafeStatusFilter();
})();