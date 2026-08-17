(()=>{'use strict';
function fixVisitType(){const el=document.getElementById('visitType');if(!el||el.dataset.typeFix==='1')return;el.dataset.typeFix='1';el.addEventListener('change',()=>{el.blur()},{passive:true});}
function run(){fixVisitType();}
document.addEventListener('DOMContentLoaded',run);setTimeout(run,500);setTimeout(run,1500);
})();
