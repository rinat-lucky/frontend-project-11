if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const f=e=>s(e,t),c={module:{uri:t},exports:o,require:f};i[t]=Promise.all(n.map((e=>c[e]||f(e)))).then((e=>(r(...e),o)))}}define(["./workbox-d249b2c8"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"250e95d0ede5fe0e0e87f3a145a7ae86"},{url:"main.css",revision:"f486a00b272286ef2318b32b972577fe"},{url:"main.js",revision:"b644053532fd014b312fea10e495248d"},{url:"main.js.LICENSE.txt",revision:"e24b8073977e96fb9c077c94f51c8301"}],{})}));
