// assets/main.js
// Mobile menu toggle, dropdowns, and a simple public login modal.
// Safe for client-side only — not a secure auth (just convenience).

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

  function setupPublicLogin() {
    const modalHtml = `
      <div id="spc-login-modal" style="display:none;position:fixed;inset:0;z-index:9999;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.45)"></div>
        <div style="position:relative;background:#fff;border-radius:12px;max-width:420px;width:92%;padding:22px;box-shadow:0 20px 60px rgba(10,20,30,0.35);">
          <h3 style="margin:0 0 8px;font-family:Inter,Arial,sans-serif;">Public Login</h3>
          <p style="margin:0 0 14px;color:#444;font-size:14px">Enter password to access public admin features.</p>
          <input id="spc-login-pass" type="password" placeholder="Password" style="width:100%;padding:10px;border:1px solid #e6e6e6;border-radius:8px;margin-bottom:12px" />
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button id="spc-login-cancel" style="padding:8px 12px;border-radius:8px;border:1px solid #cfcfcf;background:#fff;cursor:pointer">Cancel</button>
            <button id="spc-login-submit" style="padding:8px 12px;border-radius:8px;border:0;background:#1f8cff;color:#fff;cursor:pointer">Login</button>
          </div>
          <div id="spc-login-msg" style="margin-top:10px;color:#b00;font-size:13px;min-height:18px"></div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = modalHtml;
    document.body.appendChild(container);

    const modal = document.getElementById('spc-login-modal');
    const passInput = document.getElementById('spc-login-pass');
    const msg = document.getElementById('spc-login-msg');
    const submit = document.getElementById('spc-login-submit');
    const cancel = document.getElementById('spc-login-cancel');

    function showLogin() {
      msg.textContent = '';
      passInput.value = '';
      modal.style.display = 'flex';
      passInput.focus();
    }
    function hideLogin() {
      modal.style.display = 'none';
    }

    cancel.addEventListener('click', hideLogin);

    submit.addEventListener('click', () => {
      const entered = passInput.value || '';
      const expected = (window.SPC_ADMIN && window.SPC_ADMIN.passCode) ? window.SPC_ADMIN.passCode : '';

      if (!expected) {
        msg.style.color = '#b00';
        msg.textContent = 'Login not configured.';
        return;
      }

      if (entered === expected) {
        sessionStorage.setItem('spc_public_token', 'public_ok');
        msg.style.color = 'green';
        msg.textContent = 'Login successful.';
        setTimeout(hideLogin, 600);
      } else {
        msg.style.color = '#b00';
        msg.textContent = 'Incorrect password.';
      }
    });

    const adminLink = document.querySelector('a.nav-cta') || document.querySelector('a[href*="admin.html"]');
    if (adminLink) {
      adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
      });
    }

    window.spcShowLogin = showLogin;
  }

  function init() {
    setupMenuToggle();
    setupDropdowns();
    setupPublicLogin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
