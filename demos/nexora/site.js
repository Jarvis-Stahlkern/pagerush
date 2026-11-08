// Nexora Group – gemeinsames Skript für alle Seiten
document.documentElement.classList.remove('ohne-js');
const reduziert = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

function fortschritt(sec) {
  const r = sec.getBoundingClientRect(); const weg = sec.offsetHeight - innerHeight;
  return weg > 0 ? Math.min(1, Math.max(0, -r.top / weg)) : 0;
}

/* ---------- Scroll-Film: Einzelbilder auf Canvas ---------- */
const filme = $$('.kapitel[data-film]').map(sec => {
  const n = +sec.dataset.n, ende = +(sec.dataset.ende || 1), c = $('canvas', sec), ctx = c.getContext('2d');
  const bilder = new Array(n); let aktuell = -1;
  const ziel = () => Math.round(Math.min(1, fortschritt(sec) / ende) * (n - 1));
  const zeichne = i => {
    const im = bilder[i]; if (!im || !im.complete || !im.naturalWidth) return;
    const dpr = Math.min(devicePixelRatio, 2), w = c.width = c.clientWidth * dpr, h = c.height = c.clientHeight * dpr;
    const s = Math.max(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    const fx = +(sec.dataset.fx || .5);
    ctx.drawImage(im, Math.min(0, Math.max(w - dw, w / 2 - dw * fx)), (h - dh) / 2, dw, dh); aktuell = i;
  };
  const lade = i => { if (bilder[i]) return; const im = new Image(); im.decoding = 'async';
    im.src = `${sec.dataset.film}/${String(i + 1).padStart(3, '0')}.${sec.dataset.ext || 'jpg'}`; im.onload = () => { if (i === ziel()) zeichne(i); }; bilder[i] = im; };
  for (let i = 0; i < n; i += 4) lade(i);
  return { sec, n, lade, zeichne, ziel, bilder, get aktuell() { return aktuell; } };
});
addEventListener('load', () => filme.forEach(f => { for (let i = 0; i < f.n; i++) f.lade(i); }));
addEventListener('resize', () => filme.forEach(f => { if (f.aktuell >= 0) f.zeichne(f.aktuell); }));

const logo = $('#logoGross'), xBlende = $('#xBlende'), kopf = $('#kopf'), hinweis = $('#hinweis'), ablauf = $$('#ablauf li');
function tick() {
  filme.forEach(f => {
    const r = f.sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    let i = f.ziel();
    if (!f.bilder[i] || !f.bilder[i].complete) for (let d = 1; d < f.n; d++) { const b = f.bilder[i - d]; if (b && b.complete) { i -= d; break; } }
    if (i !== f.aktuell) f.zeichne(i);
    const p = fortschritt(f.sec);
    $$('.blende', f.sec).forEach(b => b.classList.toggle('an', p >= +b.dataset.ab && p < +(b.dataset.bis || .97)));
  });
  // Startseite: Auto fährt ins rote X
  const st = $('#start');
  if (st && logo) {
    const p = fortschritt(st), z = Math.max(0, (p - .6) / .4), k = z * z * z;
    logo.style.transform = `translate(-50%,-50%) scale(${(1 + p * .25) * (1 + k * 70)})`;
    logo.style.opacity = Math.min(1, Math.max(0, (p - .38) / .12));
    if (xBlende) { xBlende.style.opacity = Math.min(1, Math.max(0, (z - .5) / .3)); xBlende.style.filter = `brightness(${1 - Math.min(1, Math.max(0, (z - .86) / .14))})`; }
    if (kopf) kopf.classList.toggle('zeigen', p > .98 || st.getBoundingClientRect().bottom < innerHeight * .5);
  } else if (kopf) kopf.classList.add('zeigen');
  if (hinweis) hinweis.style.opacity = Math.max(0, 1 - scrollY / 200);
  const raum = $('#raum'); if (raum) { const pr = fortschritt(raum); ablauf.forEach(li => li.classList.toggle('an', pr >= +li.dataset.p)); }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ---------- Trailer oben: Wörter passend zum Schnitt ---------- */
const trailer = $('#trailerVideo');
if (trailer) {
  const worte = $$('#trailerWorte [data-t]');
  trailer.addEventListener('timeupdate', () => {
    const t = trailer.currentTime;
    worte.forEach(w => w.classList.toggle('an', t >= +w.dataset.t && t < +w.dataset.t + +(w.dataset.d || 2.2)));
  });
  const kino = $('#kino'), kinoV = $('#kinoVideo');
  $$('[data-kino]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); kino.classList.add('offen'); kinoV.currentTime = 0; kinoV.play(); }));
  kino?.addEventListener('click', e => { if (e.target === kino || e.target.matches('.zu')) { kino.classList.remove('offen'); kinoV.pause(); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && kino?.classList.contains('offen')) { kino.classList.remove('offen'); kinoV.pause(); } });
}

/* ---------- Zahlen zählen hoch ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target, z = +el.dataset.zahl; io.unobserve(el); if (reduziert) return;
  const t0 = performance.now(); const lauf = t => { const k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(z * (1 - Math.pow(1 - k, 3))).toLocaleString('de-DE'); if (k < 1) requestAnimationFrame(lauf); };
  requestAnimationFrame(lauf);
}), { threshold: .5 });
$$('[data-zahl]').forEach(el => { el.textContent = (+el.dataset.zahl).toLocaleString('de-DE'); io.observe(el); });

/* ---------- Liquid-Glas-Knöpfe ---------- */
$$('.liquid').forEach(k => {
  const w = document.createElement('span'); w.className = 'wellen'; k.prepend(w);
  const setz = e => { const r = k.getBoundingClientRect(); k.style.setProperty('--x', (e.clientX - r.left) + 'px'); k.style.setProperty('--y', (e.clientY - r.top) + 'px'); };
  k.addEventListener('pointerenter', setz);
  k.addEventListener('pointerdown', e => { setz(e); const r = k.getBoundingClientRect(); const d = document.createElement('i'); d.className = 'welle';
    d.style.left = (e.clientX - r.left) + 'px'; d.style.top = (e.clientY - r.top) + 'px'; w.appendChild(d); setTimeout(() => d.remove(), 750); });
});
$$('.stapel').forEach(st => st.addEventListener('pointerenter', e => { if (e.target.matches?.('.liquid:not(.voll)')) st.querySelector('.voll')?.classList.remove('voll'); }, true));

/* ---------- Glas-Navigation mit Licht-Welle ---------- */
(() => {
  const nav = $('#glasnav'); if (!nav) return;
  const glas = $('#navglas'), rand = $('#navrand'), glut = $('#navglut'), lg = $('#lg'), strahl = $('#strahl'), links = $$('ul a', nav);
  const seite = document.body.dataset.seite; let cx = null, ziel = 0, akt = -1; const H = 64, BH = 16;
  const BW = () => (nav.clientWidth < 420 ? 62 : 78);
  function form(c) { const W = nav.clientWidth, T = nav.clientHeight - H, r = H / 2, bw = BW(); c = Math.min(W - r - bw / 2 - 6, Math.max(r + bw / 2 + 6, c)); const L = c - bw / 2, R = c + bw / 2;
    return `M ${r} ${T} L ${L - 12} ${T} C ${L + 6} ${T} ${L + 4} ${T - BH} ${L + 22} ${T - BH} L ${R - 22} ${T - BH} C ${R - 4} ${T - BH} ${R - 6} ${T} ${R + 12} ${T} L ${W - r} ${T} A ${r} ${r} 0 0 1 ${W - r} ${T + H} L ${r} ${T + H} A ${r} ${r} 0 0 1 ${r} ${T} Z`; }
  const mitte = i => { const a = links[i].getBoundingClientRect(), n = nav.getBoundingClientRect(); return a.left - n.left + a.width / 2; };
  function wahl() {
    let i = links.findIndex(a => a.dataset.seite === seite); const k = $('#kontakt');
    if (links[0].dataset.z) { i = 0; links.forEach((a, j) => a.dataset.z.split(' ').forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * .5) i = Math.max(i, j); })); }
    else
    if (k && k.getBoundingClientRect().top < innerHeight * .55) i = links.findIndex(a => a.dataset.seite === 'kontakt');
    if (i < 0) i = 0;
    if (i !== akt) { akt = i; links.forEach((a, j) => { a.classList.toggle('an', j === i); a.toggleAttribute('aria-current', j === i); }); ziel = mitte(i); }
  }
  const sichtbarAb = +(nav.dataset.ab || 0);
  function lauf() {
    wahl(); if (cx === null) cx = ziel; cx += (ziel - cx) * .16; const d = form(cx);
    rand.setAttribute('d', d); glut.setAttribute('d', d); glas.style.clipPath = `path('${d}')`;
    lg.setAttribute('cx', cx); lg.setAttribute('cy', nav.clientHeight - H); strahl.style.left = cx + 'px';
    nav.classList.toggle('da', scrollY >= innerHeight * sichtbarAb); requestAnimationFrame(lauf);
  }
  addEventListener('resize', () => { if (akt >= 0) ziel = mitte(akt); }); requestAnimationFrame(lauf);
})();

