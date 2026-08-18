(()=>{'use strict';
const sbFast=window.__APP_SUPABASE_CLIENT||window.supabaseClient||null;
const q=id=>document.getElementById(id);
async function fastDashboardCounts(){
  const sb=sbFast||window.supabase?.createClient?.(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
  if(!sb)return;
  try{
    const results=await Promise.all([
      sb.from('teachers').select('id',{count:'exact',head:true}),
      sb.from('institutions').select('id',{count:'exact',head:true}),
      sb.from('visits').select('id',{count:'exact',head:true}),
      sb.from('seminars').select('id',{count:'exact',head:true})
    ]);
    const ids=['countTeachers','countInstitutions','countVisits','countSeminars'];
    results.forEach((r,i)=>{if(!r.error&&q(ids[i]))q(ids[i]).textContent=String(r.count??0)});
  }catch(e){console.warn('تعذر تحميل إحصائيات لوحة التحكم سريعاً',e)}
}
window.fastDashboardCounts=fastDashboardCounts;
fastDashboardCounts();
})();
