/* Pagerush 02.11.2026: Glas-Logo reagiert + Licht-Cursor mit Druck-Effekt */
(() => {
 const fein = matchMedia('(hover:hover) and (pointer:fine)').matches;
 const w = document.querySelector('.kopf .wort');
 if (w) {
  w.addEventListener('pointermove', e => {
   const r = w.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
   w.style.setProperty('--gx', x * 100 + '%'); w.style.setProperty('--gy', y * 100 + '%');
   w.style.setProperty('--ry', ((x - .5) * 22).toFixed(1) + 'deg'); w.style.setProperty('--rx', ((.5 - y) * 16).toFixed(1) + 'deg');
  });
  w.addEventListener('pointerleave', () => { w.style.setProperty('--rx', '0deg'); w.style.setProperty('--ry', '0deg'); });
  w.addEventListener('pointerdown', e => {
   w.classList.add('druck');
   const r = w.getBoundingClientRect(), s = document.createElement('span'); s.className = 'welle';
   s.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${r.width * 1.6}px;height:${r.width * 1.6}px`;
   w.append(s); setTimeout(() => s.remove(), 850);
  });
  addEventListener('pointerup', () => w.classList.remove('druck'));
 }
 // Großes Logo in der Mitte: Glanzpunkt folgt der Maus
 const lg = document.querySelector('.logo-glas');
 if (lg) addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = lg.getBoundingClientRect(); if (!r.width) return;
  lg.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(0) + '%'); lg.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(0) + '%'); }, { passive: true });

 if (!fein) return;
 document.documentElement.classList.add('lichtmaus');
 const p = document.createElement('div'), l = document.createElement('div');
 p.className = 'lm-punkt'; l.className = 'lm-licht'; l.style.opacity = 0; p.style.opacity = 0;
 document.body.append(l, p);
 let x = 0, y = 0, lx = 0, ly = 0, an = false;
 // Punkt folgt sofort, nur der Lichthof schwebt nach – und nur solange er unterwegs ist (kein Dauer-Loop)
 function loop() {
  lx += (x - lx) * .35; ly += (y - ly) * .35; l.style.transform = `translate3d(${lx}px,${ly}px,0)`;
  if (Math.abs(x - lx) + Math.abs(y - ly) > .4) requestAnimationFrame(loop); else { an = false; l.style.transform = `translate3d(${x}px,${y}px,0)`; }
 }
 addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return; x = e.clientX; y = e.clientY;
  p.style.opacity = 1; l.style.opacity = 1; p.style.transform = `translate3d(${x}px,${y}px,0)`;
  if (!an) { an = true; requestAnimationFrame(loop); }
 }, { passive: true });
 document.addEventListener('mouseleave', () => { p.style.opacity = 0; l.style.opacity = 0; });
 addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') return;
  l.classList.add('druck');
  const r = document.createElement('i'); r.className = 'lm-ring'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
  document.body.append(r); setTimeout(() => r.remove(), 650);
 });
 addEventListener('pointerup', () => l.classList.remove('druck'));
})();
