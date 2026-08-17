(()=>{'use strict';
// إصلاح موحد لحقول التاريخ: الإدخال اليدوي + calendrier + RTL + العرض DD-MM-YYYY
function pad(n){return String(n).padStart(2,'0')}
function toIso(v){const s=String(v||'').trim();let m=s.match(/^(\d{2})[-\/]?(\d{2})[-\/]?(\d{4})$/);if(m)return `${m[3]}-${m[2]}-${m[1]}`;m=s.match(/^(\d{4})[-\/]?(\d{2})[-\/]?(\d{2})$/);return m?`${m[1]}-${m[2]}-${m[3]}`:''}
function setup(root=document){root.querySelectorAll('input[type="date"]').forEach(el=>{el.dir='rtl';el.lang='ar-DZ';el.style.direction='rtl';el.style.textAlign='right';el.style.unicodeBidi='plaintext';el.removeAttribute('readonly');el.removeAttribute('disabled');el.addEventListener('keydown',e=>{if(e.key==='Enter')e.stopPropagation()},{capture:true});el.addEventListener('input',()=>{if(el.value)el.dataset.isoDate=el.value},{capture:true});el.addEventListener('change',()=>{if(el.value)el.dataset.isoDate=el.value},{capture:true});});}
function observe(){setup();new MutationObserver(()=>setup()).observe(document.documentElement,{subtree:true,childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe);else observe();
})();