/* ---------- Anfrage-Formular: Bereich wählen, per WhatsApp oder E-Mail senden ---------- */
(() => {
  const f = $('#anfrageForm'); if (!f) return;
  const hinweis = $('#formHinweis');
  const setz = () => f.classList.toggle('kein-bau', f.bereich.value !== 'Bau');
  f.addEventListener('change', setz); setz();
  $$('[data-bereich]').forEach(a => a.addEventListener('click', () => { const r = f.querySelector(`input[value="${a.dataset.bereich}"]`); if (r) { r.checked = true; setz(); } }));
  let weg = 'wa'; $$('button[data-weg]', f).forEach(b => b.addEventListener('click', () => weg = b.dataset.weg));
  f.addEventListener('submit', e => {
    e.preventDefault();
    const fehlt = ['text', 'name', 'tel'].filter(n => !f[n].value.trim());
    if (fehlt.length) { hinweis.textContent = 'Bitte Anliegen, Name und Telefon ausfüllen.'; f[fehlt[0]].focus(); return; }
    hinweis.textContent = '';
    const z = [`Anfrage über die Webseite – ${f.bereich.value}`, `Art: ${f.art.value}`];
    if (f.bereich.value === 'Bau') { z.push(`Leistung: ${f.leistung.value}`); if (f.ort.value) z.push(`Ort: ${f.ort.value}`); if (f.zeit.value) z.push(`Zeitraum: ${f.zeit.value}`); }
    z.push(`Anliegen: ${f.text.value.trim()}`, `Name: ${f.name.value.trim()}`, `Telefon: ${f.tel.value.trim()}`);
    const text = encodeURIComponent(z.join('\n'));
    location.href = weg === 'wa' ? `https://wa.me/491737220769?text=${text}` : `mailto:info@nexora-reutlingen.de?subject=${encodeURIComponent('Anfrage ' + f.bereich.value)}&body=${text}`;
  });
})();

/* Rohbau → fertig: Lichtkante wischt den fertigen Raum frei */
(() => {
  const r = $('#raum.wischraum'); if (!r) return; const b = $('.buehne', r);
  const lauf = () => { const p = fortschritt(r), w = Math.min(1, Math.max(0, (p - .12) / .7));
    const e = w < .5 ? 2 * w * w : 1 - Math.pow(-2 * w + 2, 2) / 2;
    b.style.setProperty('--p', p); b.style.setProperty('--w', (e * 100).toFixed(2) + '%'); b.style.setProperty('--lo', e > 0 && e < 1 ? 1 : 0);
    $$('.blende', r).forEach(x => x.classList.toggle('an', p >= +x.dataset.ab && p < +(x.dataset.bis || .97)));
    requestAnimationFrame(lauf); };
  requestAnimationFrame(lauf);
})();
