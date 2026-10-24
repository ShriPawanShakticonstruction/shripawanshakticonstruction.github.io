"""Exercise visitor defaults, failure recovery, navigation and dynamic UI."""
import json
import subprocess

def browser(*args):
    result = subprocess.run(['coderabbit-agent-browser', *args], capture_output=True, text=True, timeout=90)
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    return result.stdout.strip()

def evaluate(script):
    return browser('eval', script)

browser('open', 'http://localhost:3000/index.html')
evaluate("sessionStorage.clear(); localStorage.setItem('spc_language', 'hi')")
browser('open', 'http://localhost:3000/index.html')
evaluate("if (document.documentElement.lang !== 'en') throw new Error('A new visitor did not start in English')")
evaluate("(async()=>{ await Promise.all([SiteLanguage.setLanguage('bn'),SiteLanguage.setLanguage('hi'),SiteLanguage.setLanguage('ar')]); if(document.documentElement.lang!=='ar'||document.documentElement.dir!=='rtl')throw new Error('Rapid selection lost'); await SiteLanguage.setLanguage('en'); if(new URL(location.href).searchParams.has('lang'))throw new Error('English URL retained stale language'); })()")
browser('reload')
evaluate("if(document.documentElement.lang!=='en')throw new Error('English selection lost on reload')")
print('PASS English visitor default, rapid switching and English reload', flush=True)

browser('open', 'http://localhost:3000/index.html')
evaluate("SiteLanguage.setLanguage('bn')")
browser('network', 'route', '**/locales/fr.json*', '--abort')
try:
    evaluate("(async()=>{await SiteLanguage.setLanguage('fr');if(document.documentElement.lang!=='bn'||document.getElementById('site-language-select').value!=='bn'||!document.querySelector('.language-status').textContent||document.documentElement.hasAttribute('aria-busy'))throw new Error('Failed language file left inconsistent UI');})()")
finally:
    browser('network', 'unroute', '**/locales/fr.json*')
evaluate("(async()=>{await SiteLanguage.setLanguage('fr');if(document.documentElement.lang!=='fr'||document.querySelector('.language-status').textContent)throw new Error('Retry did not recover');})()")
print('PASS language download failure retains active language and retry recovers', flush=True)

browser('open', 'http://localhost:3000/index.html')
browser('set', 'viewport', '1440', '900')
evaluate("(async()=>{Object.defineProperty(Storage.prototype,'getItem',{configurable:true,value(){throw new Error('Storage blocked')}});Object.defineProperty(Storage.prototype,'setItem',{configurable:true,value(){throw new Error('Storage blocked')}});await SiteLanguage.setLanguage('bn');})()")
browser('click', '.nav-links a[href="privacy.html"]')
evaluate("if(document.documentElement.lang!=='bn'||!location.search.includes('lang=bn'))throw new Error('Language lost during navigation without storage')")
print('PASS Bengali selection preserved across real navigation with storage blocked', flush=True)

browser('open', 'http://localhost:3000/build-your-own-city.html?lang=bn')
browser('click', '#random')
evaluate("if(!document.querySelector('#count').textContent.includes('6')||document.querySelector('#count').textContent.includes('items placed'))throw new Error('Dynamic count did not translate')")
evaluate("(async()=>{await SiteLanguage.setLanguage('en');if(document.querySelector('#count').textContent!=='6 items placed'||document.querySelector('.item[title]').title!=='Tap to remove')throw new Error('Dynamic count/title did not reset to English');})()")
browser('click', '#reset')
evaluate("if(document.querySelector('#count').textContent!=='0 items placed')throw new Error('Reset counter failed')")
print('PASS dynamic city counters and object descriptions translate and reset', flush=True)

browser('open', 'http://localhost:3000/apply.html?lang=hi')
evaluate("(async()=>{const input=document.querySelector('#resume');const files=new DataTransfer();files.items.add(new File(['synthetic fixture'],'example.pdf',{type:'application/pdf'}));input.files=files.files;input.dispatchEvent(new Event('change',{bubbles:true}));await SiteLanguage.setLanguage('bn');if(input.files[0].name!=='example.pdf'||input.closest('.localized-file-control').querySelector('[translate=no]').textContent!=='example.pdf')throw new Error('Selected file was changed');if(input.closest('.localized-file-control').querySelector('.file-control-button').textContent==='Choose file')throw new Error('File button not translated');})()")
print('PASS file control translates while the selected filename stays unchanged', flush=True)

for page in ['index.html','company.html','gallery.html','privacy.html','terms.html','electrical.html','road.html','apply.html']:
    browser('open', 'http://localhost:3000/'+page)
    for width in ['320','768','1440']:
        browser('set','viewport',width,'900')
        evaluate("(async()=>{for(const lang of ['en','hi','bn','de','ar']){await SiteLanguage.setLanguage(lang);await new Promise(r=>setTimeout(r,0));if(document.documentElement.scrollWidth>innerWidth+1)throw new Error('Overflow '+location.pathname+' '+lang+' '+innerWidth);}})()")
    print('PASS responsive widths for',page,flush=True)
print('PASS language behavior and layout checks')
