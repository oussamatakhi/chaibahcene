(()=>{'use strict';
function formatBirthDate(v){if(!v)return '';const s=String(v).slice(0,10);const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}-${m[2]}-${m[1]}`:s;}
function getTeacherForVisit(visitId){const v=window.cache?.visits?.find(x=>x.id===visitId);return v?window.cache?.teachers?.find(x=>x.id===v.teacher_id):null;}
function applyBirth(form,t){if(!form||!t)return;const el=form.elements['birth_date_place'];if(!el)return;const date=formatBirthDate(t.birth_date);const place=t.birth_place||'';el.value=date&&place?`${date} - ${place}`:(date||place||t.birth_date_place||'');}
function install(){if(typeof window.openReport!=='function')return setTimeout(install,100);if(window.__birthReportPatched)return;window.__birthReportPatched=true;const original=window.openReport;window.openReport=async function(visitId){const result=await original(visitId);const form=document.getElementById('ministerialReportForm');const t=getTeacherForVisit(visitId);applyBirth(form,t);return result;};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();