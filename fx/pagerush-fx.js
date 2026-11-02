/* Pagerush FX 1.1 - geprüfte Scroll-Effekte (STAHLKERN GmbH). Keine Netzwerkzugriffe. */
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
 return{size:function(){sec.style.height=len*VH()/100+"px"},upd:function(){var t=prog(sec)*sc.length;sc.forEach(function(s,i){var d=Math.abs(t-(i+.5)),w=R?(d<.5?1:0):cl((.95-d)*2.2,0,1);s.style.opacity=w;s.style.zIndex=i;var im=s.querySelector("img");if(im&&!R)im.style.transform="scale("+(1+.24*cl(t-i,0,1.2))+") translateY("+(-3*cl(t-i,0,1.2))+"%)";var c=s.querySelector("[data-cap]");if(c){var cw=R?w:cl((.42-d)*4.5,0,1);c.style.opacity=cw;c.style.transform="translateY("+((1-cw)*26)+"px)"}})}}};
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

/* 1.1 (01.11.): 3D- und Smooth-Effekte wie auf Award-Seiten */
FX.stack=function(sec){var cs=$$("[data-card]",sec);cs.forEach(function(c,i){c.style.position="sticky";c.style.top=(+sec.dataset.top||12)+i*1.4+"vh";c.style.transformOrigin="50% 0";c.style.willChange="transform"});
 return{size:function(){},upd:function(){if(R)return;cs.forEach(function(c,i){var n=cs[i+1];if(!n)return;var r=n.getBoundingClientRect(),p=cl(1-(r.top-c.getBoundingClientRect().top)/c.offsetHeight,0,1);c.style.transform="perspective(1400px) scale("+(1-.07*p)+") rotateX("+(6*p)+"deg)";c.style.filter="brightness("+(1-.35*p)+")"})}}};
FX.expand=function(sec){var len=+sec.dataset.length||220,st=sticky(sec),m=st.querySelector("img,video,[data-media]")||st.firstElementChild;if(m)m.style.cssText+=";position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:clip-path,transform";
 return{size:function(){sec.style.height=len*VH()/100+"px"},upd:function(){var p=R?1:cl(prog(sec)*1.6,0,1),i=(1-p)*22,rr=(1-p)*28;if(m){m.style.clipPath="inset("+i+"% "+i*1.15+"% "+i+"% "+i*1.15+"% round "+rr+"px)";m.style.transform="scale("+(1.15-.15*p)+")"}$$("[data-cap]",st).forEach(function(c){c.style.opacity=cl(p*2-1,0,1);c.style.transform="translateY("+(1-p)*40+"px)"})}}};
FX.letters=function(el){var t=el.textContent;el.textContent="";el.setAttribute("aria-label",t);t.split(/(\s+)/).forEach(function(w,wi){if(/^\s+$/.test(w)){el.appendChild(document.createTextNode(" "));return}var sp=document.createElement("span");sp.style.cssText="display:inline-block;white-space:nowrap";sp.setAttribute("aria-hidden","true");w.split("").forEach(function(ch,ci){var c=document.createElement("span");c.textContent=ch;c.style.cssText="display:inline-block;"+(R?"":"opacity:0;transform:translateY(.6em) rotateX(-80deg);transform-origin:50% 100%;transition:opacity .9s cubic-bezier(.2,.8,.2,1),transform 1.1s cubic-bezier(.2,.8,.2,1);transition-delay:"+(wi*.06+ci*.025)+"s");sp.appendChild(c)});el.appendChild(sp)});el.style.perspective="800px";
 requestAnimationFrame(function(){setTimeout(function(){$$("span span",el).forEach(function(c){c.style.opacity=1;c.style.transform="none"})},120)});return{size:function(){},upd:function(){}}};
