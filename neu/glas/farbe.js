/* Pagerush – Farbverlauf-Design (02.11.2026): Aurora-Hintergrund, Preis-Glas, Schritte-Linie, Domain-Schreibmaschine */
(() => {
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const kl = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
const ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
// Farbstimmungen entlang der Seite: oben Purple/Blau, Mitte Blau/Türkis, unten Rosa/Lila
const STIMMUNG = [
 { g: '#120a2c', f: ['#6a2cff', '#2357ff', '#ff4fa3', '#b13cff', '#3a1cff'] },
 { g: '#0b1236', f: ['#2357ff', '#22b8ff', '#8b3dff', '#ff5fae', '#5a2bff'] },
 { g: '#1a0a33', f: ['#ff4fa3', '#b13cff', '#2a3bd8', '#ff3ccf', '#7a2bff'] },
 { g: '#140a30', f: ['#9b3dff', '#3d6bff', '#ff6fb5', '#c04dff', '#2d8bff'] }
].map(s => ({ g: hex(s.g), f: s.f.map(hex) }));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const cv = document.getElementById('aurora');
if (cv && !ruhig) {
 const c = cv.getContext('2d');
 let w = 0, h = 0, sAkt = 0, start = performance.now(), laeuft = true;
 const groesse = () => { w = cv.width = Math.max(80, Math.round(innerWidth / 7)); h = cv.height = Math.max(60, Math.round(innerHeight / 7)); };
 const B = [ // Grundposition, Bewegung, Größe
  { x: .2, y: .25, ax: .18, ay: .12, s: .55, v: .00011, p: 0 },
  { x: .8, y: .2, ax: .14, ay: .16, s: .5, v: .00009, p: 1.7 },
  { x: .65, y: .8, ax: .2, ay: .1, s: .6, v: .00013, p: 3.1 },
  { x: .15, y: .78, ax: .12, ay: .14, s: .48, v: .0001, p: 4.4 },
  { x: .5, y: .5, ax: .22, ay: .2, s: .42, v: .00015, p: 5.6 }
 ];
 function bild(now) {
  if (!laeuft) return;
  const max = document.documentElement.scrollHeight - innerHeight || 1, sZiel = scrollY / max;
  sAkt += (sZiel - sAkt) * .06;
  const pos = sAkt * (STIMMUNG.length - 1), i = Math.min(STIMMUNG.length - 2, Math.floor(pos)), t = ez(pos - i);
  const A = STIMMUNG[i], Z = STIMMUNG[i + 1], t0 = now - start;
  const g = mix(A.g, Z.g, t);
  c.globalCompositeOperation = 'source-over'; c.fillStyle = `rgb(${g})`; c.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'lighter';
  B.forEach((b, k) => {
   const f = mix(A.f[k], Z.f[k], t);
   const x = (b.x + Math.sin(t0 * b.v * 6 + b.p) * b.ax + Math.sin(sAkt * 6.3 + k) * .08) * w;
   const y = (b.y + Math.cos(t0 * b.v * 5 + b.p) * b.ay - (sAkt - .5) * .25 * (k % 2 ? 1 : -1)) * h;
   const r = b.s * Math.max(w, h) * (1 + Math.sin(t0 * .0004 + k) * .12);
   const gr = c.createRadialGradient(x, y, 0, x, y, r);
   gr.addColorStop(0, `rgba(${f},.62)`); gr.addColorStop(.45, `rgba(${f},.24)`); gr.addColorStop(1, `rgba(${f},0)`);
   c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  // leichte Abdunklung oben/unten, damit Schrift lesbar bleibt
  c.globalCompositeOperation = 'source-over';
  const v = c.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(8,4,20,0)'); v.addColorStop(.5, 'rgba(8,4,20,0)'); v.addColorStop(1, 'rgba(8,4,20,.4)');
  c.fillStyle = v; c.fillRect(0, 0, w, h);
  requestAnimationFrame(bild);
 }
 groesse(); addEventListener('resize', groesse);
 document.addEventListener('visibilitychange', () => { laeuft = !document.hidden; if (laeuft) requestAnimationFrame(bild); });
 requestAnimationFrame(bild);
}

// Preis: Glasplatte dreht sich ein, Lichtkante wandert, Texte wischen von den Seiten rein
const pr = document.getElementById('preis');
const platte = pr && pr.querySelector('.preis-platte'), L = pr && pr.querySelector('.preis-seite.l'), Rr = pr && pr.querySelector('.preis-seite.r'), K = pr && pr.querySelector('.preis-knopf'), gl = pr && pr.querySelector('.preis-glanz'), gv = pr && pr.querySelector('.gravur');
let mx = 0, my = 0, amx = 0, amy = 0;
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; } }, { passive: true });
// Drei Schritte: Verbindungslinie wächst mit
const sp = document.querySelector('.spalten');
function lauf() {
 amx += (mx - amx) * .08; amy += (my - amy) * .08;
 if (sp) { const r = sp.getBoundingClientRect(); sp.style.setProperty('--linie', kl(innerHeight - r.top, innerHeight * .35, innerHeight * .95).toFixed(3)); }
 if (platte && innerWidth > 900) {
  const r = pr.getBoundingClientRect(), p = ruhig ? .6 : kl(-r.top, -innerHeight * .6, pr.offsetHeight - innerHeight);
  const rein = ez(kl(p, 0, .4));
  const ry = (1 - rein) * -70 + Math.sin(p * Math.PI * 2) * 8 + amx * 14, rx = (1 - rein) * 25 + amy * -10;
  platte.style.transform = `translateY(${((1 - rein) * 30).toFixed(2)}vh) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(${(.72 + .28 * rein).toFixed(3)})`;
  gl.style.setProperty('--gx', (-60 + p * 200).toFixed(1) + '%');
  gv.style.setProperty('--lp', (p * 100).toFixed(1) + '%');
  const a = ez(kl(p, .35, .6)), b = ez(kl(p, .45, .7)), c2 = ez(kl(p, .6, .8));
  L.style.opacity = a; L.style.transform = `translate(${((1 - a) * -160).toFixed(1)}px,-50%)`;
  Rr.style.opacity = b; Rr.style.transform = `translate(${((1 - b) * 160).toFixed(1)}px,-50%)`;
  K.style.opacity = c2; K.style.transform = `translateY(${((1 - c2) * 40).toFixed(1)}px)`;
 } else if (platte) { platte.style.transform = `rotateY(${(amx * 10).toFixed(2)}deg)`; }
 requestAnimationFrame(lauf);
}
requestAnimationFrame(lauf);

// Domain: Adresse tippt sich selbst
const tipp = document.querySelector('.dom-adresse .tipp');
if (tipp) {
 const W = ['deinsalon', 'mueller-bau', 'pizzeria-roma', 'physio-lena', 'deinname'];
 let wi = 0, ci = 0, weg = false;
 (function schreib() {
  const wort = W[wi];
  if (!weg) { ci++; tipp.textContent = wort.slice(0, ci); if (ci === wort.length) { weg = true; return setTimeout(schreib, 1700); } }
  else { ci--; tipp.textContent = wort.slice(0, ci); if (ci === 0) { weg = false; wi = (wi + 1) % W.length; } }
  setTimeout(schreib, weg ? 45 : 95);
 })();
}
})();
