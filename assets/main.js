(function () {
  const translations = {
    en: {
      home: 'Home',
      company: 'Company',
      projects: 'Projects',
      privacy: 'Privacy',
      contact: 'Contact',
      services: 'Services',
      sendEnquiry: 'Send Enquiry',
      quickQuote: 'Send Enquiry',
      language: 'Language',
      title: 'Language'
    },
    hi: {
      home: 'होम',
      company: 'कंपनी',
      projects: 'प्रोजेक्ट्स',
      privacy: 'गोपनीयता',
      contact: 'संपर्क',
      services: 'सेवाएँ',
      sendEnquiry: 'अभी पूछें',
      quickQuote: 'अभी पूछें',
      language: 'भाषा',
      title: 'भाषा'
    },
    ta: {
      home: 'முகப்பு',
      company: 'நிறுவனம்',
      projects: 'திட்டங்கள்',
      privacy: 'தனியுரிமை',
      contact: 'தொடர்பு',
      services: 'சேவைகள்',
      sendEnquiry: 'விசாரிக்கவும்',
      quickQuote: 'விசாரிக்கவும்',
      language: 'மொழி',
      title: 'மொழி'
    },
    te: {
      home: 'హోమ్',
      company: 'కంపెనీ',
      projects: 'ప్రాజెక్టులు',
      privacy: 'గోప్యత',
      contact: 'సంప్రదింపు',
      services: 'సేవలు',
      sendEnquiry: 'అభ్యర్థన పంపు',
      quickQuote: 'అభ్యర్థన పంపు',
      language: 'భాష',
      title: 'భాష'
    },
    kn: {
      home: 'ಹೊ domestic',
      company: 'ಕಂಪನಿ',
      projects: 'ಪ್ರಾಜೆಕ್ಟ್ಗಳು',
      privacy: 'ಗೌಪ್ಯತೆ',
      contact: 'ಸಂಪರ್ಕ',
      services: 'ಸೇವೆಗಳು',
      sendEnquiry: 'ವಿಚಾರಿಸಿ',
      quickQuote: 'ವಿಚಾರಿಸಿ',
      language: 'ಭಾಷೆ',
      title: 'ಭಾಷೆ'
    },
    ml: {
      home: 'ഹോം',
      company: 'കമ്പനി',
      projects: 'പ്രോജക്ടുകൾ',
      privacy: 'സ്വകാര്യത',
      contact: 'ബന്ധപ്പെടുക',
      services: 'പണി',
      sendEnquiry: 'ചോദിക്കുക',
      quickQuote: 'ചോദിക്കുക',
      language: 'ഭാഷ',
      title: 'ഭാഷ'
    },
    mr: {
      home: 'मुख्यपृष्ठ',
      company: 'कंपनी',
      projects: 'प्रकल्प',
      privacy: 'गोपनीयता',
      contact: 'संपर्क',
      services: 'सेवा',
      sendEnquiry: 'पृच्छा करा',
      quickQuote: 'पृच्छा करा',
      language: 'भाषा',
      title: 'भाषा'
    },
    gu: {
      home: 'હોમ',
      company: 'કંપની',
      projects: 'પ્રોજેક્ટ્સ',
      privacy: 'ગોપનીયતા',
      contact: 'સંપર્ક',
      services: 'સેવા',
      sendEnquiry: 'ભરો',
      quickQuote: 'ભરો',
      language: 'ભાષા',
      title: 'ભાષા'
    },
    bn: {
      home: 'হোম',
      company: 'কোম্পানি',
      projects: 'প্রজেক্ট',
      privacy: 'গোপনীয়তা',
      contact: 'যোগাযোগ',
      services: 'সেবা',
      sendEnquiry: 'অনুসন্ধান পাঠান',
      quickQuote: 'অনুসন্ধান পাঠান',
      language: 'ভাষা',
      title: 'ভাষা'
    },
    pa: {
      home: 'ਹੋਮ',
      company: 'ਕੰਪਨੀ',
      projects: 'ਪ੍ਰੋਜੈਕਟ',
      privacy: 'ਪ੍ਰਾਈਵੇਸੀ',
      contact: 'ਸੰਪਰਕ',
      services: 'ਸੇਵਾਵਾਂ',
      sendEnquiry: 'ਪੁੱਛਗੁ',
      quickQuote: 'ਪੁੱਛਗੁ',
      language: 'ਭਾਸ਼ਾ',
      title: 'ਭਾਸ਼ਾ'
    },
    or: {
      home: 'ଘର',
      company: 'କମ୍ପାନୀ',
      projects: 'ପ୍ରୋଜେକ୍ଟ',
      privacy: 'ଗୋପନୀୟତା',
      contact: 'ସମ୍ପର୍କ',
      services: 'ସେବା',
      sendEnquiry: 'ପଚାର',
      quickQuote: 'ପଚାର',
      language: 'ଭାଷା',
      title: 'ଭାଷା'
    },
    ru: {
      home: 'Главная',
      company: 'Компания',
      projects: 'Проекты',
      privacy: 'Конфиденциальность',
      contact: 'Контакт',
      services: 'Услуги',
      sendEnquiry: 'Отправить запрос',
      quickQuote: 'Отправить запрос',
      language: 'Язык',
      title: 'Язык'
    },
    fr: {
      home: 'Accueil',
      company: 'Entreprise',
      projects: 'Projets',
      privacy: 'Confidentialité',
      contact: 'Contact',
      services: 'Services',
      sendEnquiry: 'Envoyer une demande',
      quickQuote: 'Envoyer une demande',
      language: 'Langue',
      title: 'Langue'
    }
  };

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
    const dropdowns = $$(' .dropdown');
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

  function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (dict[key]) {
        node.textContent = dict[key];
      }
    });

    const select = document.getElementById('language-switcher');
    if (select) {
      select.value = lang;
    }

    localStorage.setItem('spc_lang', lang);
    document.documentElement.lang = lang;
  }

  function setupLanguageSelector() {
    const select = document.getElementById('language-switcher');
    if (!select) return;
    select.addEventListener('change', (event) => {
      applyTranslations(event.target.value);
    });

    const savedLang = localStorage.getItem('spc_lang') || 'en';
    applyTranslations(savedLang);
  }

  function init() {
    setupMenuToggle();
    setupDropdowns();
    setupLanguageSelector();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
