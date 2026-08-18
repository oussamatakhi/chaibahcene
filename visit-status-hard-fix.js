(()=>{'use strict';
function hardFix(){
 const root=document.querySelector('#visits'); if(!root)return;
 const selects=[...root.querySelectorAll('select')].filter(s=>s.id!=='visitTeacher'&&s.id!=='visitInstitution'&&s.id!=='visitType');
 selects.forEach(s=>{
   const opt=[...s.options].find(o=>o.textContent.trim()==='مبرمجة'||o.value==='مجدولة');
   if(!opt)return;
   opt.textContent='مبرمجة'; opt.value='مبرمجة';
   if(s.dataset.hardStatusBound)return;
   s.dataset.hardStatusBound='1';
   s.onchange=(e)=>{
     e.stopImmediatePropagation();
     const value=e.target.value;
     const table=root.querySelector('#visitsTable');
     const rows=table?.querySelectorAll('tbody tr')||[];
     rows.forEach(tr=>{
       const statusCell=tr.cells?.[5];
       if(!statusCell)return;
       const status=statusCell.textContent.trim();
       tr.hidden=!!value && value!=='الكل' && status!==value;
     });
   };
 });
}
window.hardFixVisitStatus=hardFix;
setTimeout(hardFix,1000);document.addEventListener('DOMContentLoaded',hardFix);
})();