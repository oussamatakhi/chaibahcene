(()=>{'use strict';
const getClient=()=>window.sb||window.supabaseClient||window.__APP_SUPABASE_CLIENT;
function bindDelete(){
 const form=document.getElementById('ministerialReportForm');
 if(!form||form.dataset.deleteBound==='1')return;
 form.dataset.deleteBound='1';
 const actions=form.querySelector('.report-actions');
 if(!actions)return;
 const btn=document.createElement('button');
 btn.type='button'; btn.id='rtDeleteBtn'; btn.className='small-btn danger'; btn.textContent='حذف التقرير';
 btn.style.marginInlineStart='8px';
 actions.appendChild(btn);
 btn.addEventListener('click',async()=>{
   const id=form.elements.id?.value?.trim();
   if(!id){alert('لا يوجد تقرير محفوظ لحذفه.');return;}
   if(!confirm('هل أنت متأكد من حذف هذا التقرير؟\nسيتم حذف التقرير فقط ولن يتم حذف الزيارة أو الأستاذ.'))return;
   const sb=getClient(); if(!sb){alert('تعذر الاتصال بقاعدة البيانات.');return;}
   btn.disabled=true;btn.textContent='جارٍ الحذف...';
   try{
     const {error}=await sb.from('visit_reports').delete().eq('id',id);
     if(error){alert('تعذر حذف التقرير: '+error.message);return;}
     const visitId=form.elements.visit_id?.value?.trim();
     if(visitId){
       await sb.from('visits').update({status:'مجدولة'}).eq('id',visitId);
     }
     window.closeModal?.('reportModal');
     if(typeof window.loadAll==='function')await window.loadAll();
     alert('تم حذف التقرير بنجاح.');
   }finally{btn.disabled=false;btn.textContent='حذف التقرير';}
 });
}
const observer=new MutationObserver(()=>bindDelete());
function init(){bindDelete();observer.observe(document.body,{childList:true,subtree:true});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
