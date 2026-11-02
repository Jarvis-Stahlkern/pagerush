/* Pagerush – Runde 2 (02.11.2026): Logo-Intro + Mitziehen, lebendige Überschriften, 99-€-Münze, Bild-Upload */
(() => {
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const kl = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
const ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const $ = s => document.querySelector(s);

// Überschriften in Wörter teilen (Text, <em>, <br> bleiben erhalten)
let wn = 0;
function teile(el) {
 [...el.childNodes].forEach(n => {
  if (n.nodeType === 3) {
   const f = document.createDocumentFragment();
   n.textContent.split(/(\s+)/).forEach(w => {
    if (!w) return;
    if (/^\s+$/.test(w)) { f.append(' '); return; }
    const a = document.createElement('span'), b = document.createElement('span');
    a.className = 'wd'; b.className = 'wi'; b.style.setProperty('--i', wn++); b.textContent = w; a.append(b); f.append(a);
   });
   n.replaceWith(f);
  } else if (n.nodeType === 1 && n.tagName !== 'BR' && !n.classList.contains('licht')) teile(n);
 });
}
const kopfzeilen = [...document.querySelectorAll('section h2, .preis-seite h3, .sp h3')].filter(h => !h.closest('.glas'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('an'); io.unobserve(e.target); } }), { threshold: .25 });
kopfzeilen.forEach(h => { wn = 0; teile(h); h.classList.add('split'); io.observe(h); });

// Logo
const lm = $('#logoMit'), glas = $('#glas'), kopfLogo = $('.kopf .wort img'), preis = $('#preis'), fuss = $('.fuss');
let altY = scrollY, v = 0, zug = 0, kipp = 0;
function logo(t) {
 if (!lm || !glas) return;
 const g = window.__glas, gr = glas.getBoundingClientRect();
 const p = g ? g.akt : kl(-gr.top, 0, glas.offsetHeight - innerHeight);
 const hinten = ez(kl(p, .045, .17));                 // 0 = vorn, 1 = Hintergrund-Schirm
 const nachGlas = kl(-gr.bottom + innerHeight, 0, innerHeight * .8); // nach dem Karussell
 // Mitziehen: Logo hängt der Scroll-Bewegung leicht hinterher und kippt
 const dy = scrollY - altY; altY = scrollY; v += (dy - v) * .12;
 zug += (Math.max(-90, Math.min(90, -v * 3)) - zug) * .1; kipp += (Math.max(-18, Math.min(18, v * .5)) - kipp) * .1;
 let sk = 1 - .5 * hinten, op = 1 - .45 * hinten, bl = 1.6 * hinten, farbe = .2 + .7 * hinten, schein = .45 + .5 * hinten;
 if (nachGlas > 0) { sk -= .2 * nachGlas; op = op - (op - .2) * nachGlas; bl += 1.4 * nachGlas; }
 if (preis) { const r = preis.getBoundingClientRect(), imPreis = kl(innerHeight - r.top, innerHeight * .2, innerHeight * .8) * (1 - kl(-r.bottom + innerHeight, 0, innerHeight * .5)); op *= 1 - .7 * imPreis; }
 if (fuss) { const r = fuss.getBoundingClientRect(); op *= 1 - .6 * kl(innerHeight - r.top, 0, r.height); }
 const atem = ruhig ? 0 : Math.sin(t * .0007) * .015;
 const wy = ruhig ? 0 : Math.sin(scrollY * .0012) * 4; // schwebt beim Scrollen leicht auf und ab
 lm.style.transform = `translate(-50%,calc(-50% + ${(zug + wy * nachGlas * 10).toFixed(1)}px)) perspective(1200px) rotateX(${kipp.toFixed(2)}deg) rotateY(${(Math.sin(scrollY * .0009) * 10 * nachGlas).toFixed(2)}deg) scale(${(sk + atem).toFixed(4)})`;
 lm.style.opacity = op.toFixed(3); // keine Unschärfe pro Bild mehr (zu teuer)
 lm.style.setProperty('--farbe', farbe.toFixed(3)); lm.style.setProperty('--schein', schein.toFixed(3));
 if (kopfLogo) kopfLogo.style.opacity = gr.bottom > 0 ? kl(p, .14, .2).toFixed(3) : 1;
}

// Gewicht der Überschriften atmet: in der Bildschirmmitte am kräftigsten
function gewicht() {
 const m = innerHeight / 2;
 kopfzeilen.forEach(h => {
  const r = h.getBoundingClientRect(); if (r.bottom < -50 || r.top > innerHeight + 50) return;
  const d = Math.min(1, Math.abs(r.top + r.height / 2 - m) / m);
  h.style.setProperty('--wg', Math.round(800 - 340 * d * d));
 });
}

