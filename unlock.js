'use strict';
const decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function decryptArchive(password,payload){
 if(payload.version!==1||payload.kdf!=='PBKDF2-SHA256'||payload.iterations!==600000)throw Error('Unsupported format');
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(payload.salt),iterations:payload.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(payload.iv),additionalData:new TextEncoder().encode('FBT-ATLAS-v1')},key,decode(payload.ciphertext));
 return JSON.parse(new TextDecoder().decode(plain));
}
async function openArchive(archive){
 const urls={},files=archive.files;
 if(archive.version!==1||!files['index.html']||!files['app.js'])throw Error('Invalid archive');
 for(const [name,file] of Object.entries(files))urls[name]=URL.createObjectURL(new Blob([decode(file.data)],{type:file.type}));
 const remap=()=>document.querySelectorAll('[src],[href]').forEach(el=>{
  for(const attr of ['src','href']){const value=el.getAttribute(attr);if(!value||value.startsWith('#')||/^(?:https?:|blob:|data:)/.test(value))continue;const name=value.split('?')[0];if(urls[name]){el.setAttribute(attr,urls[name]);if(el.tagName==='A'){if(!el.hasAttribute('download')){el.target='_blank';el.rel='noopener';}else if(!el.getAttribute('download'))el.download=name.split('/').pop();}}}
 });
 const doc=new DOMParser().parseFromString(new TextDecoder().decode(decode(files['index.html'].data)),'text/html');
 doc.querySelectorAll('script').forEach(s=>s.remove());
 // Preserve the original hosting URL for hash routing and comparison permalinks.
 document.body.innerHTML=doc.body.innerHTML;document.title=doc.title;
 const css=document.createElement('link');css.rel='stylesheet';css.href=urls['style.css'];document.head.append(css);
 const observer=new MutationObserver(remap);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','href']});remap();
 // Discard login layout styles after decrypting.
 document.head.querySelectorAll('style').forEach(s=>s.remove());
 for(const name of ['data.js','app.js'])await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=urls[name];s.onload=resolve;s.onerror=reject;document.body.append(s)});
 const lock=document.createElement('button');lock.textContent='锁定 / 退出';lock.style.cssText='position:fixed;right:16px;bottom:16px;z-index:999;padding:10px 16px;background:#195e4c;color:white;border:0;border-radius:8px;cursor:pointer';lock.onclick=()=>location.reload();document.body.append(lock);
 window.addEventListener('pagehide',()=>{observer.disconnect();for(const url of Object.values(urls))URL.revokeObjectURL(url)},{once:true});
}
document.querySelector('#login').addEventListener('submit',async event=>{
 event.preventDefault();const field=document.querySelector('#password'),button=document.querySelector('#submit'),status=document.querySelector('#status');
 let password=field.value;field.value='';button.disabled=true;status.textContent='正在下载并解密内容…';
 try{if(!crypto.subtle)throw Error('HTTPS required');const response=await fetch('payload.json',{cache:'no-store'});if(!response.ok)throw Error('Download failed');const archive=await decryptArchive(password,await response.json());password='';await openArchive(archive);}catch(error){password='';status.textContent='无法解锁：请检查密码与网络，或确认发布包完整。';button.disabled=false;}
});
