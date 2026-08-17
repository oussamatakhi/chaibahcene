(()=>{'use strict';
const removeTextButtons=()=>{
 document.querySelectorAll('button').forEach(b=>{
  const t=(b.textContent||'').trim();
  if(t==='غلق النافذة'||t==='إغلاق النافذة') b.remove();
 });
};
const dedupe=()=>{
 ['teachers','institutions'].forEach(id=>{
  const root=document.getElementById(id);if(!root)return;
  const seen=new Set();root.querySelectorAll('button').forEach(b=>{
   const t=(b.textContent||'').trim();
   if(/^استيراد\s*Excel$/i.test(t)){if(seen.has('excel'))b.remove();else seen.add('excel');}
  });
 });
 document.querySelectorAll('label,div,.form-group,.field').forEach(parent=>{
  const children=[...parent.children];
  const seen=new Set();children.forEach(el=>{
   const t=(el.textContent||'').trim();
   if((t==='الأساتذة المعنيون'||t==='المؤطرون')&&seen.has(t)) el.remove();
   else if(t==='الأساتذة المعنيون'||t==='المؤطرون') seen.add(t);
  });
 });
 removeTextButtons();
};
function init(){dedupe();setTimeout(dedupe,300);setTimeout(dedupe,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('load',()=>setTimeout(dedupe,500));
})();