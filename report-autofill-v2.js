(()=>{'use strict';
function pick(o,...keys){for(const k of keys){if(o&&o[k]!==undefined&&o[k]!==null&&String(o[k]).trim()!=='')return o[k]}return ''}
function set(form,name,value){const el=form?.elements?.[name];if(el&&value!==''&&value!==null&&value!==undefined)el.value=value}
function applyTeacherData(visitId){
  const form=document.getElementById('ministerialReportForm');
  if(!form||!window.cache)return;
  const v=window.cache.visits?.find(x=>x.id===visitId); if(!v)return;
  const t=window.cache.teachers?.find(x=>x.id===v.teacher_id); if(!t)return;
  const inst=v.institutions||t.institutions||window.cache.institutions?.find(x=>x.id===t.institution_id)||{};
  set(form,'institution',pick(inst,'name'));
  set(form,'municipality',pick(t,'municipality')||pick(inst,'municipality'));
  set(form,'administrative_district',pick(inst,'administrative_district'));
  set(form,'last_name',pick(t,'last_name'));
  set(form,'first_name',pick(t,'first_name'));
  set(form,'birth_date_place',pick(t,'birth_date_place','birth_date_and_place', 'birth_info'));
  set(form,'first_appointment',pick(t,'appointment_date','first_appointment'));
  set(form,'framework',pick(t,'framework','rank'));
  set(form,'scale',pick(t,'scale','pay_scale'));
  set(form,'grade',pick(t,'grade'));
  set(form,'grade_seniority',pick(t,'grade_seniority','seniority_in_grade'));
  set(form,'qualification',pick(t,'qualification','academic_qualification'));
  set(form,'last_inspection',pick(t,'last_inspection_date'));
  set(form,'previous_score',pick(t,'last_inspection_score'));
  set(form,'teacher_signature_name',`${pick(t,'last_name')} ${pick(t,'first_name')}`.trim());
  set(form,'inspection_date',pick(v,'scheduled_date'));
}
function hook(){
 const base=window.openReport;
 if(typeof base!=='function'||base.__autofillV2)return;
 const wrapped=async function(visitId){
   const result=await base.apply(this,arguments);
   setTimeout(()=>applyTeacherData(visitId),80);
   setTimeout(()=>applyTeacherData(visitId),400);
   return result;
 };
 wrapped.__autofillV2=true;
 window.openReport=wrapped;
}
function init(){hook();setInterval(hook,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
