(function(){
'use strict';

// تصحيح نهائي لنصوص قالب التقرير الوزاري.
// يعمل على النص الظاهر في الواجهة وعلى HTML التقرير قبل الطباعة.
const FINAL_CORRECTIONS = [
  ['اإلرشادات','الإرشادات'],
  ['ااإلرشادات','الإرشادات'],
  ['االطلاع','الاطلاع'],
  ['اإطلاع','الاطلاع'],
  ['االإداري','الإداري'],
  ['اإلداري','الإداري'],
  ['ااإلداري','الإداري'],
  ['األستاذ (ة)','الأستاذ(ة)'],
  ['الأستاذ (ة)','الأستاذ(ة)'],
  ['األستاذ(ة)','الأستاذ(ة)'],
  ['بالحروف:::::::::','بالحروف:'],
  ['بالحروف:::::::','بالحروف:'],
  ['بالحروف::::::::','بالحروف:'],
  ['باأرقام','بالأرقام'],
  ['باأمر','بالأمر'],
  ['باأمر:','بالأمر:'],
  ['اإمضاء','الإمضاء'],
  ['ااإمضاء','الإمضاء']
];

function fixReportText(value){
  let s=String(value==null?'':value);
  for(const [bad,good] of FINAL_CORRECTIONS) s=s.split(bad).join(good);
  return s;
}

function fixDom(root){
  if(!root) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  for(const node of nodes){
    const fixed=fixReportText(node.nodeValue);
    if(fixed!==node.nodeValue) node.nodeValue=fixed;
  }
}

function install(){
  fixDom(document.body);

  if(document.body && !window.__reportFinalTextObserver){
    window.__reportFinalTextObserver=new MutationObserver(function(mutations){
      for(const m of mutations){
        if(m.type==='characterData'){
          const fixed=fixReportText(m.target.nodeValue);
          if(fixed!==m.target.nodeValue)m.target.nodeValue=fixed;
        }else if(m.type==='childList'){
          m.addedNodes.forEach(function(n){
            if(n.nodeType===1) fixDom(n);
            else if(n.nodeType===3){
              const fixed=fixReportText(n.nodeValue);
              if(fixed!==n.nodeValue)n.nodeValue=fixed;
            }
          });
        }
      }
    });
    window.__reportFinalTextObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  // اعتراض نافذة الطباعة وتصحيح HTML الذي يكتبه قالب التقرير قبل عرضه.
  if(typeof window.printMinisterialReport==='function' && !window.__reportFinalPrintPatch){
    const originalPrint=window.printMinisterialReport;
    window.__reportFinalPrintPatch=true;
    window.printMinisterialReport=function(){
      const realOpen=window.open;
      window.open=function(){
        const w=realOpen.apply(window,arguments);
        if(w && w.document && typeof w.document.write==='function'){
          const realWrite=w.document.write.bind(w.document);
          w.document.write=function(html){
            return realWrite(fixReportText(html));
          };
        }
        return w;
      };
      try{return originalPrint.apply(this,arguments);}
      finally{window.open=realOpen;}
    };
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
setTimeout(install,300);
setTimeout(install,1000);
setTimeout(install,2000);
})();
