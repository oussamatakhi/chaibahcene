(()=>{'use strict';
function msg(t,ok=false){let e=document.getElementById('recoveryMessage');if(e){e.textContent=t;e.className=ok?'success':'error'}}
function closeRecovery(){document.getElementById('recoveryModal')?.remove()}
function modal(title,body){closeRecovery();const d=document.createElement('div');d.id='recoveryModal';d.className='modal';d.innerHTML='<div class="modal-card" style="max-width:460px"><button class="close" type="button" id="recoveryClose">×</button><h3>'+title+'</h3>'+body+'</div>';document.body.appendChild(d);d.hidden=false;document.getElementById('recoveryClose').onclick=closeRecovery;return d}
function redirectUrl(){return window.location.origin+window.location.pathname}
async function requestReset(){
 const email=(document.getElementById('recoveryEmail')?.value||'').trim();
 if(!email)return msg('يرجى إدخال البريد الإلكتروني.');
 const b=document.getElementById('recoverySend');b.disabled=true;b.textContent='جارٍ الإرسال...';
 const {error}=await window.__APP_SUPABASE_CLIENT.auth.resetPasswordForEmail(email,{redirectTo:redirectUrl()});
 b.disabled=false;b.textContent='إرسال رابط الاسترجاع';
 if(error)return msg('تعذر إرسال رابط الاسترجاع: '+error.message);
 msg('تم إرسال رابط استرجاع كلمة المرور إلى بريدك الإلكتروني. تحقق من البريد الوارد ومجلد الرسائل غير المرغوب فيها.',true);
}
function openForgot(){modal('استرجاع كلمة المرور','<p>أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابطًا لتعيين كلمة مرور جديدة.</p><label>البريد الإلكتروني<input id="recoveryEmail" type="email" required autocomplete="email" placeholder="name@example.com"></label><div id="recoveryMessage" class="error"></div><button id="recoverySend" class="primary" type="button">إرسال رابط الاسترجاع</button>');document.getElementById('recoverySend').onclick=requestReset}
function openChangePassword(){modal('تعيين كلمة مرور جديدة','<p>أدخل كلمة المرور الجديدة لحسابك.</p><label>كلمة المرور الجديدة<input id="newPassword" type="password" minlength="8" required autocomplete="new-password"></label><label>تأكيد كلمة المرور<input id="confirmPassword" type="password" minlength="8" required autocomplete="new-password"></label><div id="recoveryMessage" class="error"></div><button id="changePasswordBtn" class="primary" type="button">حفظ كلمة المرور</button>');document.getElementById('changePasswordBtn').onclick=async()=>{const p=document.getElementById('newPassword').value,c=document.getElementById('confirmPassword').value;if(p.length<8)return msg('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.');if(p!==c)return msg('تأكيد كلمة المرور غير مطابق.');const b=document.getElementById('changePasswordBtn');b.disabled=true;b.textContent='جارٍ الحفظ...';const {error}=await window.__APP_SUPABASE_CLIENT.auth.updateUser({password:p});b.disabled=false;b.textContent='حفظ كلمة المرور';if(error)return msg('تعذر تحديث كلمة المرور: '+error.message);msg('تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بها.',true);setTimeout(()=>{closeRecovery();window.__APP_SUPABASE_CLIENT.auth.signOut()},900)}}
function init(){const c=window.__APP_SUPABASE_CLIENT;if(!c)return setTimeout(init,250);document.getElementById('forgotPasswordBtn')?.addEventListener('click',openForgot);c.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')openChangePassword()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();