/* Pagerush 02.11.2026: Glasfeld kippt zur Maus, Glanz wandert mit */
(() => {
 const lg = document.querySelector('#logoMit .logo-glas'); if (!lg) return;
 const k = document.createElement('div'); k.className = 'glas-kipp'; lg.parentNode.insertBefore(k, lg); k.appendChild(lg);
 if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
 let tx = 0, ty = 0, cx = 0, cy = 0, an = false;
 function loop() {
  cx += (tx - cx) * .12; cy += (ty - cy) * .12;
  k.style.setProperty('--ky', (cx * 11).toFixed(2) + 'deg'); k.style.setProperty('--kx', (-cy * 8).toFixed(2) + 'deg');
  k.style.setProperty('--gx', (50 + cx * 55).toFixed(1) + '%'); k.style.setProperty('--gy', (45 + cy * 55).toFixed(1) + '%');
  k.style.setProperty('--gw', (112 + cx * 28).toFixed(1) + 'deg');
  lg.style.setProperty('--gx', (50 + cx * 55).toFixed(1) + '%'); lg.style.setProperty('--gy', (45 + cy * 55).toFixed(1) + '%'); lg.style.setProperty('--gw', (112 + cx * 28).toFixed(1) + 'deg');
  if (Math.abs(tx - cx) + Math.abs(ty - cy) > .002) requestAnimationFrame(loop); else an = false;
 }
 addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2;
  if (!an) { an = true; requestAnimationFrame(loop); }
 }, { passive: true });
})();
