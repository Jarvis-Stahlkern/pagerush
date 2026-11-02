/* Pagerush – schwebende Glas-Displays: echte Aufnahmen aus dem Studio (Prompt > Seite entsteht), Karussell beim Scrollen */
(() => {
const root = document.getElementById('glas'); if (!root) return;
const ring = root.querySelector('.glas-ring'), buehne = root.querySelector('.glas-buehne');
const S = [
 ['fertighaus', 'Fertighäuser', 'stahlkern-fertighaeuser.de'], ['luce', 'Restaurant', 'luce-ristorante.de'], ['luxus', 'Premium', 'nebel-studio.de'],
 ['kraemer', 'Bau', 'kraemer-bau.de'], ['mira', 'Friseur', 'mira-hairstudio.de'], ['physio', 'Praxis', 'physio-herrenberg.de'], ['sonnenkorn', 'Bäckerei', 'sonnenkorn-baeckerei.de'], ['nordlicht', 'Software', 'nordlicht.app']
];
const ZEILEN = [
 'Ein Satz – <em>und die Seite entsteht.</em>', 'Echte Fotos, <em>echte Effekte.</em>', 'Jede Branche, <em>ein eigener Stil.</em>',
 'Am PC <em>und am Handy.</em>', 'In Minuten, <em>nicht Wochen.</em>', 'Von Bäckerei <em>bis Software.</em>', 'Fotos, Texte, <em>Effekte.</em>', 'Einmalig <em>99 €.</em> Jetzt bist <em>du dran.</em>'
];
const PROMPT = ['Fertighäuser aus Holz, Herrenberg, mit Wunschhaus-Planer', 'Italienisches Restaurant, warm, mit Tischreservierung', 'Premium-Marke, Nebel, Kino-Optik', 'Bauunternehmen, modern, mit Anfrageformular', 'Friseursalon, edel, mit Online-Termin', 'Physiotherapie-Praxis, hell, mit Terminbuchung', 'Bäckerei, handwerklich, mit Öffnungszeiten', 'Software-Startup, dunkel, mit Demo-Button'];
const ck = [], war = [];
const N = S.length, STEP = 360 / N, ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const zeile = root.querySelector('.glas-zeile'), punkte = root.querySelector('.glas-punkte');
const AI = ['Dein Fertighaus-Auftritt entsteht …', 'Karte, Menü und Reservierung kommen dazu …', 'Nebel, Kino-Optik und Scroll-Film …', 'Leistungen und Anfrageformular …', 'Behandlungen und Online-Termin …', 'Terminbuchung und Praxis-Infos …', 'Sortiment und Öffnungszeiten …', 'Demo-Button und Preise …'];
const els = S.map(([n, t, u, po], i) => {
 const d = document.createElement('div'); d.className = 'scheibe';
 d.innerHTML = `<div class="scheibe-s" style="--d:${(-i * 1.3).toFixed(1)}s"><div class="mon"><div class="mon-rahmen"><i class="mon-kamera"></i><div class="scheibe-g"><div class="scheibe-schirm"><div class="mon-studio"><div class="mon-chat"><img class="chat-logo" src="neu/logo.webp?v=11" alt=""><div class="chat-b u an">${PROMPT[i]}</div><div class="chat-b k an"><span class="chat-t">${AI[i]}</span><span class="chat-pkt"><i></i><i></i><i></i></span></div></div><div class="mon-pv"><div class="pv-bar"><i></i><i></i><i></i><span>${u}</span></div><div class="pv-fl"><img class="mon-seite" src="neu/glas/seite-${n}.jpg" alt="Beispiel-Website ${t}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async"></div></div></div><div class="mon-ki an"><div class="ki-nav"><img class="ki-logo" src="neu/logo.webp?v=11" alt=""><span>Ablauf</span><span>Preis</span><em>Anmelden</em></div><div class="ki-mitte"><small>Websites, die man fühlt</small><h4>Was soll deine Website können?</h4><div class="ki-box"><span class="ki-text"></span><i class="ki-strich"></i></div><div class="ki-knopf">Mit KI bauen →</div></div></div><div class="scheibe-spiegel"></div></div><div class="scheibe-glanz"></div><div class="scheibe-dunkel"></div></div><div class="mon-hals"></div><div class="mon-fuss"></div></div><div class="scheibe-tag">${t}</div></div>`;
 ring.append(d);
 zeile.insertAdjacentHTML('beforeend', `<div>${ZEILEN[i]}</div>`); punkte.append(document.createElement('i'));
 return d;
});
const refs = els.map(e => ({ ki: e.querySelector('.mon-ki'), kt: e.querySelector('.ki-text'), cu: e.querySelector('.chat-b.u'), ck: e.querySelector('.chat-b.k'), ct: e.querySelector('.chat-t'), fl: e.querySelector('.pv-fl'), zu: 0 }));
const vids = [], seiten = els.map(e => e.querySelector('.mon-seite')), sf = els.map(() => 0);
let R = 900, ziel = 0, akt = 0, mx = 0, my = 0, amx = 0, amy = 0, vorn = -1, sichtbar = true;
function groesse() {
 const w = innerWidth, h = innerHeight, handy = w < 760;
 const sw = handy ? Math.min(w * .92, 560) : Math.min(w * .5, (h - 470) * 1.55, 980);
 root.style.setProperty('--sw', sw + 'px');
 R = (sw / 2) / Math.tan(Math.PI / N) * (handy ? 1.08 : 1.18);
 requestAnimationFrame(() => { const sc = els[0] && els[0].querySelector('.pv-fl'); if (sc && sc.clientHeight) root.style.setProperty('--sh', sc.clientHeight + 'px'); });
}
const ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const kl = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
function scroll() { const r = root.getBoundingClientRect(); ziel = ruhig ? 0 : kl(-r.top, 0, root.offsetHeight - innerHeight); }
function abspielen(i) {
 vids.forEach((v, k) => {
  const nah = Math.min((k - i + N) % N, (i - k + N) % N);
  if (k === i && sichtbar) { v.preload = 'auto'; if (v.paused) { if (v.readyState < 2) v.load(); v.play().catch(() => {}); } }
  else { if (!v.paused) v.pause(); if (nah === 1) v.preload = 'auto'; }
 });
}
let tl = 0;
function bild(t) {
 const dt = tl ? Math.min(.1, (t - tl) / 1000) : 1 / 60; tl = t || 0;
 const k1 = 1 - Math.exp(-dt * 5.5), k2 = 1 - Math.exp(-dt * 3);
 akt += (ziel - akt) * k1; amx += (mx - amx) * k2; amy += (my - amy) * k2;
 const p = akt, rein = ez(kl(p, .015, .13)), lauf = kl(p, .14, .9) * (N - 1), ganz = Math.floor(lauf), rest = lauf - ganz;
 const pos = Math.min(N - 1, ganz + ez(kl(rest, .3, .7)));
 const aus = kl(p, .92, 1);
 const rz = -R + ez(aus) * 500, ry = 0, rx = (amy * 4 - 4).toFixed(2);
 // Displays kommen aus dem Logo: winzig in der Logo-Mitte, wachsen nach vorn
 ring.style.transform = `translateY(${((1 - rein) * -3).toFixed(2)}vh) scale(${(.06 + .94 * rein).toFixed(4)})`; ring.style.opacity = Math.min(1, rein * 1.6).toFixed(3);
 els.forEach((e, i) => {
  // Webseite im Bildschirm scrollt: vorne mit dem Seiten-Scroll, hinten langsam von selbst
  let d0 = ((i - pos) % N + N) % N; if (d0 > N / 2) d0 -= N;
  const vorn1 = Math.abs(d0) < .45 && rein > .85;
  if (vorn1) { if (!war[i]) { war[i] = true; ck[i] = 0; } ck[i] += dt; } else if (Math.abs(d0) > .8) { war[i] = false; ck[i] = 99; } else if (ck[i] === undefined) ck[i] = 99;
  const c = ck[i], R_ = refs[i], ki = R_.ki, SCH = 6.2, sicht = Math.abs(d0) < 1.7;
  if (!sicht) { if (e._v !== 0) { e._v = 0; e.style.visibility = 'hidden'; e.style.opacity = 0; } return; }
  e._v = 1;
  let zielF;
  if (c < SCH) zielF = 0; else { const u = ((c - SCH) / 9) % 2, pp = u > 1 ? 2 - u : u; zielF = pp * pp * (3 - 2 * pp); }
  if (!vorn1 && c >= 99) zielF = .5 - .5 * Math.cos((t || 0) * .00022 + i * 1.7);
  sf[i] += (zielF - sf[i]) * (1 - Math.exp(-dt * (c < SCH + .6 ? 9 : 3))); seiten[i].style.setProperty('--f', sf[i].toFixed(4));
  // Ablauf im Monitor: 0 Pagerush-Seite, Eingabe tippt, Klick, dann Studio: Chat links, Vorschau baut sich auf, danach scrollt sie von selbst
  const an = vorn1 && c < 3.0;
  if (ki._an !== an) { ki._an = an; ki.classList.toggle('an', an); }
  if (an) {
   const txt = PROMPT[i], n = Math.floor(Math.min(1, Math.max(0, (c - .35) / 1.7)) * txt.length), kt = R_.kt;
   if (kt._n !== n) { kt._n = n; kt.textContent = txt.slice(0, n); }
   ki.classList.toggle('klick', c > 2.3);
  }
  const voll = !(vorn1 && c < SCH);
  const rev = voll && !(vorn1 && c < 6) ? 1 : Math.min(1, Math.max(0, (c - 3.1) / 2.6));
  const rr = Math.round(rev * 200);
  if (R_.rv !== rr) { R_.rv = rr; R_.fl.style.setProperty('--rev', (rr / 200).toFixed(3)); R_.fl.classList.toggle('lauf', rr > 0 && rr < 200); }
  const sU = !vorn1 || c > 3.05, sK = !vorn1 || c > 3.6, fertig = !vorn1 || c > 5.9;
  if (R_.su !== sU) { R_.su = sU; R_.cu.classList.toggle('an', sU); }
  if (R_.sk !== sK) { R_.sk = sK; R_.ck.classList.toggle('an', sK); }
  if (R_.sf !== fertig) { R_.sf = fertig; R_.ck.classList.toggle('fertig', fertig); R_.ct.textContent = fertig ? 'Fertig – scroll dir die Vorschau an.' : AI[i]; }
  const a = i * STEP; let diff = ((i - pos) % N + N) % N; if (diff > N / 2) diff -= N;
  const hell = Math.max(0, 1 - Math.abs(diff));
  e.style.transform = `translateY(${ry}px) translateZ(${rz.toFixed(1)}px) rotateX(${rx}deg) rotateY(${(a - pos * STEP + amx * 6).toFixed(2)}deg) translateZ(${R.toFixed(1)}px) translateY(${(Math.sin(i * 2.1) * 30 * (1 - hell)).toFixed(1)}px)`;
  e.style.setProperty('--hell', hell.toFixed(3)); e.style.setProperty('--rot', (diff * 40).toFixed(1));
  e.style.zIndex = Math.round(hell * 10); e.style.opacity = Math.max(0, Math.min(1, 1.6 - Math.abs(diff))).toFixed(3); e.style.visibility = Math.abs(diff) > 1.7 ? 'hidden' : '';
 });
 const i = Math.round(pos);
 if (i !== vorn) { vorn = i; abspielen(i); [...zeile.children].forEach((z, k) => z.classList.toggle('an', k === i)); [...punkte.children].forEach((z, k) => z.classList.toggle('an', k <= i)); }
 root.querySelector('.glas-kopf').style.opacity = 1 - kl(p, .02, .07);
 root.querySelector('.glas-hinweis').style.opacity = 1 - kl(p, .0, .06);
 buehne.style.opacity = 1 - aus; root.querySelector('.glas-unten').style.opacity = 1 - kl(p, .86, .94); zeile.style.opacity = punkte.style.opacity = kl(p, .1, .15).toFixed(3);
 window.__glas = { akt, ziel, pos }; requestAnimationFrame(bild);
}
// Staubteilchen im Licht
const st = root.querySelector('.glas-staub');
for (let k = 0; k < 26; k++) { const t = document.createElement('i'); t.style.left = (Math.random() * 100) + '%'; t.style.top = (30 + Math.random() * 65) + '%'; t.style.animationDelay = (-Math.random() * 9) + 's'; t.style.animationDuration = (7 + Math.random() * 6) + 's'; st.append(t); }
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; } }, { passive: true });
addEventListener('scroll', scroll, { passive: true });
addEventListener('resize', () => { groesse(); scroll(); });
new IntersectionObserver(e => { sichtbar = e[0].isIntersecting; if (!sichtbar) vids.forEach(v => v.pause()); else { vorn = -1; } }).observe(root);
els.forEach((e, i) => e.addEventListener('click', () => { const ziel2 = .1 + .8 * i / (N - 1); scrollTo({ top: root.offsetTop + ziel2 * (root.offsetHeight - innerHeight), behavior: 'smooth' }); }));
groesse(); scroll(); requestAnimationFrame(bild);
})();
