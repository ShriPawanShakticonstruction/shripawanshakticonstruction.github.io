(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function setupMenuToggle() {
    const toggle = document.querySelector('.mobile-toggle') || document.querySelector('.menuBtn');
    const nav = document.querySelector('.nav-links') || document.querySelector('.navlinks');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      nav.classList.toggle('open');
      nav.style.display = nav.classList.contains('open') ? 'flex' : 'none';
    });

    nav.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a' && window.innerWidth <= 900) {
        nav.classList.remove('open');
        nav.style.display = 'none';
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        nav.style.display = 'flex';
        nav.classList.remove('open');
      } else if (!nav.classList.contains('open')) {
        nav.style.display = 'none';
      }
    });

    if (window.innerWidth > 900) {
      nav.style.display = 'flex';
    } else {
      nav.style.display = 'none';
    }
  }

  function setupDropdowns() {
    const dropdowns = $$('.dropdown');
    dropdowns.forEach((dd) => {
      const trigger = dd.querySelector('.drop-trigger') || dd.querySelector('.dropdownBtn') || dd.querySelector('button');
      if (!trigger) return;
      trigger.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        dropdowns.forEach(d => { if (d !== dd) d.classList.remove('open'); });
        dd.classList.toggle('open');
      });
    });

    document.addEventListener('click', () => {
      dropdowns.forEach(d => d.classList.remove('open'));
    });
  }

  function init() {
    setupMenuToggle();
    setupDropdowns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
