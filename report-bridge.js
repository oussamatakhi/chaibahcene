(function(){
  const ref='qaimjtdiyatouqsqfthb';
  const rt=supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY,{auth:{storageKey:'report-template-auth',persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  window.sb=rt; window.cache={teachers:[],institutions:[],visits:[],seminars:[],dispatches:[]};
  async function sync(){
    try{
      const raw=localStorage.getItem('sb-'+ref+'-auth-token');
      if(raw){const j=JSON.parse(raw);if(j?.access_token&&j?.refresh_token)await rt.auth.setSession({access_token:j.access_token,refresh_token:j.refresh_token});}
      const [t,i,v,s,d]=await Promise.all([
        rt.from('teachers').select('*,institutions(name,municipality,administrative_district)'),
        rt.from('institutions').select('*'),
        rt.from('visits').select('*,teachers(first_name,last_name,employee_number,rank,grade,appointment_date,last_inspection_date,last_inspection_score),institutions(name,municipality,administrative_district)').order('scheduled_date'),
        rt.from('seminars').select('*'),rt.from('dispatches').select('*')
      ]);
      window.cache={teachers:t.data||[],institutions:i.data||[],visits:v.data||[],seminars:s.data||[],dispatches:d.data||[]};
    }catch(e){console.warn('report bridge',e)}
  }
  window.__reportReady=sync();
  const oldOpen=window.openReport;
  window.openReport=async function(id){await sync();return oldOpen(id);};
})();