import subprocess,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def browser(*args):
 result=subprocess.run(['coderabbit-agent-browser',*args],capture_output=True,text=True,timeout=90)
 if result.returncode:raise RuntimeError(result.stdout+result.stderr)
 return result.stdout.strip()
def evaluate(source):
 result=browser('eval',source)
 try:
  result=json.loads(result)
  if isinstance(result,str):result=json.loads(result)
 except json.JSONDecodeError:pass
 return result
matrix=r'''(async () => {
  const root = document.documentElement;
  const langs = [...document.querySelectorAll('#site-language-select option')].map(x => x.value);
  await SiteLanguage.setLanguage('en');
  const normalise = x => x.replace(/\s+/g,' ').trim();
  const skip = 'script, style, noscript, .site-language, [translate="no"], [contenteditable="true"], #count';
  const nodes=[]; const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let node;
  while(node=walker.nextNode()) if(node.parentElement && !node.parentElement.closest(skip) && normalise(node.nodeValue)) nodes.push([node,normalise(node.nodeValue)]);
  const attrs=[];
  document.querySelectorAll('[title],[alt],[placeholder],[aria-label],meta[name="description"]').forEach(el=>{
    if(el.closest(skip))return;
    for(const name of ['title','alt','placeholder','aria-label',...(el.matches('meta[name="description"]')?['content']:[])])if(el.hasAttribute(name))attrs.push([el,name,el.getAttribute(name)]);
  });
  const input=document.querySelector('input[type=text]'); if(input) input.value='Visitor input: Dabra বাংলা हिंदी';
  const values=[...document.querySelectorAll('form option')].map(x=>x.value);
  let checked=0;
  for(const lang of langs){
    await SiteLanguage.setLanguage(lang);
    await new Promise(resolve=>setTimeout(resolve,0));
    if(root.lang!==lang)throw new Error('Language switch failed '+lang);
    const strings=lang==='en'?{}:(await (await fetch('assets/locales/'+lang+'.json')).json()).strings;
    for(const [n,source] of nodes){
      const expected=strings[source]||source;
      if(normalise(n.nodeValue)!==normalise(expected))throw new Error(lang+' text mismatch '+source.slice(0,90)+' -> '+n.nodeValue.slice(0,90));
    }
    for(const [el,name,source] of attrs){
      const expected=strings[source]||source;
      if(normalise(el.getAttribute(name))!==normalise(expected))throw new Error(lang+' attribute '+name+' mismatch '+source);
    }
    if(input && input.value!=='Visitor input: Dabra বাংলা हिंदी')throw new Error('User input changed');
    if(JSON.stringify([...document.querySelectorAll('form option')].map(x=>x.value))!==JSON.stringify(values))throw new Error('Submitted values changed');
    if(root.dir!==(['ar','ur'].includes(lang)?'rtl':'ltr'))throw new Error('Wrong page direction');
    if(document.documentElement.scrollWidth>innerWidth+1)throw new Error(lang+' horizontal overflow '+document.documentElement.scrollWidth+'>'+innerWidth);
    checked+=nodes.length+attrs.length;
  }
  return JSON.stringify({page:location.pathname,languages:langs.length,assertions:checked,formValuesPreserved:true});
})()'''
for p in sorted(ROOT.glob('*.html')):
 browser('open','http://localhost:3000/'+p.name)
 browser('set','viewport','375','812')
 result=evaluate(matrix)
 print('PASS',result,flush=True)
print('PASS all pages in every advertised language at mobile width',flush=True)
