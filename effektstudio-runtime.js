(()=>{'use strict';
const cfg=window.__PAGERUSH_FX||{},kind=cfg.kind||'cinematic',strength=Math.max(0,Math.min(100,Number(cfg.intensity)||0))/100;
const media=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px), (pointer: coarse)');
let running=false,enabled=false,io=null,raf=0;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const targets=[...document.querySelectorAll('.hero,.hero .w,.hero .hbox,.sek,.kachel,.bild')];
const style=document.createElement('style');style.id='pagerush-fx-css';style.textContent=`
html{scroll-behavior:auto!important}body.fx-active{--fx-amount:${strength}}
.fx-active .sek{scroll-margin-top:70px}
.fx-active.fx-reveal .sek,.fx-active.fx-reveal .kachel{transition:opacity .65s ease,transform .65s ease;}
.fx-active.fx-reveal .fx-wait{opacity:.12!important;transform:translateY(calc(20px * var(--fx-amount)))!important}
.fx-active.fx-reveal .fx-seen{opacity:1!important;transform:translateY(0)!important}
.fx-active.fx-spatial .kachel{transform-style:preserve-3d;backface-visibility:hidden;will-change:transform}
.fx-active.fx-cinematic .hero .w{will-change:transform}
@media(max-width:700px),(pointer:coarse){.fx-active.fx-spatial .kachel{will-change:auto}}
@media(prefers-reduced-motion:reduce){.fx-active .fx-wait,.fx-active .fx-seen{opacity:1!important;transform:none!important;transition:none!important}.fx-active .kachel{transform:none!important;will-change:auto!important}}
`;document.head.append(style);
function reset(){cancelAnimationFrame(raf);raf=0;running=false;if(io){io.disconnect();io=null;}document.body.classList.remove('fx-active','fx-cinematic','fx-spatial','fx-parallax','fx-reveal');targets.forEach(el=>{el.classList.remove('fx-wait','fx-seen');el.style.removeProperty('translate');el.style.removeProperty('rotate');el.style.removeProperty('scale');el.style.removeProperty('transform');el.style.removeProperty('opacity');});}
function permitted(){return !!cfg.enabled&&strength>0&&!media.matches}
function tick(){raf=0;if(!enabled)return;const vh=innerHeight||1;const hero=document.querySelector('.hero'),heroText=document.querySelector('.hero .w');if(kind==='cinematic'&&heroText){const r=hero.getBoundingClientRect(),p=clamp(-r.top/vh);heroText.style.translate=`0 ${Math.round(p*34*strength)}px`;heroText.style.scale=String(1-p*.055*strength)}
if(kind==='parallax'){document.querySelectorAll('.hero .hbox,.hero .w,.sek .bild').forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=clamp((vh*.5-(r.top+r.height*.5))/vh,-1,1);el.style.translate=`0 ${Math.round(p*(mobile.matches?14:48)*strength)}px`;});}}
function schedule(){if(!raf)raf=requestAnimationFrame(tick)}
function pointer(e){if(!enabled||kind!=='spatial'||mobile.matches||e.pointerType!=='mouse')return;const card=e.target.closest('.kachel');if(!card)return;const r=card.getBoundingClientRect();const x=clamp((e.clientX-r.left)/r.width,-.1,1.1)-.5,y=clamp((e.clientY-r.top)/r.height,-.1,1.1)-.5;card.style.transform=`perspective(850px) rotateX(${-y*13*strength}deg) rotateY(${x*15*strength}deg) translateZ(${12*strength}px)`;}
function pointerOut(e){const c=e.target.closest('.kachel');if(c&&kind==='spatial')c.style.removeProperty('transform')}
function setup(){reset();enabled=permitted();if(!enabled)return;document.body.classList.add('fx-active','fx-'+kind);if(kind==='reveal'&&'IntersectionObserver'in window){const els=[...document.querySelectorAll('.sek,.sek .kachel')];io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('fx-wait');e.target.classList.add('fx-seen');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px 70px 0px'});els.forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight){el.classList.add('fx-seen')}else{el.classList.add('fx-wait');io.observe(el)}})}schedule()}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerout',pointerOut,{passive:true});if(media.addEventListener)media.addEventListener('change',setup);if(mobile.addEventListener)mobile.addEventListener('change',setup);setup();
window.__pagerushFxStatus=()=>({enabled,kind,intensity:strength*100,reducedMotion:media.matches,mobile:mobile.matches});
})();