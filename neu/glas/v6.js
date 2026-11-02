/* Pagerush 02.11.2026 19:40: „Deine eigene Adresse.“ – Wort für Wort animiert, bei jedem neuen Hineinscrollen wieder */
(() => {
 const h = document.querySelector('.dom h2'); if (!h) return;
 let i = 0;
 const teile = n => { [...n.childNodes].forEach(k => {
  if (k.nodeType === 3) { const f = document.createDocumentFragment(); k.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { f.append(w); return; } const s = document.createElement('span'); s.className = 'wd'; s.style.setProperty('--i', i++); s.textContent = w; f.append(s); }); k.replaceWith(f); }
  else if (k.nodeType === 1 && k.tagName !== 'BR') teile(k);
 }); };
 teile(h); const l = document.createElement('i'); l.className = 'wd-licht'; l.setAttribute('aria-hidden', 'true'); h.append(l);
 new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) h.classList.add('wd-an'); else if (e.boundingClientRect.top > 0) h.classList.remove('wd-an'); }), { threshold: .35 }).observe(h);
})();
