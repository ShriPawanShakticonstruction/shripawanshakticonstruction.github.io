/* Complete, self-hosted page translations. Visitor data never leaves the website. */
(() => {
  'use strict';
  const supported = new Set(['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'ur', 'kok', 'mni', 'es', 'fr', 'de', 'ar', 'ru']);
  const rtl = new Set(['ar', 'ur']);
  const catalogRoot = new URL('locales/', document.currentScript.src);
  const catalogs = new Map([['en', {}]]);
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const normalise = value => value.replace(/\s+/g, ' ').trim();
  const excluded = 'script, style, noscript, .site-language, [translate="no"], [contenteditable="true"]';
  let current = 'en';
  let dictionary = {};
  let request = 0;
  let observer;
  let select;
  let status;

  function translate(source, parameters = {}) {
    const result = Object.hasOwn(dictionary, source) ? dictionary[source] : source;
    return result.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(parameters, name) ? String(parameters[name]) : match);
  }

  function localiseFileControls() {
    document.querySelectorAll('input[type="file"]').forEach(input => {
      if (input.closest('.localized-file-control')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'localized-file-control';
      const button = document.createElement('span');
      button.className = 'file-control-button';
      button.textContent = 'Choose file';
      button.setAttribute('aria-hidden', 'true');
      const empty = document.createElement('span');
      empty.textContent = 'No file selected';
      empty.setAttribute('aria-hidden', 'true');
      const filename = document.createElement('span');
      filename.setAttribute('translate', 'no');
      filename.hidden = true;
      filename.setAttribute('aria-hidden', 'true');
      if (!input.labels.length && !input.hasAttribute('aria-label')) input.setAttribute('aria-label', 'Choose file');
      input.replaceWith(wrapper);
      wrapper.append(button, empty, filename, input);
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        filename.textContent = file?.name || '';
        filename.hidden = !file;
        empty.hidden = Boolean(file);
      });
    });
  }

  function render() {
    observer?.disconnect();
    localiseFileControls();
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement || node.parentElement.closest(excluded)) continue;
      const raw = node.nodeValue;
      if (!normalise(raw)) continue;
      let original = originals.get(node);
      if (!original || raw !== original.rendered) {
        original = { source: normalise(raw), before: raw.match(/^\s*/)[0], after: raw.match(/\s*$/)[0] };
        originals.set(node, original);
      }
      original.rendered = original.before + translate(original.source) + original.after;
      if (raw !== original.rendered) node.nodeValue = original.rendered;
    }
    document.querySelectorAll('[title], [alt], [placeholder], [aria-label], meta[name="description"]').forEach(element => {
      if (element.closest(excluded)) return;
      let saved = attributes.get(element);
      if (!saved) { saved = {}; attributes.set(element, saved); }
      for (const name of ['title', 'alt', 'placeholder', 'aria-label', ...(element.matches('meta[name="description"]') ? ['content'] : [])]) {
        if (!element.hasAttribute(name)) continue;
        const value = element.getAttribute(name);
        if (!saved[name] || value !== saved[name].rendered) saved[name] = { source: normalise(value) };
        saved[name].rendered = translate(saved[name].source);
        if (value !== saved[name].rendered) element.setAttribute(name, saved[name].rendered);
      }
    });
    // Language names remain in their native scripts so visitors can recognise them.
    if (select) {
      select.value = current;
      select.setAttribute('aria-label', translate('Select website language'));
      document.querySelector('.site-language label').textContent = translate('Language');
    }
    document.documentElement.lang = current;
    document.documentElement.dir = rtl.has(current) ? 'rtl' : 'ltr';
    observer?.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'alt', 'placeholder', 'aria-label'] });
  }

  async function setLanguage(language) {
    if (!supported.has(language)) language = 'en';
    const id = ++request;
    document.documentElement.setAttribute('aria-busy', 'true');
    status.textContent = translate('Loading language...');
    try {
      if (!catalogs.has(language)) {
        const response = await fetch(new URL(`${language}.json?v=20261024-final`, catalogRoot));
        if (!response.ok) throw new Error('Language file unavailable');
        const catalog = await response.json();
        if (catalog.language !== language || !catalog.strings || typeof catalog.strings !== 'object' || !Object.values(catalog.strings).every(value => typeof value === 'string')) throw new Error('Invalid language file');
        catalogs.set(language, catalog.strings);
      }
      if (id !== request) return;
      current = language;
      dictionary = catalogs.get(language);
      try { sessionStorage.setItem('spc_language', current); } catch { /* Links below retain the choice when storage is unavailable. */ }
      // Keep reloads consistent when the previous page carried an explicit language.
      const url = new URL(location.href);
      if (current === 'en') url.searchParams.delete('lang');
      else url.searchParams.set('lang', current);
      try { history.replaceState(null, '', url); } catch { /* Session storage and links still retain the choice. */ }
      render();
      status.textContent = '';
      document.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language: current } }));
    } catch {
      if (id !== request) return;
      select.value = current;
      status.textContent = translate('The language could not be loaded. Please try again.');
    } finally {
      if (id === request) document.documentElement.removeAttribute('aria-busy');
    }
  }

  window.SiteLanguage = { t: translate, setLanguage, get language() { return current; } };
  function initialise() {
    select = document.getElementById('site-language-select');
    status = document.createElement('p');
    status.className = 'language-status';
    status.setAttribute('role', 'status');
    status.setAttribute('translate', 'no');
    document.querySelector('.site-language').append(status);
    let saved = 'en';
    try { saved = sessionStorage.getItem('spc_language') || 'en'; } catch { /* First-time visitors use English. */ }
    const explicit = new URL(location.href).searchParams.get('lang');
    if (explicit && supported.has(explicit)) saved = explicit;
    observer = new MutationObserver(render);
    select.addEventListener('change', () => { setLanguage(select.value); });
    // Preserve selection for internal navigation, including browsers that block storage.
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (current === 'en') url.searchParams.delete('lang');
      else url.searchParams.set('lang', current);
      anchor.href = url.href;
    });
    render();
    setLanguage(saved);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
