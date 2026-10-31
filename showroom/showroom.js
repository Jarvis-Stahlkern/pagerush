// Kino-Showroom: Laptop + Handy spielen die Vorlagen beim Scrollen ab
(() => {
 const sek = document.getElementById('showroom'); if (!sek) return;
 const $ = id => document.getElementById(id), kl = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a))), ez = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
 const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches, N = 120;
 const cq = $('ksFilm'), ch = $('ksFilmH'), xq = cq.getContext('2d'), xh = ch.getContext('2d');
 const Z = [...sek.querySelectorAll('.ks-z')], CH = [...sek.querySelectorAll('.ks-chips a')], BI = [...sek.querySelectorAll('.ks-bild')], ue = $('ksUeber');
 const fq = [], fh = []; let ziel = 0, gestartet = false;
 function laden() { if (gestartet) return; gestartet = true; const ord = [0]; for (let s = 32; s >= 1; s >>= 1) for (let i = 0; i < N; i += s) if (!ord.includes(i)) ord.push(i);
  let k = 0; const w = () => { if (k >= ord.length) return; const i = ord[k++], n = String(i).padStart(3, '0'), a = new Image(), b = new Image(); let f = 0;
   const ok = () => { if (++f === 2) { malen(true); w(); } }; a.onload = () => { fq[i] = a; ok(); }; b.onload = () => { fh[i] = b; ok(); }; a.onerror = b.onerror = ok;
   a.src = `kino/beauty/film/quer/f${n}.webp`; b.src = `kino/beauty/film/hoch/f${n}.webp`; }; for (let n = 0; n < 4; n++) w(); }
 new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { laden(); o.disconnect(); } }, { rootMargin: '600px' }).observe(sek);
 function bild(arr, i) { if (arr[i]) return arr[i]; for (let d = 1; d < N; d++) { if (arr[i - d]) return arr[i - d]; if (arr[i + d]) return arr[i + d]; } return null; }
 let jetzt = -1;
 function malen(zw) { if (ziel === jetzt && !zw) return; jetzt = ziel; for (const [c, x, arr, vx] of [[cq, xq, fq, .3], [ch, xh, fh, .5]]) { const im = bild(arr, ziel); if (!im) continue;
   const s = Math.max(c.width / im.width, c.height / im.height), w = im.width * s, h = im.height * s; x.drawImage(im, (c.width - w) * vx, (c.height - h) / 2, w, h); } }
 function groesse() { const d = Math.min(2, devicePixelRatio || 1); for (const c of [cq, ch]) { c.width = Math.round(c.clientWidth * d); c.height = Math.round(c.clientHeight * d); } malen(true); }
 let tick = false;
 function lauf() { tick = false; const vh = innerHeight, r = sek.getBoundingClientRect(), p = ruhig ? .3 : kl(-r.top, 0, r.height - vh);
  // Laptop klappt auf und kommt nach vorn
  const auf = ez(kl(p, 0, .16)); $('ksLaptop').style.transform = `rotateX(${(1 - auf) * 28}deg) scale(${.86 + .14 * auf})`;
  $('ksHandy').style.transform = `translateY(${(1 - ez(kl(p, .05, .22))) * 120}px) rotate(${(1 - auf) * 6}deg)`; $('ksHandy').style.opacity = kl(p, .05, .18) * (1 - kl(p, .53, .6));
  // Abschnitte: 0 Intro | 1 Beauty-Film | 2 Gourmet-Fahrt | 3 Fotos
  const st = p < .16 ? 0 : p < .55 ? 1 : p < .85 ? 2 : 3; Z.forEach((z, i) => z.classList.toggle('an', i === st));
  CH.forEach((c, i) => c.classList.toggle('an', (st <= 1 && i === 0) || (st >= 2 && i === 1)));
  ziel = Math.round(kl(p, .1, .58) * (N - 1)); malen(false);
  $('ksUrl').textContent = st >= 2 ? 'lecrin-restaurant.de' : 'salon-mira.de';
  const g = kl(p, .55, .85), gIdx = g * 3; BI.forEach((b, i) => { const l = gIdx - i; const o = i === 0 ? kl(p, .55, .6) * (1 - kl(l, .7, 1)) : kl(l, -.3, 0) * (1 - kl(l, .7, 1)); b.style.opacity = st >= 2 ? (i === 2 && l > .7 ? 1 : o) : 0; b.style.transform = `scale(${1 + .25 * kl(l, 0, 1)})`; });
  ue.classList.toggle('dunkel', st >= 2); ue.innerHTML = st >= 2 ? '<small>Restaurant</small><b>L\'Écrin</b>' : '<small>Friseur &amp; Beauty</small><b>Mira</b>';
  ue.style.opacity = st === 1 && p > .3 && p < .52 ? 0 : 1;
 }
 addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(lauf); } }, { passive: true });
 addEventListener('resize', () => { groesse(); lauf(); }); groesse(); lauf();
})();
