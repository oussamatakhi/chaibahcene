(()=>{'use strict';
function hideExcelButtons(){
  const ids=['teacherTemplateBtn','teacherImportBtn','institutionTemplateBtn','institutionImportBtn','teacherExcel','institutionExcel'];
  ids.forEach(id=>{const e=document.getElementById(id);if(e){if(e.tagName==='INPUT')e.remove();else e.remove()}});
  document.querySelectorAll('#teachers .page-head button,#institutions .page-head button').forEach(btn=>{
    const text=(btn.textContent||'').trim().replace(/\s+/g,' ');
    if(/استيراد\s*Excel|تحميل\s*نموذج\s*Excel/i.test(text))btn.remove();
  });
}
window.hideExcelButtons=hideExcelButtons;
hideExcelButtons();
const observer=new MutationObserver(hideExcelButtons);
observer.observe(document.body,{childList:true,subtree:true});
})();
