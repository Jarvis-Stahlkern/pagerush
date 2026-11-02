(()=>{'use strict';
const cfg=window.__PAGERUSH_FX||{};
if(!cfg.enabled||cfg.kind!=='spatial'||Number(cfg.intensity)<=0||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const hero=document.querySelector('.hero');if(!hero||!window.THREE)return;
let coarse=matchMedia('(pointer:coarse), (max-width:700px)').matches;
const strength=Math.min(1,Math.max(0,Number(cfg.intensity)/100));
const sceneType=cfg.motif||'architecture';
const speed=({slow:.3,normal:.65,still:0})[cfg.speed]??.3;
const holder=document.createElement('div');holder.className='pr-spatial-stage';holder.setAttribute('aria-hidden','true');
const style=document.createElement('style');style.textContent=`
.hero{position:relative;isolation:isolate}.pr-spatial-stage{position:relative;width:min(100%,680px);height:420px;margin:40px auto;overflow:hidden;pointer-events:none;z-index:1;flex:none;grid-column:1/-1}
.pr-spatial-stage canvas{display:block;width:100%;height:100%}
@media(max-width:700px),(pointer:coarse){.pr-spatial-stage{width:100%;height:300px;margin:24px auto 0}}
@media(prefers-reduced-motion:reduce){.pr-spatial-stage{display:none}}
`;document.head.appendChild(style);hero.insertAdjacentElement('afterend',holder);

let renderer,scene,camera,group,clock=0,raf=0,visible=true,disposed=false,progress=0,mouseX=0,mouseY=0,frames=0,fitDistance=10,lastTime=0,scrollTarget=0;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mat=(color,metalness=.2,roughness=.4)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
function mesh(geo,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m}
function architecture(){const stone=mat(0xd4d0c8,.05,.85),dark=mat(0x222c37,.42,.18),gold=mat(0xc9a971,.7,.25);
mesh(new THREE.BoxGeometry(3.4,2.5,1.8),stone,group,0,-.25,0);
mesh(new THREE.BoxGeometry(2.5,1.3,2.35),stone,group,.6,1.55,.1);
for(let y=-.75;y<2.1;y+=.72)for(let x=-1.25;x<1.4;x+=.8){mesh(new THREE.BoxGeometry(.58,.51,.04),dark,group,x,y,1.19);mesh(new THREE.BoxGeometry(.04,.57,.1),gold,group,x-.3,y,1.25)}
mesh(new THREE.BoxGeometry(5.1,.12,3.5),stone,group,0,-1.56,0);
}
function bottle(){const glass=mat(0x38524c,.5,.16),label=mat(0xf0e7d6,.04,.7),cap=mat(0xd6b57d,.86,.19);
mesh(new THREE.CylinderGeometry(.75,.78,2.65,48),glass,group,0,-.1,0);
mesh(new THREE.CylinderGeometry(.34,.5,.55,48),glass,group,0,1.5,0);
mesh(new THREE.CylinderGeometry(.38,.38,.4,48),cap,group,0,1.95,0);
mesh(new THREE.CylinderGeometry(.785,.785,1.1,48,1,true),label,group,0,-.28,0);
for(let i=0;i<8;i++){const a=i*Math.PI*2/8;const m=mesh(new THREE.SphereGeometry(.1+(i%3)*.05,12,8),cap,group,Math.cos(a)*1.6,Math.sin(a*1.4)*1.1,Math.sin(a)*1.1);m.userData.float=i;}
}
function burger(){const bun=mat(0xe4a65b,.05,.66),patty=mat(0x5e2b1f,.03,.85),leaf=mat(0x68a04c,.02,.7),cheese=mat(0xf2c34a,.06,.55),tomato=mat(0xb73f2c,.03,.64);
const layers=[{r:1.35,h:.44,y:1.4,m:bun},{r:1.3,h:.12,y:.62,m:leaf},{r:1.18,h:.19,y:.12,m:tomato},{r:1.3,h:.15,y:-.35,m:cheese},{r:1.25,h:.38,y:-.85,m:patty},{r:1.28,h:.34,y:-1.45,m:bun}];
for(const [i,l] of layers.entries()){const obj=mesh(i===0?new THREE.SphereGeometry(l.r,48,24,0,Math.PI*2,0,Math.PI/2):new THREE.CylinderGeometry(l.r,l.r,l.h,48),l.m,group,0,l.y,0);if(i===0)obj.scale.y=.48;obj.userData.layer=i;}
}
function salon(){const bronze=mat(0xa58b60,.8,.23),silver=mat(0xc6c8cc,.95,.2),amber=mat(0x514027,.3,.23);
mesh(new THREE.CylinderGeometry(.72,.72,2.3,40),amber,group,0,-.15,0);mesh(new THREE.CylinderGeometry(.31,.31,.55,32),bronze,group,0,1.3,0);
const scissors=new THREE.Group();scissors.position.set(1.5,.2,.7);scissors.rotation.z=-.3;group.add(scissors);
for(const s of [-1,1]){const arm=new THREE.Group();scissors.add(arm);arm.rotation.z=s*.3;mesh(new THREE.BoxGeometry(.1,2,.06),silver,arm,s*.12,.9,0);mesh(new THREE.TorusGeometry(.25,.055,10,28),silver,arm,s*.23,-.32,0)}
}
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.outputEncoding=THREE.sRGBEncoding;holder.appendChild(renderer.domElement);
scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,.2,10);
scene.add(new THREE.HemisphereLight(0xffffff,0x283244,2.3));const key=new THREE.DirectionalLight(0xffe6c4,2.9);key.position.set(-3,5,7);scene.add(key);const rim=new THREE.DirectionalLight(0x8e9bff,2);rim.position.set(5,2,-4);scene.add(rim);
group=new THREE.Group();scene.add(group);({architecture,bottle,burger,salon}[sceneType]||architecture)();
}catch(err){console.warn('Pagerush spatial fallback:',err);holder.remove();return;}
function resize(){coarse=matchMedia('(pointer:coarse), (max-width:700px)').matches;const r=holder.getBoundingClientRect();const w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();group.scale.setScalar(1);group.position.x=0;group.rotation.set(0,0,0);group.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(group);const sphere=box.getBoundingSphere(new THREE.Sphere());const fov=THREE.MathUtils.degToRad(camera.fov);const horizontal=2*Math.atan(Math.tan(fov/2)*camera.aspect);fitDistance=sphere.radius/Math.sin(Math.min(fov,horizontal)/2)*1.22;camera.position.set(0,.2,fitDistance);}

function render(now=performance.now()){raf=0;if(disposed||!visible||document.hidden){lastTime=0;return;}const dt=Math.min(.05,Math.max(0,(now-(lastTime||now))/1000));lastTime=now;clock+=dt*speed;progress+=(scrollTarget-progress)*(1-Math.exp(-dt*4));frames++;group.rotation.y=mouseX*.23*strength+progress*1.45*strength+Math.sin(clock*.4)*.06*strength;group.rotation.x=mouseY*.13*strength+progress*.12*strength;group.position.y=Math.sin(clock*.8)*.08*strength;camera.position.z=fitDistance;
if(sceneType==='burger')group.children.forEach(o=>{if(o.userData.layer!==undefined){const i=o.userData.layer;o.position.y=[1.4,.62,.12,-.35,-.85,-1.45][i]+Math.sin(clock*.55+i*.5)*.03+(i-2.5)*progress*.2*strength;}});
renderer.render(scene,camera);raf=requestAnimationFrame(render)}
function updateScroll(){const r=holder.getBoundingClientRect();scrollTarget=clamp((innerHeight-r.top)/Math.max(1,innerHeight+r.height));}
const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(render);else if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0});observer.observe(holder);
function onMove(e){if(coarse)return;mouseX=clamp(e.clientX/innerWidth*2-1,-1,1);mouseY=clamp(e.clientY/innerHeight*2-1,-1,1)}
function resume(){if(!disposed&&!document.hidden&&visible&&!raf)raf=requestAnimationFrame(render)}
document.addEventListener('visibilitychange',resume);addEventListener('pageshow',resume);const ro=new ResizeObserver(resize);ro.observe(holder);
addEventListener('pointermove',onMove,{passive:true});addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',resize,{passive:true});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');function onReduced(){if(reduced.matches){disposed=true;cancelAnimationFrame(raf);observer.disconnect();holder.remove();ro.disconnect();renderer.dispose();}}
if(reduced.addEventListener)reduced.addEventListener('change',onReduced);
resize();updateScroll();render();window.__pagerushSpatialStatus=()=>({webgl:true,motif:sceneType,intensity:strength*100,coarse,progress,frames,speed:cfg.speed||'slow',scrollTarget,technicalDraft:true});
})();