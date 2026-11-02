/* Pagerush 02.11.2026: Start-Intro – Scroll bleibt kurz gesperrt, bis das Logo gelandet ist */
(() => {
 const lm = document.getElementById('logoMit'); if (!lm) return;
 const s = document.createElement('div'); s.className = 'logo-schatten'; lm.appendChild(s);
 if (scrollY > 40 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const h = document.documentElement; h.classList.add('intro-sperre');
 setTimeout(() => h.classList.remove('intro-sperre'), 2500);
})();
