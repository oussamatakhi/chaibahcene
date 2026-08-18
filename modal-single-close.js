(()=>{'use strict';
const CLOSE_TEXTS=new Set(['×','✕','إغلاق','غلق','إغلاق النافذة','غلق النافذة']);
function isCloseButton(button){const text=(button.textContent||'').replace(/\s+/g,' ').trim();const aria=(button.getAttribute('aria-label')||'').trim();const title=(button.getAttribute('title')||'').trim();return CLOSE_TEXTS.has(text)||CLOSE_TEXTS.has(aria)||CLOSE_TEXTS.has(title)}
function hideExtraCloseButtons(card){card.querySelectorAll('button').forEach(button=>{if(button.getAttribute('data-single-modal-close')==='true')return;if(isCloseButton(button)){button.hidden=true;button.setAttribute('aria-hidden','true')}})}
function addSingleCloseButton(modal){const card=modal.querySelector('.modal-card');if(!card)return;hideExtraCloseButtons(card);if(card.querySelector('[data-single-modal-close="true"]'))return;const button=document.createElement('button');button.type='button';button.textContent='إغلاق';button.setAttribute('data-single-modal-close','true');button.style.cssText='display:block;width:100%;margin-top:16px;padding:10px 14px;border:0;border-radius:8px;cursor:pointer;font-family:Cairo,sans-serif';button.addEventListener('click',()=>{modal.hidden=true});card.appendChild(button)}
function clean(modal){if(!modal||!modal.classList.contains('modal'))return;addSingleCloseButton(modal)}
function processNode(node){if(node.nodeType!==1)return;if(node.matches('.modal'))clean(node);node.querySelectorAll?.('.modal').forEach(clean)}
function init(){document.querySelectorAll('.modal').forEach(clean);new MutationObserver(mutations=>{for(const mutation of mutations)for(const node of mutation.addedNodes)processNode(node)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.ensureSingleModalClose=()=>document.querySelectorAll('.modal').forEach(clean);
})();