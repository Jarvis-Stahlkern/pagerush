/* Pagerush 02.11.2026 19:30: Karten (Ablauf, Domain) fliegen von der Seite ein, kippen beim Scrollen und zur Maus; ihr Text wird geschrieben */
(() => {
 // Effekt-Vorlagen unter dem Eingabefeld: hängen ihren Satz an die Beschreibung an
 document.querySelectorAll('.bau-chips.eff button').forEach(b => b.addEventListener('click', () => {
  const t = document.getElementById('bauText'); if (!t) return; const e = b.dataset.e;
  if (t.value.includes(e)) { t.value = t.value.replace(', ' + e, '').replace(e, '').trim(); b.classList.remove('on'); } else { t.value = (t.value.trim() ? t.value.trim().replace(/[.,]$/, '') + ', ' : 'Meine Website ') + e; b.classList.add('on'); }
 }));
 if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const kl = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a))), ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
 const alle = [...document.querySelectorAll('.sp,.dom-k,.dom-check')]; if (!alle.length) return;
 const K = alle.map(el => {
  const sib = [...el.parentNode.children].filter(c => alle.includes(c)), n = sib.length, k = sib.indexOf(el);
  const teile = [...el.querySelectorAll('h3,p,b,.zeit')].filter(t => !t.children.length && t.textContent.trim().length > 1);
  return { el, side: n > 1 ? (k - (n - 1) / 2) / ((n - 1) / 2) : 0, hx: 0, hy: 0, ax: 0, ay: 0, sicht: false, e: 0, teile, schrieb: false };
 });
 const io = new IntersectionObserver(es => es.forEach(e => { K.find(c => c.el === e.target).sicht = e.isIntersecting; }), { rootMargin: '120px' });
 K.forEach(c => {
  io.observe(c.el);
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
   c.el.addEventListener('pointermove', e => { const r = c.el.getBoundingClientRect(); c.hx = (e.clientX - r.left) / r.width * 2 - 1; c.hy = (e.clientY - r.top) / r.height * 2 - 1; });
   c.el.addEventListener('pointerleave', () => { c.hx = c.hy = 0; });
  }
 });
 // Text wird Buchstabe für Buchstabe geschrieben (Platz bleibt reserviert, nichts springt)
 function schreibe(c) {
  c.schrieb = true; let t0 = 350;
  c.teile.forEach(el => {
   const txt = el.textContent, a = document.createElement('span'), b = document.createElement('span'); a.className = 'tw-a'; b.className = 'tw-b'; b.textContent = txt;
   el.textContent = ''; el.append(a, b);
   const cps = el.tagName === 'P' ? 78 : 40, dauer = txt.length / cps * 1000, start = performance.now() + t0; t0 += dauer + 120;
   (function lauf(now) {
    const n = Math.max(0, Math.min(txt.length, Math.floor((now - start) / 1000 * cps)));
    if (now >= start) { a.classList.add('tippt'); a.textContent = txt.slice(0, n); b.textContent = txt.slice(n); }
    if (n < txt.length) requestAnimationFrame(lauf); else { a.classList.remove('tippt'); a.textContent = txt; b.remove(); }
   })(performance.now());
  });
 }
 let sicherung = 0;
 function bild() {
  requestAnimationFrame(bild);
  const vh = innerHeight;
  for (const c of K) {
   if (!c.sicht) continue;
   const r = c.el.getBoundingClientRect(), mitte = (r.top + r.height / 2 - vh / 2) / vh;
   const e = ez(kl(vh * 1.02 - r.top, 0, vh * .62)); c.e = e;
   c.ax += (c.hx - c.ax) * .12; c.ay += (c.hy - c.ay) * .12;
   const s = c.side, w = innerWidth < 860 ? .5 : 1;
   const ry = (1 - e) * s * 34 * w + s * mitte * -8 * w + c.ax * 9;
   const rx = (1 - e) * 20 + mitte * -9 + c.ay * -7;
   c.el.style.setProperty('--ry', ry.toFixed(2) + 'deg'); c.el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
   c.el.style.setProperty('--tx', ((1 - e) * s * 120 * w).toFixed(1) + 'px'); c.el.style.setProperty('--ty', ((1 - e) * 90 + mitte * -22 * (1 + Math.abs(s) * .5)).toFixed(1) + 'px');
   if (!c.schrieb && e > .45 && c.teile.length) schreibe(c);
  }
 }
 requestAnimationFrame(bild);
})();
