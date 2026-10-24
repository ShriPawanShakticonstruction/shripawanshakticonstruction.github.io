// Keep navigation independent of language preferences and browser storage.
(function () {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  const toggle = nav.querySelector('.mobile-toggle');
  const links = nav.querySelector('.nav-links');
  const dropdown = nav.querySelector('.dropdown');
  const services = nav.querySelector('.drop-trigger');
  const language = nav.querySelector('.lang-switcher');
  const languageTrigger = nav.querySelector('.lang-trigger');

  function setOpen(container, trigger, open) {
    if (container && trigger) {
      container.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    }
  }
  function closePanels() {
    setOpen(dropdown, services, false);
    setOpen(language, languageTrigger, false);
  }
  function closeNavigation() {
    closePanels();
    setOpen(links, toggle, false);
  }
  toggle?.addEventListener('click', () => {
    const open = !links.classList.contains('open');
    closePanels();
    setOpen(links, toggle, open);
  });
  services?.addEventListener('click', () => {
    const open = !dropdown.classList.contains('open');
    closePanels();
    setOpen(dropdown, services, open);
  });
  languageTrigger?.addEventListener('click', () => {
    const open = !language.classList.contains('open');
    closePanels();
    setOpen(language, languageTrigger, open);
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) closeNavigation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (language?.classList.contains('open')) {
      setOpen(language, languageTrigger, false);
      languageTrigger.focus();
    } else if (dropdown?.classList.contains('open')) {
      setOpen(dropdown, services, false);
      services.focus();
    } else if (links?.classList.contains('open')) {
      closeNavigation();
      toggle.focus();
    }
  });
  window.matchMedia('(max-width: 1180px)').addEventListener('change', closeNavigation);
})();
