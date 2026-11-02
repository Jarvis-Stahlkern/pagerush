/* Pagerush FX 1.0 - geprüfte Scroll-Effekte (STAHLKERN GmbH). Keine Netzwerkzugriffe. */
(function(){
var R=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var cl=function(x,a,b){return Math.max(a,Math.min(b,x))};
var VH=function(){return window.innerHeight};
function prog(sec){var r=sec.getBoundingClientRect(),h=sec.offsetHeight-VH();return h>0?cl(-r.top/h,0,1):0}
function sticky(sec,len){var st=sec.querySelector("[data-stage]");sec.style.position="relative";st.style.position="sticky";st.style.top="0";st.style.height="100vh";st.style.overflow="hidden";return st}
var FX={};
FX.camera=function(sec){var len=+sec.dataset.length||400,st=sticky(sec),sc=$$("[data-scene]",st);
 sc.forEach(function(s){s.style.position="absolute";s.style.inset="0";s.style.willChange="opacity";var im=s.querySelector("img");if(im){im.style.cssText+=";position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform"}});
 return{size:function(){sec.style.height=len*VH()/100+"px"},upd:function(){var t=prog(sec)*sc.length;sc.forEach(function(s,i){var d=Math.abs(t-(i+.5)),w=R?(d<.5?1:0):cl((.95-d)*2.2,0,1);s.style.opacity=w;s.style.zIndex=i;var im=s.querySelector("img");if(im&&!R)im.style.transform="scale("+(1+.24*cl(t-i,0,1.2))+") translateY("+(-3*cl(t-i,0,1.2))+"%)";var c=s.querySelector("[data-cap]");if(c){c.style.opacity=w;c.style.transform="translateY("+((1-w)*26)+"px)"}})}}};
FX.depth=function(sec){sec.style.position="relative";sec.style.overflow="hidden";var L=[],src=sec.dataset.src;
 if(src){[null,"linear-gradient(to bottom,transparent 18%,#000 48%)","linear-gradient(to bottom,transparent 52%,#000 80%)"].forEach(function(m,i){var d=document.createElement("div");d.style.cssText="position:absolute;inset:-10%;background:center/cover url("+src+");will-change:transform;z-index:0"+(m?";-webkit-mask-image:"+m+";mask-image:"+m:"");d.dataset.depth=[.2,.5,1][i];sec.insertBefore(d,sec.firstChild);L.push(d)});
  Array.prototype.forEach.call(sec.children,function(c){if(!c.dataset.depth){if(getComputedStyle(c).position=="static")c.style.position="relative";c.style.zIndex=2}})}
 else L=$$("[data-depth]",sec).map(function(l){l.style.willChange="transform";return l});
 return{size:function(){},upd:function(){if(R)return;var r=sec.getBoundingClientRect(),p=cl(-r.top/Math.max(r.height,1),0,1);L.forEach(function(l){var d=+l.dataset.depth||.3;l.style.transform="translate3d(0,"+(-d*p*13)+"%,0) scale("+(1+d*p*.42)+")"})}}};
FX.words=function(el){var tx=el.textContent.trim().split(/\s+/);el.textContent="";var sp=tx.map(function(w,i){var s=document.createElement("span");s.textContent=w;s.style.transition="opacity .25s";el.appendChild(s);el.appendChild(document.createTextNode(" "));return s});
 return{size:function(){},upd:function(){var r=el.getBoundingClientRect(),p=R?1:cl((VH()*.88-r.top)/(VH()*.5),0,1),n=sp.length;sp.forEach(function(s,i){s.style.opacity=.16+.84*cl(p*n-i,0,1)})}}};
FX.band=function(sec){var st=sticky(sec),tr=st.querySelector("[data-track]");st.style.display="flex";st.style.alignItems="center";tr.style.display="flex";tr.style.width="max-content";tr.style.willChange="transform";Array.prototype.forEach.call(tr.children,function(c){c.style.flexShrink="0"});var dx=0;
 return{size:function(){dx=Math.max(0,tr.scrollWidth-innerWidth+80);sec.style.height=(dx+VH())+"px"},upd:function(){tr.style.transform="translate3d("+(-prog(sec)*dx)+"px,0,0)"}}};
FX.daynight=function(sec){var len=+sec.dataset.length||300,st=sticky(sec),a=st.querySelector("[data-day]"),b=st.querySelector("[data-night]");
 $$("img",st).forEach(function(i){i.style.cssText+=";position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform,opacity"});
 return{size:function(){sec.style.height=len*VH()/100+"px"},upd:function(){var p=prog(sec),n=R?(p>.5?1:0):cl((p-.2)/.6,0,1);if(b)b.style.opacity=n;if(a)a.style.transform=b.style.transform="scale("+(1+.12*p)+")";$$("[data-when]",st).forEach(function(e){var w=e.dataset.when=="night"?n:1-n;e.style.opacity=w;e.style.transform="translateY("+((1-w)*20)+"px)"})}}};
var inst=[];
function init(){$$("[data-fx]").forEach(function(el){var f=FX[el.dataset.fx];if(f&&!el._fx){try{var o=f(el);el._fx=1;inst.push(o)}catch(e){}}});
 if(!R&&"IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform="none";io.unobserve(e.target)}})},{threshold:.15});$$("[data-reveal]").forEach(function(e){e.style.opacity=0;e.style.transform="translateY(26px)";e.style.transition="opacity .9s ease,transform .9s ease";io.observe(e)})}
 size();upd()}
function size(){inst.forEach(function(o){o.size()})}
function upd(){inst.forEach(function(o){o.upd()})}
var tk=0;function onS(){if(tk)return;tk=requestAnimationFrame(function(){tk=0;upd()})}
addEventListener("scroll",onS,{passive:true});addEventListener("resize",function(){size();onS()});addEventListener("load",function(){size();upd()});
if(document.readyState!="loading")init();else document.addEventListener("DOMContentLoaded",init);
})();
