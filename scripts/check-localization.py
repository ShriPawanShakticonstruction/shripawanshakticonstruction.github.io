#!/usr/bin/env python3
"""Check complete language coverage, source copy, links and policy invariants."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ATTRIBUTES = ('title', 'alt', 'placeholder', 'aria-label')
LANGUAGES = {'en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'ur', 'kok', 'mni', 'es', 'fr', 'de', 'ar', 'ru'}

def normalise(text):
    return re.sub(r'\s+', ' ', text).strip()

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.stack = []
        self.strings = set()
        self.ids = set()
        self.references = []
        self.languages = set()
        self.scripts = []
        self.policy = []
        self.term_words = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        inherited = self.stack[-1][1] if self.stack else False
        excluded = inherited or tag in ('script', 'style', 'noscript') or 'site-language' in attrs.get('class', '').split() or attrs.get('translate') == 'no'
        policy = (self.stack[-1][2] if self.stack else False) or 'privacy-box' in attrs.get('class', '').split()
        term = (self.stack[-1][3] if self.stack else False) or ('legal-document' in attrs.get('class', '').split())
        if attrs.get('id'):
            assert attrs['id'] not in self.ids, f'{self.path.name}: duplicate ID {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'html':
            assert attrs.get('lang') == 'en', f'{self.path.name}: initial language must be English'
        if tag == 'script':
            self.scripts.append(attrs.get('src', ''))
        for attr in ('href', 'src'):
            if attrs.get(attr):
                self.references.append(attrs[attr])
        if not excluded:
            for attr in ATTRIBUTES:
                if attrs.get(attr):
                    self.strings.add(normalise(attrs[attr]))
            if tag == 'meta' and attrs.get('name') == 'description':
                self.strings.add(normalise(attrs['content']))
        if tag == 'option' and inherited:
            self.languages.add(attrs.get('value'))
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append((tag, excluded, policy, term))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if not self.stack or self.stack[-1][1]:
            return
        text = normalise(data)
        if text:
            self.strings.add(text)
            if self.stack[-1][2]:
                self.policy.append(text)
            if self.stack[-1][3]:
                self.term_words.extend(text.split())


def main():
    catalogs = {path.stem: json.loads(path.read_text()) for path in (ROOT / 'assets/locales').glob('*.json')}
    assert set(catalogs) == LANGUAGES, 'Catalog languages must match the selector'
    source = catalogs['en']['strings']
    for language, catalog in catalogs.items():
        assert catalog['language'] == language
        assert set(catalog['strings']) == set(source), f'{language}: missing or extra translation keys'
        for key, value in catalog['strings'].items():
            assert isinstance(value, str) and value.strip(), f'{language}: empty translation: {key}'
            assert set(re.findall(r'\{\w+\}', key)) == set(re.findall(r'\{\w+\}', value)), f'{language}: broken template: {key}'
            assert not re.search(r'\[\d{4}\]', value), f'{language}: leaked batch marker'
            assert '\n' not in value and '\r' not in value, f'{language}: text from multiple source entries was combined'
            if not any(c.isalpha() for c in key):
                assert value == key, f'{language}: numeric/icon-only source was changed: {key}'
        if language != 'en':
            unchanged = [key for key in source if len(key) > 80 and catalog['strings'][key] == key]
            assert not unchanged, f'{language}: untranslated sentences: {unchanged[:2]}'
    pages = {path: Page(path) for path in ROOT.glob('*.html')}
    links = 0
    for path, page in pages.items():
        assert page.languages == LANGUAGES, f'{path.name}: incomplete language selector'
        assert any(src.startswith('assets/i18n.js?') for src in page.scripts), f'{path.name}: translation script missing'
        assert page.strings <= set(source), f'{path.name}: untranslated source keys {page.strings - set(source)}'
        for ref in page.references:
            url = urlsplit(ref)
            if url.scheme or url.netloc:
                continue
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            assert target.exists(), f'{path.name}: missing target {ref}'
            if url.fragment and target in pages:
                assert unquote(url.fragment) in pages[target].ids, f'{path.name}: missing fragment {ref}'
            links += 1
    privacy = pages[ROOT / 'privacy.html']
    digest = hashlib.sha256('\n'.join(privacy.policy).encode()).hexdigest()
    assert digest == 'b47700d25db7b809b91b3b034367f7d80e1d9e37719ced33c18c8228e0dd8637', 'Existing Privacy Policy copy changed'
    terms = pages[ROOT / 'terms.html']
    assert 2000 <= len(terms.term_words) <= 2400, f'Terms length: {len(terms.term_words)}'
    print(f'PASS: {len(pages)} pages, {links} links/assets, {len(source)} strings in all {len(catalogs)} languages; Privacy Policy preserved; terms {len(terms.term_words)} words.')

if __name__ == '__main__':
    main()
