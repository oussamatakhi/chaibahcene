(function(){
'use strict';

// تصحيح نصوص التقرير المطبوعة وفق النموذج الوزاري المرفق، دون تغيير البنية أو ترتيب الحقول.
const replacements={
  'الإسم':'الإسم',
  'الاسم':'الإسم',
  'الخالصة':'الخلاصة',
  'العالمة':'العلامة',
  'أعمال التلاميذ':'اعمال التلاميذ',
  'اعمال التلاميذ':'اعمال التلاميذ',
  'الزيارات التربوي':'الزيارات التربوية',
  'الاطلاع':'الاطلاع',
  'الاطّلاع':'الاطلاع',
  'اطلع (ت) عليه المعني(ة) بالأمر بتاريخ':'اطلع (ت) عليه المعني(ة)بالأمر بتاريخ',
  'اطلع (ت) عليه المعني ة بالأمر بتاريخ':'اطلع (ت) عليه المعني(ة)بالأمر بتاريخ',
  'تقرير حرره مفتش مادة : التربية البدنية و الرياضية':'تقرير حرره مفتش مادة التربية البدنية و الرياضية',
  'تقرير حرره مفتش مادة: التربية البدنية و الرياضية':'تقرير حرره مفتش مادة التربية البدنية و الرياضية',
  'بالأرقام':'بالأرقام',
  'العلامة بالأرقام':'بالأرقام :',
  'العلامة بالحروف':'العلامة بالحروف:',
  'اللقب و الإسم':'اللقب والإسم',
  'اللقب والاسم':'اللقب والإسم',
  'السلم والدرجة':'السلم والدرجة :',
  'الوسائل التعليمية:':'الوسائل التعليمية',
  'مراقبة أعمال التلاميذ':'مراقبة اعمال التلاميذ',
  'هل هي موجودة ؟':'هل هي موجودة ؟',
  'قيمتها :':'قيمتها :',
  'الكتاب :':'الكتاب :',
  'وسائل أخرى :':'وسائل أخرى :',
  'دفتر النصوص :':'دفتر النصوص:',
  'التقدير العام بعد حضور الدرس والاطلاع على الملف الإداري ومناقشة الأستاذة':'التقدير العام بعد حضور الدرس والاطلاع على الملف الإداري ومناقشة الأستاذ(ة)',
  'التقدير العام بعد حضور الدرس والاطلاع على الملف الإداري ومناقشة الأستاذ ة':'التقدير العام بعد حضور الدرس والاطلاع على الملف الإداري ومناقشة الأستاذ(ة)'
};
function fixDoc(doc){
  if(!doc||!doc.body)return;
  const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);
  const nodes=[];let n;while(n=walker.nextNode())nodes.push(n);
  nodes.forEach(node=>{
    let s=node.nodeValue;
    Object.keys(replacements).forEach(k=>{if(k!==replacements[k])s=s.split(k).join(replacements[k]);});
    node.nodeValue=s;
  });
}
function hook(){
  const base=window.printMinisterialReport;
  if(typeof base!=='function'||base.__sourceTextFix)return;
  const wrapped=function(...args){
    const real=window.open;
    window.open=function(...a){
      const p=real.apply(window,a);
      [100,400,900,1500].forEach(ms=>setTimeout(()=>fixDoc(p&&p.document),ms));
      return p;
    };
    try{return base.apply(this,args)}finally{setTimeout(()=>{window.open=real},100)}
  };
  wrapped.__sourceTextFix=true;
  window.printMinisterialReport=wrapped;
}
function init(){hook();setInterval(hook,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