// 99 €: runde Glasmünze dreht sich um die eigene Achse, Schriftring kreist
const mz = $('#muenze'), ring = $('.muenze-ring'), buehne = $('.muenze-buehne');
const L = preis && preis.querySelector('.preis-seite.l'), Rr = preis && preis.querySelector('.preis-seite.r'), K = preis && preis.querySelector('.preis-knopf');
const vorn = mz && mz.querySelector('.m-vorn'), hinten = mz && mz.querySelector('.m-hinten');
const glanz = preis && preis.querySelector('.preis-glanz'), grav = preis && preis.querySelector('.gravur');
if (mz) { const rd = mz.querySelector('.m-rand'); for (let k = 0; k < 13; k++) { const i = document.createElement('i'); i.style.transform = `translateZ(${(-12 + k * 2).toFixed(1)}px)`; rd.append(i); } }
let mx = 0, my = 0, amx = 0, amy = 0;
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; } }, { passive: true });
function muenze(t) {
 if (!mz) return;
 amx += (mx - amx) * .08; amy += (my - amy) * .08;
 const gross = innerWidth > 900;
 let p;
 if (gross) { const r = preis.getBoundingClientRect(); p = kl(-r.top, -innerHeight * .6, preis.offsetHeight - innerHeight); }
 else { const r = buehne.getBoundingClientRect(); p = kl(innerHeight - r.top, 0, innerHeight * 1.3) * .75; }
 if (ruhig) p = .6;
 const rein = ez(kl(p, 0, .42));
 // zwei volle Umdrehungen beim Reinkommen, ruhig vorn, dann eine Runde mit Rückseite „Kein Abo“
 const ry = (1 - rein) * -720 + ez(kl(p, .74, .9)) * 360 + Math.sin(t * .0011) * 6 * rein + amx * 22;
 const rx = (1 - rein) * 24 + amy * -14 + Math.sin(t * .0009) * 3;
 const sc = .55 + .45 * rein;
 mz.style.transform = `translateY(${((1 - rein) * (gross ? 22 : 6)).toFixed(2)}vh) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
 // Vorder-/Rückseite selbst umschalten (Safari ignoriert backface-visibility bei Glas)
 const zeigtVorn = Math.cos(ry * Math.PI / 180) >= 0;
 if (vorn) { vorn.style.visibility = zeigtVorn ? 'visible' : 'hidden'; hinten.style.visibility = zeigtVorn ? 'hidden' : 'visible'; }
 if (ring) { ring.style.transform = `rotate(${(t * .006 + p * 260).toFixed(2)}deg) scale(${(.8 + .2 * rein).toFixed(3)})`; ring.style.opacity = rein.toFixed(3); }
 if (glanz) glanz.style.setProperty('--gx', (-60 + p * 200).toFixed(1) + '%');
 if (grav) grav.style.setProperty('--lp', (p * 100).toFixed(1) + '%');
 if (gross && L) {
  const a = ez(kl(p, .35, .6)), b = ez(kl(p, .45, .7)), c = ez(kl(p, .6, .8));
  L.style.opacity = a; L.style.transform = `translate(${((1 - a) * -180).toFixed(1)}px,-50%) rotate(${((1 - a) * -4).toFixed(2)}deg)`;
  Rr.style.opacity = b; Rr.style.transform = `translate(${((1 - b) * 180).toFixed(1)}px,-50%) rotate(${((1 - b) * 4).toFixed(2)}deg)`;
  K.style.opacity = c; K.style.transform = `translateY(${((1 - c) * 40).toFixed(1)}px)`;
 }
}

// Schriftgewicht nicht mehr pro Bild ändern (zwang den Browser jedes Mal zum Neu-Setzen der Überschriften → Hänger)
kopfzeilen.forEach(h => h.style.setProperty('--wg', 760));
function bild(t) { logo(t); if (!preis || preis.getBoundingClientRect().top < innerHeight * 1.5) muenze(t); requestAnimationFrame(bild); }
requestAnimationFrame(bild);

// Logo & Fotos hochladen: verkleinern, Vorschau, an das Studio weitergeben
const inp = $('#kdBilder'), box = $('#bauUpload'), th = $('#bauThumbs');
window.__bauBilder = [];
function zeige() {
 th.innerHTML = window.__bauBilder.map((u, i) => `<figure><img src="${u}" alt=""><figcaption>${i ? 'Foto ' + i : 'Logo'}</figcaption><button type="button" data-i="${i}" aria-label="Entfernen">✕</button></figure>`).join('');
}
function klein(file) {
 return new Promise(res => {
  const fr = new FileReader();
  fr.onload = () => { const im = new Image(); im.onload = () => {
   const png = /png|webp|svg/.test(file.type), max = png ? 700 : 1400, f = Math.min(1, max / Math.max(im.width, im.height));
   const c = document.createElement('canvas'); c.width = Math.round(im.width * f); c.height = Math.round(im.height * f);
   c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
   res(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', .8));
  }; im.onerror = () => res(null); im.src = fr.result; };
  fr.onerror = () => res(null); fr.readAsDataURL(file);
 });
}
async function dazu(files) {
 for (const f of [...files].filter(f => /^image\//.test(f.type))) {
  if (window.__bauBilder.length >= 6) break;
  const u = await klein(f); if (u) window.__bauBilder.push(u);
 }
 zeige();
}
if (inp) {
 inp.addEventListener('change', () => { dazu(inp.files); inp.value = ''; });
 th.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; e.preventDefault(); window.__bauBilder.splice(+b.dataset.i, 1); zeige(); });
 ['dragenter', 'dragover'].forEach(n => box.addEventListener(n, e => { e.preventDefault(); box.classList.add('drueber'); }));
 ['dragleave', 'drop'].forEach(n => box.addEventListener(n, e => { e.preventDefault(); box.classList.remove('drueber'); }));
 box.addEventListener('drop', e => dazu(e.dataTransfer.files));
}
})();
