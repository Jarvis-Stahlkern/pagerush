/* Pagerush – echte Bildschirme (02.11.2026, 18:50): Studio-Display-Look, Karussell beim Scrollen.
   Im vorderen Bildschirm läuft der echte Ablauf von selbst: Pagerush-Seite > Klick „Website bauen“ > KI-Chat tippt >
   Vorschau entsteht im Chat > fertige Seite scrollt von allein (Fertighaus mit Haus-Film). Ersetzt glas.js. */
(() => {
const root = document.getElementById('glas'); if (!root) return;
const ring = root.querySelector('.glas-ring');
const S = [
 ['fertighaus', 'Fertighäuser', 'stahlkern-fertighaeuser.de', 'Fertighäuser aus Holz in Herrenberg, mit Bauablauf-Animation und Wunschhaus-Planer'],
 ['luce', 'Restaurant', 'luce-ristorante.de', 'Italienisches Restaurant in Stuttgart, warm, mit Speisekarte und Tischreservierung'],
 ['luxus', 'Premium', 'nebel-studio.de', 'Premium-Marke, dunkel, Kino-Optik mit Nebel und großen Bildern'],
 ['kraemer', 'Bau', 'kraemer-bau.de', 'Bauunternehmen, modern, mit Referenzen und Anfrageformular'],
 ['mira', 'Friseur', 'mira-hairstudio.de', 'Friseursalon, edel und hell, mit Preisliste und Online-Termin'],
 ['physio', 'Praxis', 'physio-herrenberg.de', 'Physiotherapie-Praxis in Herrenberg, ruhig, mit Terminbuchung'],
 ['sonnenkorn', 'Bäckerei', 'sonnenkorn-baeckerei.de', 'Bäckerei, handwerklich und warm, mit Öffnungszeiten und Sortiment'],
 ['nordlicht', 'Software', 'nordlicht.app', 'Software-Startup, dunkel und modern, mit Demo-Button']
];
const ZEILEN = [
 'Ein Satz – <em>und die Seite entsteht.</em>', 'Echte Fotos, <em>echte Effekte.</em>', 'Jede Branche, <em>ein eigener Stil.</em>',
 'Am PC <em>und am Handy.</em>', 'In Minuten, <em>nicht Wochen.</em>', 'Von Bäckerei <em>bis Software.</em>', 'Fotos, Texte, <em>Effekte.</em>', 'Einmalig <em>99 €.</em> Jetzt bist <em>du dran.</em>'
];
const N = S.length, ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const zeile = root.querySelector('.glas-zeile'), punkte = root.querySelector('.glas-punkte');
const kopf = root.querySelector('.glas-kopf'), hinweis = root.querySelector('.glas-hinweis'), unten = root.querySelector('.glas-unten'), buehne = root.querySelector('.glas-buehne');

const M = S.map(([n, t, u, prompt], i) => {
 const d = document.createElement('div'); d.className = 'scheibe';
 d.innerHTML = `<div class="dsp">
 <div class="dsp-arm"></div><div class="dsp-fuss"></div><i class="dsp-schatten"></i>
 <div class="dsp-geh"><div class="dsp-glas"><div class="dsp-schirm">
  <div class="sz" data-p="seite">
   <div class="sz-bar"><i></i><i></i><i></i><span class="sz-url"><b>🔒</b><em>${u}</em></span></div>
   <div class="sz-inhalt">
    <div class="sz-home">
     <div class="h-nav"><img src="neu/logo.webp?v=7" alt=""><span>Ablauf</span><span>Preis</span><span class="h-an">Anmelden</span></div>
     <div class="h-mitte"><img class="h-logo" src="neu/logo.webp?v=7" alt="Pagerush"><h4>Websites aus einer <em>anderen Liga.</em></h4><p>Ein Satz von dir – Pagerush baut die komplette Seite.</p><span class="h-knopf">Website bauen →</span></div>
    </div>
    <div class="sz-chat">
     <div class="c-links">
      <div class="c-kopf"><img src="neu/logo.webp?v=7" alt=""><span>KI-Studio</span></div>
      <div class="c-verlauf">
       <div class="c-msg c-ki c-hallo">Hi! Beschreib mir dein Geschäft in einem Satz – ich baue dir die komplette Website.</div>
       <div class="c-msg c-du">${prompt}</div>
       <div class="c-msg c-ki c-baut">Alles klar – ich baue deine Seite …<i class="c-balken"><b></b></i><small class="c-schritt">Texte schreiben</small></div>
       <div class="c-msg c-ki c-fertig">Fertig ✓ Deine Vorschau ist bereit.</div>
      </div>
      <div class="c-eingabe"><span class="c-text"></span><i class="c-strich"></i><span class="c-senden">↑</span></div>
     </div>
     <div class="c-vorschau"><div class="c-leer"><img src="neu/logo.webp?v=7" alt=""><span>Hier entsteht deine Website</span></div><div class="c-bild"><img src="neu/glas/seite-${n}.jpg" alt="" loading="eager" decoding="async"></div></div>
    </div>
    <div class="sz-seite">
     <img class="sz-lang" src="neu/glas/seite-${n}.jpg" alt="Beispiel-Website ${t}" loading="eager" decoding="async">
     ${n === 'fertighaus' ? '<video class="sz-film" muted playsinline preload="none" poster="neu/glas/fertighaus.jpg"><source src="neu/glas/fertighaus.mp4" type="video/mp4"></video>' : ''}
    </div>
   </div>
   <i class="sz-maus"></i>
  </div>
 </div><i class="dsp-kamera"></i></div><i class="dsp-glanz"></i></div>
</div><div class="scheibe-tag">${t}</div>`;
 ring.append(d);
 zeile.insertAdjacentHTML('beforeend', `<div>${ZEILEN[i]}</div>`); punkte.append(document.createElement('i'));
 const q = s => d.querySelector(s);
 return { el: d, sz: q('.sz'), url: q('.sz-url em'), dom: u, txt: q('.c-text'), prompt, bau: q('.c-balken b'), schritt: q('.c-schritt'),
  lang: q('.sz-lang'), film: q('.sz-film'), seite: q('.sz-seite'), cbild: q('.c-bild'), p: '', t: 0, f: -1, sh: 0 };
});

// 02.11. 19:20: Zeitplan – Logo bleibt beim Laden groß stehen (erst ab ~25 % Bildschirm Scrollen geht es nach hinten)
const R0 = .045, R1 = .17, L0 = .19, L1 = .9;
let sw = 600, ziel = 0, akt = 0, mx = 0, amx = 0, vorn = -1, sichtbar = true, altPos = -9, altRein = -1;
function groesse() {
 const w = innerWidth, h = innerHeight, handy = w < 760;
 sw = handy ? Math.min(w * .8, 520) : Math.min(w * .44, (h - 380) * 1.45, 900);
 root.style.setProperty('--sw', sw + 'px');
 M.forEach(m => m.sh = 0); altPos = -9;
}
const ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const ezs = x => x * x * (3 - 2 * x);
const kl = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
function scroll() { const r = root.getBoundingClientRect(); ziel = ruhig ? 0 : kl(-r.top, 0, root.offsetHeight - innerHeight); }

// ---------- Ablauf im vorderen Bildschirm ----------
const SCHRITTE = ['Texte schreiben', 'Bilder setzen', 'Effekte einbauen', 'Handy-Ansicht prüfen'];
function phase(m, p) { if (m.p !== p) { m.p = p; m.sz.dataset.p = p; } }
function maus(m, x, y, klick) { m.sz.style.setProperty('--mx', x + '%'); m.sz.style.setProperty('--my', y + '%'); m.sz.classList.toggle('klick', !!klick); }
function scrollSeite(m, f) {
 if (!m.sh) { const sc = m.seite.clientHeight, w = m.seite.clientWidth, nw = m.lang.naturalWidth; if (!nw || !sc) return; m.sh = Math.max(0, w * m.lang.naturalHeight / nw - sc); }
 if (Math.abs(f - m.f) < .0004) return; m.f = f;
 m.lang.style.transform = `translate3d(0,${(-f * m.sh).toFixed(1)}px,0)`;
}
function filmStart(m) { if (!m.film) return false; if (m.film.preload !== 'auto') { m.film.preload = 'auto'; m.film.load(); } m.film.currentTime = 0; const pr = m.film.play(); if (pr) pr.catch(() => {}); return true; }
function ablauf(m, dt) {
 m.t += dt; const t = m.t;
 if (t < 2.6) { // Pagerush-Startseite, Maus fährt zum Knopf und klickt
  phase(m, 'home'); m.url.textContent = 'pagerush.de';
  const a = ezs(kl(t, .5, 1.7)); maus(m, 78 - a * 28, 88 - a * 18, t > 1.85 && t < 2.15);
 } else if (t < 9.6) { // KI-Chat: Prompt tippt, Senden, Vorschau entsteht
  phase(m, 'chat'); m.url.textContent = 'pagerush.de/studio';
  const n = Math.floor(kl(t, 3, 5.4) * m.prompt.length), txt = t < 6 ? m.prompt.slice(0, n) : '';
  if (m.txt._v !== txt) { m.txt._v = txt; m.txt.textContent = txt; }
  const a = ezs(kl(t, 5.4, 5.9)); maus(m, 50 - a * 9, 70 + a * 21, t > 5.9 && t < 6.2);
  m.sz.classList.toggle('gesendet', t > 6); m.sz.classList.toggle('baut', t > 6.4); m.sz.classList.toggle('fertig', t > 8.6);
  const b = kl(t, 6.4, 8.5); m.bau.style.transform = `scaleX(${b.toFixed(3)})`; m.cbild.style.setProperty('--b', b.toFixed(3));
  const s = SCHRITTE[Math.min(3, Math.floor(b * 4))]; if (m.schritt._v !== s) { m.schritt._v = s; m.schritt.textContent = s; }
 } else { // fertige Seite: rechts im Vorschau-Fenster (KI-Studio bleibt links), scrollt von allein (Fertighaus: erst der Haus-Film)
  if (m.p !== 'seite') { m.sz.classList.add('gesendet', 'baut', 'fertig'); phase(m, 'seite'); m.url.textContent = m.dom; m.f = -1; m.sh = 0; scrollSeite(m, 0); m.filmBis = 0; if (filmStart(m)) { m.sz.classList.add('film'); m.filmBis = 99; } }
  let ts = t - 10.4;
  if (m.film && m.filmBis) {
   const fl = m.film, ende = fl.ended || (fl.duration && fl.currentTime >= fl.duration - .15) || t > 34 || (t > 13 && fl.currentTime < .2);
   if (ende) { m.filmBis = 0; m.filmEnde = t; m.sz.classList.remove('film'); fl.pause(); }
   else { scrollSeite(m, 0); return; }
  }
  if (m.filmEnde) ts = t - m.filmEnde - .6;
  const dauer = 9 + m.sh / 260; // längere Seiten scrollen länger
  scrollSeite(m, ez(kl(ts, 0, dauer)));
  if (ts > dauer + 2.4) neustart(m);
 }
}
function neustart(m) { m.t = 0; m.filmEnde = 0; m.sz.classList.remove('gesendet', 'baut', 'fertig', 'film'); m.txt._v = null; }
function ruhe(m) { // Bildschirme hinten: zeigen die fertige Seite, ohne laufend zu rechnen
 if (m.p !== 'seite' || m.t) { neustart(m); m.t = 0; m.sz.classList.add('gesendet', 'baut', 'fertig'); m.txt.textContent = ''; m.bau.style.transform = 'scaleX(1)'; m.sh = 0; phase(m, 'seite'); m.url.textContent = m.dom; m.f = -1; scrollSeite(m, 0); if (m.film) { m.film.pause(); m.sz.classList.remove('film'); } }
}

let posV = 0, tl = 0, posA = 0, zeit = 0, my = 0, amy = 0, zieh = null;
const glatt = x => 1 - Math.exp(-x);
function bild(t) {
 requestAnimationFrame(bild);
 if (!sichtbar) { tl = 0; return; }
 const dt = tl ? Math.min(.1, (t - tl) / 1000) : 1 / 60; tl = t; zeit += dt;
 akt += (ziel - akt) * (1 - Math.exp(-dt * 4.2)); amx += (mx - amx) * (1 - Math.exp(-dt * 2.5)); amy += (my - amy) * (1 - Math.exp(-dt * 2.5));
 const p = akt, rein = ez(kl(p, R0, R1)), lauf = kl(ziel, L0, L1) * (N - 1), ganz = Math.floor(lauf), fr = lauf - ganz;
 // 02.11. 19:20: Gleiten mit Feder (kritisch gedämpft) direkt am Scroll – kein Einrasten, kein Ruck, leichtes Nachschwingen der Tiefe
 const pos0 = Math.min(N - 1, ganz + fr * .55 + ezs(fr) * .45);
 const kf = 34, df = 2 * Math.sqrt(kf) * .92; posV += ((pos0 - posA) * kf - posV * df) * dt; posA += posV * dt;
 if (Math.abs(pos0 - posA) < .0005 && Math.abs(posV) < .001) { posA = pos0; posV = 0; }
 const pos = posA, aus = ez(kl(p, .9, 1));
 ring.style.transform = `translateY(${((1 - rein) * -3 - aus * 22).toFixed(2)}vh) scale(${((.06 + .94 * rein) * (1 - aus * .38)).toFixed(4)})`;
 ring.style.opacity = Math.min(1, rein * 1.6).toFixed(3);
 M.forEach((m, i) => {
  const d = i - pos, a = Math.abs(d), s = Math.sign(d) || 0, c = Math.min(1, a);
  // weicher Bogen ohne Knick
  const x = s * sw * (1.22 * glatt(a * 1.5) + .14 * a), z = -380 * glatt(a * 1.3) - 90 * a, ry = -s * 30 * glatt(a * 2) + amx * 9;
  // Schweben: jedes MacBook hat seinen eigenen Takt, das vordere hebt sich etwas mehr
  const ph = i * 1.37, hy = (Math.sin(zeit * .9 + ph) * .016 + Math.sin(zeit * .43 + ph * 2) * .008) * sw - (1 - c) * sw * .02 + glatt(a * 1.2) * sw * .05;
  const rx = Math.sin(zeit * .7 + ph) * 2.2 - amy * 5 + 3, rz = Math.sin(zeit * .55 + ph * 1.7) * 1.1 * (.4 + c * .6);
  const e = m.el;
  let fz = 0, fy = 0, fs = 1, fo = 1, frx = 0;
  if (m.flug) { // wegfliegen: hoch, auf den Betrachter zu, kippt, wird durchsichtig – danach kommt es von hinten zurück
   const f = (zeit - m.flug) / 1.1;
   if (f >= 1.9) m.flug = 0;
   else if (f < 1) { const q = ez(f); fz = 520 * q; fy = -sw * .55 * q; fs = 1 + .25 * q; fo = 1 - q; frx = -24 * q; }
   else { const q = ezs((f - 1) / .9); fz = -500 * (1 - q); fo = q; }
  }
  e.style.transform = `translate3d(${x.toFixed(1)}px,${(hy + fy).toFixed(1)}px,${(z + (1 - c) * 40 + fz).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${(rx + frx).toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${fs.toFixed(3)})`;
  e.style.setProperty('--hy', hy.toFixed(1) + 'px');
  e.style.setProperty('--hell', (1 - c).toFixed(3)); e.style.setProperty('--rot', (s * c * 40).toFixed(1));
  e.style.zIndex = 20 - Math.round(a * 4); e.style.opacity = (Math.max(0, Math.min(1, 2.4 - a)) * fo).toFixed(3); e.style.visibility = a > 2.4 ? 'hidden' : '';
 });
 const i = Math.round(pos);
 if (i !== vorn) { vorn = i; [...zeile.children].forEach((z, k) => z.classList.toggle('an', k === i)); [...punkte.children].forEach((z, k) => z.classList.toggle('an', k <= i)); }
 M.forEach((m, k) => { if (k === i && Math.abs(pos - i) < .3 && rein > .85 && !ruhig) ablauf(m, dt); else ruhe(m); });
 const op1 = (1 - kl(p, .03, .09)).toFixed(3); if (kopf._o !== op1) { kopf._o = op1; kopf.style.opacity = op1; }
 const op2 = (1 - kl(p, .01, .06)).toFixed(3); if (hinweis._o !== op2) { hinweis._o = op2; hinweis.style.opacity = op2; }
 const op3 = (1 - aus).toFixed(3); if (buehne._o !== op3) { buehne._o = op3; buehne.style.opacity = op3; buehne.style.filter = aus > .01 ? `blur(${(aus * 10).toFixed(1)}px)` : ''; const kp = document.querySelector('#logoMit .glas-kipp') || document.getElementById('logoMit'); if (kp) kp.style.opacity = (1 - aus).toFixed(3); }
 const op4 = (1 - kl(p, .86, .94)).toFixed(3); if (unten._o !== op4) { unten._o = op4; unten.style.opacity = op4; }
 const op5 = kl(p, .14, .19).toFixed(3); if (zeile._o !== op5) { zeile._o = op5; zeile.style.opacity = punkte.style.opacity = op5; }
 window.__glas = { akt, ziel, pos };
}
// Rüberziehen mit Maus oder Finger (waagrecht), danach rastet das nächste MacBook sanft ein
const lauflaenge = () => root.offsetHeight - innerHeight, schritt = () => (L1 - L0) * lauflaenge() / (N - 1);
function einrasten() {
 const p = ziel; if (p < L0 || p > L1) return;
 const k = Math.round(kl(p, L0, L1) * (N - 1)), z = (L0 + (L1 - L0) * k / (N - 1)) * lauflaenge() + root.offsetTop;
 if (Math.abs(z - scrollY) > 4) scrollTo({ top: z, behavior: 'smooth' });
}
let rastT = 0; const rastSpaeter = () => { clearTimeout(rastT); rastT = setTimeout(() => { if (!zieh) einrasten(); }, 260); };
buehne.style.touchAction = 'pan-y'; buehne.style.cursor = 'grab';
buehne.addEventListener('pointerdown', e => { if (e.button) return; zieh = { x: e.clientX, y: e.clientY, s: scrollY, weg: 0, id: e.pointerId, h: null }; });
addEventListener('pointermove', e => {
 if (!zieh || e.pointerId !== zieh.id) return;
 const dx = e.clientX - zieh.x, dy = e.clientY - zieh.y;
 if (zieh.h === null && Math.abs(dx) + Math.abs(dy) > 6) { zieh.h = Math.abs(dx) > Math.abs(dy); if (zieh.h) { buehne.style.cursor = 'grabbing'; try { buehne.setPointerCapture(e.pointerId); } catch (_) {} } }
 if (!zieh.h) return; zieh.weg = Math.abs(dx);
 scrollTo(0, zieh.s - dx / (sw * .8) * schritt());
}, { passive: true });
const los = () => { if (!zieh) return; const war = zieh.h; zieh = null; buehne.style.cursor = 'grab'; if (war) { klickSperre = performance.now(); einrasten(); } };
addEventListener('pointerup', los); addEventListener('pointercancel', los);
let klickSperre = 0;
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') my = e.clientY / innerHeight - .5; }, { passive: true });
// Einrasten beim normalen Scrollen entfernt (02.11. 19:20) – es kämpfte gegen den Schwung von Trackpad/Finger
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') mx = e.clientX / innerWidth - .5; }, { passive: true });
addEventListener('scroll', scroll, { passive: true });
addEventListener('resize', () => { groesse(); scroll(); });
new IntersectionObserver(e => { sichtbar = e[0].isIntersecting; if (!sichtbar) M.forEach(m => m.film && m.film.pause()); }).observe(root);
const zuGeraet = i => { const z = L0 + (L1 - L0) * Math.max(0, Math.min(N - 1, i)) / (N - 1); scrollTo({ top: root.offsetTop + z * (root.offsetHeight - innerHeight), behavior: 'smooth' }); };
// 02.11. 19:20 (Djengo): Antippen = das MacBook fliegt weg wie eine App, das nächste gleitet nach vorn, das alte kommt leise auf seinen Platz zurück
M.forEach((m, i) => m.el.addEventListener('click', () => {
 if (performance.now() - klickSperre < 350) return;
 if (i !== vorn) { zuGeraet(i); return; }
 if (m.flug) return; m.flug = zeit; zuGeraet(i + 1 < N ? i + 1 : 0);
}));
groesse(); scroll(); requestAnimationFrame(bild);
})();