FX.tilt=function(el){if(R||!matchMedia("(pointer:fine)").matches)return{size:function(){},upd:function(){}};var mx=+el.dataset.max||10;el.style.transformStyle="preserve-3d";el.style.transition="transform .5s cubic-bezier(.2,.8,.2,1)";el.style.willChange="transform";
 var g=document.createElement("i");g.style.cssText="position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .4s;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.28),transparent 55%)";if(getComputedStyle(el).position=="static")el.style.position="relative";el.appendChild(g);
 el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.transition="transform .12s linear";el.style.transform="perspective(900px) rotateY("+(x-.5)*2*mx+"deg) rotateX("+(.5-y)*2*mx+"deg) translateZ(10px)";g.style.opacity=1;g.style.setProperty("--gx",x*100+"%");g.style.setProperty("--gy",y*100+"%")});
 el.addEventListener("pointerleave",function(){el.style.transition="transform .6s cubic-bezier(.2,.8,.2,1)";el.style.transform="none";g.style.opacity=0});return{size:function(){},upd:function(){}}};
FX.rotate=function(sec){var o=sec.querySelector("[data-obj]")||sec.firstElementChild;if(o){o.style.willChange="transform";o.style.transformStyle="preserve-3d"}sec.style.perspective="1200px";
 return{size:function(){},upd:function(){if(R||!o)return;var r=sec.getBoundingClientRect(),p=cl(1-(r.top+r.height)/(VH()+r.height),0,1);o.style.transform="rotateY("+(-35+70*p)+"deg) rotateX("+(18-36*p)+"deg) translateZ("+(-120+120*Math.sin(p*Math.PI))+"px)"}}};
function smooth(){if(R||!matchMedia("(pointer:fine)").matches||document.body.dataset.smooth=="off"||document.documentElement.dataset.smooth=="off")return;
 var y=scrollY,z=scrollY,run=0;function loop(){z+=(y-z)*.1;if(Math.abs(y-z)<.4){z=y;run=0;scrollTo(0,z);return}scrollTo(0,z);requestAnimationFrame(loop)}
 addEventListener("wheel",function(e){if(e.ctrlKey||e.defaultPrevented)return;var t=e.target;while(t&&t!==document.body){var cs=getComputedStyle(t);if(/(auto|scroll)/.test(cs.overflowY)&&t.scrollHeight>t.clientHeight)return;t=t.parentElement}
  e.preventDefault();if(!run)y=z=scrollY;y=cl(y+e.deltaY*(e.deltaMode==1?40:1),0,document.documentElement.scrollHeight-innerHeight);if(!run){run=1;requestAnimationFrame(loop)}},{passive:false});
 addEventListener("keydown",function(){run=0});addEventListener("scroll",function(){if(!run)y=z=scrollY},{passive:true})}
var inst=[];
function init(){$$("[data-tilt]").forEach(function(el){if(!el._fx){el._fx=1;FX.tilt(el)}});
 $$("[data-fx]").forEach(function(el){var f=FX[el.dataset.fx];if(f&&!el._fx){try{var o=f(el);el._fx=1;inst.push(o)}catch(e){}}});
 if(!R&&"IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform="none";io.unobserve(e.target)}})},{threshold:.15});$$("[data-reveal]").forEach(function(e){var d=e.dataset.reveal=="3d";e.style.opacity=0;e.style.transform=d?"perspective(1000px) rotateX(24deg) translateY(60px) scale(.94)":"translateY(26px)";e.style.transformOrigin="50% 100%";e.style.transition="opacity 1s cubic-bezier(.2,.8,.2,1),transform 1.2s cubic-bezier(.2,.8,.2,1)";io.observe(e)})}
 size();upd();smooth()}
function size(){inst.forEach(function(o){o.size()})}
function upd(){inst.forEach(function(o){o.upd()})}
var tk=0;function onS(){if(tk)return;tk=requestAnimationFrame(function(){tk=0;upd()})}
addEventListener("scroll",onS,{passive:true});addEventListener("resize",function(){size();onS()});addEventListener("load",function(){size();upd()});
if(document.readyState!="loading")init();else document.addEventListener("DOMContentLoaded",init);
})();
