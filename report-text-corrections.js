(function(){
'use strict';

// تصحيحات نصية حرفية لنموذج التقرير وفق النموذج الوزاري المرفق.
const CORRECTIONS = [
  ['التالميذ','التلاميذ'],
  ['االسم','الاسم'],
  ['الإسم','الاسم'],
  ['الميالد','الميلاد'],
  ['ألستاذ','الأستاذ'],
  ['االبتدائي','الإبتدائي'],
  ['اإلطار','الإطار'],
  ['والدرجة:::::::::','والدرجة:'],
  ['األقدمية','الأقدمية'],
  ['االستماع','الاستماع'],
  ['ااإضاءة','الإضاءة'],
  ['اإلرشادات','الإرشادات'],
  ['االطلاع','الاطلاع'],
  ['اإلداري','الإداري'],
  ['األستاذ(ة)','الأستاذ(ة)'],
  ['بالحروف:::::::','بالحروف:'],
  ['باأرقام','بالأرقام'],
  ['باأمر','بالأمر'],
  ['اإمضاء','الإمضاء']
];

function fixText(text){
  let s=String(text==null?'':text);
  for(const [bad,good] of CORRECTIONS) s=s.split(bad).join(good);
  return s;
}

function fixElement(root){
  if(!root) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n=>{ const fixed=fixText(n.nodeValue); if(fixed!==n.nodeValue)n.nodeValue=fixed; });
}

function installDomCorrection(){
  fixElement(document.body);
  const observer=new MutationObserver(mutations=>{
    for(const m of mutations){
      if(m.type==='characterData'){
        const fixed=fixText(m.target.nodeValue);
        if(fixed!==m.target.nodeValue)m.target.nodeValue=fixed;
      } else if(m.type==='childList'){
        m.addedNodes.forEach(n=>{if(n.nodeType===1)fixElement(n);else if(n.nodeType===3){const fixed=fixText(n.nodeValue);if(fixed!==n.nodeValue)n.nodeValue=fixed;}});
      }
    }
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}

// التقرير المطبوع يُنشأ داخل نافذة جديدة بواسطة printMinisterialReport.
// نعترض document.write لتصحيح النصوص داخل النسخة المطبوعة دون المساس بمحرك التقرير.
function installPrintCorrection(){
  const originalPrint=window.printMinisterialReport;
  if(typeof originalPrint!=='function' || window.__reportTextCorrectionInstalled) return;
  window.__reportTextCorrectionInstalled=true;
  window.printMinisterialReport=function(){
    const realOpen=window.open;
    window.open=function(){
      const w=realOpen.apply(window,arguments);
      if(w && w.document){
        const originalWrite=w.document.write.bind(w.document);
        w.document.write=function(html){
          return originalWrite(fixText(html));
        };
      }
      return w;
    };
    try{return originalPrint.apply(this,arguments);}
    finally{window.open=realOpen;}
  };
}

function init(){
  installDomCorrection();
  installPrintCorrection();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
setTimeout(init,300);
setTimeout(init,1000);
})();
