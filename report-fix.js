(function(){
 const EXACT='بناء على ما سبق نثمن هذا الأداء و نشجعه على تطوير المماراسات البيداغوجية بما\nيخدم جودة التعلمات.';
 const oldOpenReport=window.openReport;
 window.openReport=async function(id){await oldOpenReport(id);const f=document.getElementById('ministerialReportForm');if(f&&f.elements.conclusion){const current=f.elements.conclusion.value.trim();if(!current||current.includes('الممارسات البيداغوجية'))f.elements.conclusion.value=EXACT;}};
 const oldPrint=window.printMinisterialReport;
 window.printMinisterialReport=function(){
   const realOpen=window.open;
   window.open=function(){
     const w=realOpen.apply(window,arguments); if(!w)return w;
     const realWrite=w.document.write.bind(w.document);
     w.document.write=function(html){return realWrite(html.replaceAll('الخالصة','الخلاصة'));};
     return w;
   };
   try{return oldPrint();}finally{window.open=realOpen;}
 };
 const s=document.createElement('script');
 s.src='report-v3.js?v=20260817-3';
 s.onload=()=>console.log('Ministerial report v3 loaded');
 s.onerror=()=>console.error('تعذر تحميل report-v3.js');
 document.head.appendChild(s);
})();
