/* Pagerush v3 (02.11.2026): Sternenhimmel mit Tiefe, Sternschnuppen und Glas-Lichtern über dem Farbverlauf + Domain-Check mit Vorschlägen */
(() => {
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Sternenhimmel ----------
const cv = document.getElementById('sterne');
if (cv && !ruhig) {
 const c = cv.getContext('2d');
 let w = 0, h = 0, dpr = 1, laeuft = true, sy = 0, last = 0;
 const THUMBS = ['fertighaus', 'luce', 'mira', 'kraemer', 'sonnenkorn', 'physio', 'nordlicht', 'lena'].map(n => { const im = new Image(); im.src = 'neu/glas/seite-' + n + '.jpg'; return im; });
 let sterne = [], kugeln = [], schnuppen = [], fenster = [], naechste = 1800;
 const zufall = (a, b) => a + Math.random() * (b - a);
 function aufbau() {
  dpr = Math.min(2, devicePixelRatio || 1); w = innerWidth; h = innerHeight;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.round(Math.min(190, w * h / 8000));
  sterne = Array.from({ length: n }, () => { const z = Math.random(); return { x: Math.random() * w, y: Math.random() * h * 3, z, r: .4 + z * 1.3, p: Math.random() * 6.3, v: zufall(.6, 2.2), f: Math.random() < .18 ? (Math.random() < .5 ? '255,180,230' : '170,200,255') : '255,255,255' }; });
  fenster = Array.from({ length: w < 760 ? 6 : 14 }, (_, k) => ({ img: k % THUMBS.length, x: (k % 2 ? w * zufall(.86, .95) : w * zufall(-.05, .04)), y: Math.random() * h * 2.4, z: zufall(.35, 1), b: zufall(110, 180), p: Math.random() * 6.3, f: ['255,143,208', '197,139,255', '127,166,255', '143,240,255'][k % 4], z2: Math.random() < .5 ? 1 : 0 }));
  kugeln = Array.from({ length: w < 760 ? 7 : 13 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: zufall(18, 70), vy: zufall(.05, .18), vx: zufall(-.06, .06), p: Math.random() * 6.3, f: ['255,143,208', '197,139,255', '127,166,255', '143,240,255'][Math.floor(Math.random() * 4)] }));
 }
 function schnuppe() {
  const links = Math.random() < .5;
  schnuppen.push({ x: links ? zufall(-50, w * .4) : zufall(w * .6, w + 50), y: zufall(-20, h * .45), vx: (links ? 1 : -1) * zufall(9, 14), vy: zufall(3, 5.5), t: 0, d: zufall(55, 80) });
 }
  let halb = false;
 function bild(now) {
  if (!laeuft) return;
  halb = !halb; if (halb) { requestAnimationFrame(bild); return; } // 30 Bilder/s reichen für den Himmel
  const dt = last ? Math.min(50, now - last) : 16; last = now;
  sy += (scrollY - sy) * .12;
  c.clearRect(0, 0, w, h);
  // Sterne: drei Tiefen, ziehen beim Scrollen unterschiedlich schnell (Parallaxe) und funkeln
  for (const s of sterne) {
   const y = ((s.y - sy * (.08 + s.z * .35)) % (h * 3) + h * 3) % (h * 3); if (y > h) continue;
   const a = (.35 + .65 * (.5 + .5 * Math.sin(now * .001 * s.v + s.p))) * (.35 + s.z * .65);
   c.fillStyle = `rgba(${s.f},${a.toFixed(3)})`; c.beginPath(); c.arc(s.x, y, s.r, 0, 6.283); c.fill();
   if (s.z > .9 && a > .75) { c.strokeStyle = `rgba(${s.f},${(a * .35).toFixed(3)})`; c.lineWidth = .6; c.beginPath(); c.moveTo(s.x - 5, y); c.lineTo(s.x + 5, y); c.moveTo(s.x, y - 5); c.lineTo(s.x, y + 5); c.stroke(); }
  }
  // Glas-Lichter: weiche Kugeln mit Rand, steigen langsam auf
  for (const k of kugeln) {
   k.y -= k.vy * dt * .06; k.x += k.vx * dt * .06 + Math.sin(now * .0004 + k.p) * .08;
   if (k.y < -k.r * 2) { k.y = h + k.r * 2; k.x = Math.random() * w; }
   const y = k.y - (sy * .12) % (h + k.r * 4);
   const yy = ((y + k.r * 2) % (h + k.r * 4) + (h + k.r * 4)) % (h + k.r * 4) - k.r * 2;
   const g = c.createRadialGradient(k.x - k.r * .3, yy - k.r * .3, 0, k.x, yy, k.r);
   g.addColorStop(0, `rgba(${k.f},.16)`); g.addColorStop(.7, `rgba(${k.f},.05)`); g.addColorStop(1, `rgba(${k.f},0)`);
   c.fillStyle = g; c.beginPath(); c.arc(k.x, yy, k.r, 0, 6.283); c.fill();
   c.strokeStyle = `rgba(255,255,255,.10)`; c.lineWidth = 1; c.beginPath(); c.arc(k.x, yy, k.r * .92, 3.6, 5.2); c.stroke();
  }
  // Lichtbänder: fließende Wellen quer über die Seite, reagieren aufs Scrollen
  c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let k = 0; k < 3; k++) {
   const cols = ['255,111,181', '125,140,255', '143,240,255'][k], y0 = h * (.28 + k * .25) + Math.sin(sy * .0015 + k) * 60, amp = 46 + k * 18;
   const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, `rgba(${cols},0)`); g.addColorStop(.5, `rgba(${cols},.22)`); g.addColorStop(1, `rgba(${cols},0)`);
   c.strokeStyle = g; c.lineWidth = 2 + k; c.beginPath();
   for (let x = -10; x <= w + 10; x += 14) { const y = y0 + Math.sin(x * .004 + now * .0007 * (1 + k * .3) + k * 2 + sy * .002) * amp + Math.sin(x * .011 - now * .0011 + k) * amp * .35; x < 0 ? c.moveTo(x, y) : c.lineTo(x, y); }
   c.stroke();
  }
  c.globalCompositeOperation = 'source-over';
  // Schwebende Mini-Fenster mit echten Seiten (Pagerush-Beispiele), scrollen langsam von selbst, gehen beim Scrollen mit
  for (const f of fenster) {
   const im = THUMBS[f.img]; if (!im.complete || !im.naturalWidth) continue;
   let fq = 0, fa = 1; if (f.fl) { fq = (now - f.fl) / 1000; if (fq >= 2.9) f.fl = 0; else if (fq >= 1.1) { fa = fq < 2.1 ? 0 : (fq - 2.1) / .8; fq = fq < 2.1 ? 1.1 : 0; } }
   f.hit = null;
   const y = ((f.y - sy * (.2 + f.z * .5)) % (h * 2.4) + h * 2.4) % (h * 2.4) - h * .2; if (y < -260 || y > h + 60) continue;
   const bw = f.b * f.z, bh = bw * .64, bar = Math.max(7, bw * .06), a = (.22 + f.z * .3) * (fq > 0 ? Math.max(0, 1 - fq / 1.1) : fa), rr = 6 + 6 * f.z, fe = Math.min(1, fq / 1.1), fe2 = fe * fe * (3 - 2 * fe), x = f.x + Math.sin(now * .0004 + f.p) * 16 * f.z + (f.fdir || 1) * fe2 * w * .35, yy = y - fe2 * h * .25, sc = 1 + fe2 * .6, fr = fe2 * (f.fdir || 1) * .9;
   f.hit = { x: x + bw / 2, y: yy + bh / 2, w: bw, h: bh };
   const sw = im.naturalWidth, shh = (bh - bar) / bw * sw, off = (.5 - .5 * Math.cos(now * .00035 + f.p)) * Math.max(0, im.naturalHeight - shh);
   c.save(); c.globalAlpha = a; c.translate(x + bw / 2, yy + bh / 2); c.scale(sc, sc); c.rotate(Math.sin(now * .0003 + f.p) * .06 + (f.z2 ? .07 : -.07) + fr);
   c.beginPath(); c.roundRect(-bw / 2, -bh / 2, bw, bh, rr); c.fillStyle = 'rgba(30,20,60,.9)'; c.fill(); c.clip();
   c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(-bw / 2, -bh / 2, bw, bar);
   c.fillStyle = 'rgba(255,255,255,.7)'; for (let q = 0; q < 3; q++) { c.beginPath(); c.arc(-bw / 2 + bar * .6 + q * bar * .55, -bh / 2 + bar / 2, bar * .17, 0, 6.283); c.fill(); }
   c.drawImage(im, 0, off, sw, shh, -bw / 2, -bh / 2 + bar, bw, bh - bar);
   const g = c.createLinearGradient(-bw / 2, -bh / 2, bw / 2, bh / 2); g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.4, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(-bw / 2, -bh / 2, bw, bh);
   c.restore();
   c.save(); c.globalAlpha = Math.min(1, a + .15 * (a > 0 ? 1 : 0)); c.translate(x + bw / 2, yy + bh / 2); c.scale(sc, sc); c.rotate(Math.sin(now * .0003 + f.p) * .06 + (f.z2 ? .07 : -.07) + fr);
   c.beginPath(); c.roundRect(-bw / 2, -bh / 2, bw, bh, rr); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.2; c.stroke(); c.restore();
  }
  // Sternschnuppen
  naechste -= dt; if (naechste < 0) { schnuppe(); naechste = zufall(2600, 6500); }
  schnuppen = schnuppen.filter(s => s.t < s.d);
  for (const s of schnuppen) {
   s.t += dt / 16; s.x += s.vx * dt / 16; s.y += s.vy * dt / 16;
   const a = Math.sin(Math.PI * s.t / s.d), lx = s.x - s.vx * 9, ly = s.y - s.vy * 9;
   const g = c.createLinearGradient(lx, ly, s.x, s.y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,255,255,${(.9 * a).toFixed(3)})`);
   c.strokeStyle = g; c.lineWidth = 1.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(lx, ly); c.lineTo(s.x, s.y); c.stroke();
   c.fillStyle = `rgba(255,240,255,${a.toFixed(3)})`; c.beginPath(); c.arc(s.x, s.y, 1.8, 0, 6.283); c.fill();
  }
  requestAnimationFrame(bild);
 }
 // Mini-Fenster: Berührt man sie (Maus drüber oder Fingertipp), fliegen sie weg und kommen später leise zurück
 function treffer(e) {
  if (e.target.closest && e.target.closest('input,textarea,select,button,a,iframe,.studio')) return;
  for (const f of fenster) { const h = f.hit; if (!h || f.fl) continue;
   if (Math.abs(e.clientX - h.x) < h.w / 2 + 6 && Math.abs(e.clientY - h.y) < h.h / 2 + 6) { f.fl = performance.now(); f.fdir = e.clientX < h.x ? 1 : -1; } }
 }
 addEventListener('pointermove', e => { if (e.pointerType === 'mouse') treffer(e); }, { passive: true });
 addEventListener('pointerdown', treffer, { passive: true });
 // iPhone/iPad: auch beim Wischen mit dem Finger über ein Fenster (Safari bricht pointermove beim Scrollen ab)
 const fing = e => { for (const t of e.touches) treffer({ target: e.target, clientX: t.clientX, clientY: t.clientY }); };
 addEventListener('touchstart', fing, { passive: true }); addEventListener('touchmove', fing, { passive: true });
 aufbau(); addEventListener('resize', aufbau);
 document.addEventListener('visibilitychange', () => { laeuft = !document.hidden; last = 0; if (laeuft) requestAnimationFrame(bild); });
 requestAnimationFrame(bild);
}

// ---------- Domain-Check ----------
const box = document.getElementById('domCheck'); if (!box) return;
const $ = id => document.getElementById(id), name = $('dcName'), end = $('dcEnd'), erg = $('dcErg'), form = $('dcForm');
const sauber = s => s.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
 .replace(/\s+/g, '-').replace(/[^a-z0-9.-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
const ENDUNGEN = ['de', 'com', 'eu', 'online', 'shop', 'info', 'net'];
async function frage(url, kopf) { const r = await fetch(url, { headers: kopf || {} }); if (!r.ok) throw 0; return r.json(); }
// Status über das öffentliche DNS: keine Einträge (NXDOMAIN) = noch nicht registriert
async function pruefe(d) {
 const q = encodeURIComponent(d);
 let j;
 try { j = await frage('https://dns.google/resolve?name=' + q + '&type=NS'); }
 catch (_) { try { j = await frage('https://cloudflare-dns.com/dns-query?name=' + q + '&type=NS', { accept: 'application/dns-json' }); } catch (__) { return 'unklar'; } }
 if (j.Status === 3) return 'frei';
 if (j.Status === 0) return 'weg';
 return 'unklar';
}
const strato = d => 'https://www.strato.de/domains/domain-check/?domain=' + encodeURIComponent(d);
const ionos = d => 'https://www.ionos.de/domains/domain-check?domain=' + encodeURIComponent(d);
const TEXT = { frei: 'frei', weg: 'vergeben', unklar: 'nicht prüfbar', laeuft: 'prüfe' };
function zeile(d, st, n) {
 const links = st === 'weg' ? '' : `<span class="dc-links"><a href="${strato(d)}" target="_blank" rel="noopener" data-d="${d}">bei Strato</a><a href="${ionos(d)}" target="_blank" rel="noopener" data-d="${d}">bei IONOS</a></span>`;
 return `<div class="dc-r ${st}" style="--n:${n}"><b>${d}</b><span class="dc-s">${TEXT[st]}</span>${links}</div>`;
}
function vorschlaege(basis, endung) {
 const ort = sauber(($('kdOrt') && $('kdOrt').value || '').replace(/^\d+\s*/, '')).split('.')[0];
 const v = [];
 ENDUNGEN.filter(e => e !== endung).forEach(e => v.push(basis + '.' + e));
 [basis + '-online', 'mein-' + basis, basis + '24', 'team-' + basis, basis + '-service'].forEach(b => v.push(b + '.' + endung));
 if (ort && !basis.includes(ort)) v.unshift(basis + '-' + ort + '.' + endung);
 return [...new Set(v)].filter(x => x.split('.')[0].length <= 63);
}
let lauf = 0;
async function los(e) {
 if (e) e.preventDefault();
 let roh = sauber(name.value); if (!roh) { name.focus(); return; }
 let basis = roh, endung = end.value.replace('.', '');
 const punkt = roh.lastIndexOf('.');
 if (punkt > 0) { const e2 = roh.slice(punkt + 1); basis = roh.slice(0, punkt).replace(/\./g, '-'); if (/^[a-z]{2,10}$/.test(e2)) { endung = e2; if ([...end.options].some(o => o.value === '.' + e2)) end.value = '.' + e2; } }
 if (!basis) return;
 name.value = basis;
 const nr = ++lauf, wunsch = basis + '.' + endung;
 erg.innerHTML = zeile(wunsch, 'laeuft', 0);
 const st = await pruefe(wunsch); if (nr !== lauf) return;
 const liste = vorschlaege(basis, endung);
 const res = await Promise.all(liste.map(d => pruefe(d).then(s => [d, s]))); if (nr !== lauf) return;
 const frei = res.filter(r => r[1] === 'frei').slice(0, 6);
 let h = zeile(wunsch, st, 0);
 if (st === 'weg') h += `<p class="dc-titel">${wunsch} ist leider nicht frei – diese wären frei:</p>`;
 else if (st === 'frei') h += `<p class="dc-titel">Gut zu wissen – diese wären auch noch frei:</p>`;
 else h += `<p class="dc-titel">Diese Varianten sind frei:</p>`;
 h += frei.length ? frei.map((r, i) => zeile(r[0], 'frei', i + 1)).join('') : `<p class="dc-hinweis">Gerade keine freie Variante gefunden – probier einen anderen Namen.</p>`;
 erg.innerHTML = h;
 const wd = $('kdDom'); if (wd && !wd.value && st === 'frei') wd.value = wunsch;
}
form.addEventListener('submit', los);
// Beim Klick auf Strato/IONOS den Namen mitkopieren, damit man ihn dort nur einfügen muss
erg.addEventListener('click', ev => {
 const a = ev.target.closest('a[data-d]'); if (!a) return;
 try { navigator.clipboard && navigator.clipboard.writeText(a.dataset.d); } catch (_) {}
 const t = document.createElement('div'); t.className = 'dc-kopiert'; t.textContent = a.dataset.d + ' kopiert – beim Anbieter einfach einfügen'; document.body.append(t); setTimeout(() => t.remove(), 2600);
});
// Platzhalter tippt Beispiele, solange das Feld leer ist
const BSP = ['deinsalon', 'mueller-bau', 'pizzeria-roma', 'physio-lena', 'deinname'];
let bi = 0, ci = 0, weg = false;
(function tipp() {
 if (document.activeElement !== name && !name.value) {
  const w = BSP[bi];
  if (!weg) { ci++; if (ci >= w.length) { weg = true; name.placeholder = w; return setTimeout(tipp, 1800); } }
  else { ci--; if (ci <= 0) { weg = false; bi = (bi + 1) % BSP.length; } }
  name.placeholder = w.slice(0, ci) || ' ';
 }
 setTimeout(tipp, weg ? 45 : 100);
})();
})();
