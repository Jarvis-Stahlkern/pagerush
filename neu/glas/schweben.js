/* Pagerush 02.11.2026 19:15: Überschriften Wort für Wort animieren (em-Teile bleiben ein Stück, damit der Farbverlauf hält) */
(() => {
 function teilen(el) {
  let i = 0;
  const lauf = n => [...n.childNodes].forEach(k => {
   if (k.nodeType === 3) {
    const f = document.createDocumentFragment();
    k.textContent.split(/(\s+)/).forEach(w => {
     if (!w) return; if (/^\s+$/.test(w)) { f.append(' '); return; }
     const o = document.createElement('span'); o.className = 'wo'; const x = document.createElement('span'); x.className = 'wi'; x.style.setProperty('--i', i++); x.textContent = w; o.append(x); f.append(o);
    });
    k.replaceWith(f);
   } else if (k.nodeType === 1 && k.tagName === 'EM') {
    const o = document.createElement('span'); o.className = 'wo'; k.replaceWith(o); o.append(k); k.classList.add('wi'); k.style.setProperty('--i', i++);
   } else if (k.nodeType === 1 && k.tagName !== 'BR') lauf(k);
  });
  lauf(el); el.classList.add('wt');
 }
 // Glas-Zeilen kommen erst später (monitor.js baut sie) – kurz warten
 const los = () => {
  document.querySelectorAll('h2.rv, .glas-kopf h1, .glas-zeile div, .preis h2, .dom h2').forEach(teilen);
  const h1 = document.querySelector('.glas-kopf h1'); if (h1) { h1.style.setProperty('--v', '1700ms'); requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add('an'))); }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('an'); io.unobserve(e.target); } }), { threshold: .3 });
  document.querySelectorAll('.wt:not(.glas-zeile div)').forEach(x => io.observe(x));
 };
 if (document.readyState === 'loading') addEventListener('DOMContentLoaded', los); else los();
})();
