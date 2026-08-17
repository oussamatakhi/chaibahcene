// إعدادات Supabase - إصدار جديد لتجاوز التخزين المؤقت للمتصفح
window.SUPABASE_URL = "https://qaimjtdiyatouqsqfthb.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t9YsG10SgXDyKPANd6TdCA_UosY7Yzb";

(function(){
  window.addEventListener('load', function(){
    window.__ministerialOpenReport = window.openReport;

    var app=document.createElement('script');
    app.src='app-fix.js?v=20260817-6';
    app.onload=function(){
      var finalFix=document.createElement('script');
      finalFix.src='report-final.js?v=20260817-4';
      finalFix.onload=function(){
        var visitFix=document.createElement('script');
        visitFix.src='visit-teacher-search.js?v=20260817-3';
        visitFix.onload=function(){
          var autofill=document.createElement('script');
          autofill.src='report-autofill-v2.js?v=20260817-3';
          autofill.onload=function(){
            var textFix=document.createElement('script');
            textFix.src='report-text-corrections.js?v=20260817-3';
            textFix.onload=function(){
              var finalTextFix=document.createElement('script');
              finalTextFix.src='report-text-corrections-v2.js?v=20260817-2';
              finalTextFix.onload=function(){
                var modalFix=document.createElement('script');
                modalFix.src='modal-bottom-close.js?v=20260817-1';
                document.head.appendChild(modalFix);
              };
              document.head.appendChild(finalTextFix);
            };
            document.head.appendChild(textFix);
          };
          document.head.appendChild(autofill);
        };
        document.head.appendChild(visitFix);
      };
      document.head.appendChild(finalFix);
    };
    app.onerror=function(){console.error('تعذر تحميل التطبيق المستقر app-fix.js');};
    document.head.appendChild(app);
  });
})();
