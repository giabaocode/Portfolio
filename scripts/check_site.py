"""Check the actual public artifact: local links, fragments, images and privacy boundaries."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
import json

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT/'dist'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.refs, self.ids = path, [], []
        self.h1 = 0
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'h1': self.h1 += 1
        for name in ('href','src'):
            if attrs.get(name): self.refs.append(attrs[name])
        if attrs.get('srcset'):
            self.refs.extend(part.strip().split()[0] for part in attrs['srcset'].split(','))
        if tag == 'img':
            assert 'alt' in attrs, f'Image without alt: {self.path}'


def main():
    pages={path.resolve():Page(path) for path in DIST.rglob('*.html')}
    errors=[]
    for path,page in pages.items():
        if len(page.ids)!=len(set(page.ids)): errors.append(f'Duplicate ID: {path}')
        if page.h1 != 1: errors.append(f'Expected one h1: {path}')
        for ref in page.refs:
            url=urlsplit(ref)
            if url.scheme or url.netloc: continue
            target=(DIST/unquote(url.path).lstrip('/')) if url.path.startswith('/') else path.parent/unquote(url.path)
            if not url.path: target=path
            if target.is_dir(): target=target/'index.html'
            target=target.resolve()
            if not target.is_relative_to(DIST.resolve()):
                errors.append(f'Outside public artifact: {path.name}: {ref}');continue
            if not target.is_file(): errors.append(f'Missing: {path.relative_to(DIST)} → {ref}')
            if url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f'Missing fragment: {path.relative_to(DIST)} → {ref}')
    for path in DIST.rglob('*.css'):
        for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)',path.read_text()):
            if ref.startswith(('data:','http:','https:','#')): continue
            if not (path.parent/ref).is_file(): errors.append(f'Missing CSS asset: {ref}')
    for path in DIST.rglob('*.js'):
        for ref in re.findall(r'from\s+[\'"]([^\'"]+)[\'"]',path.read_text()):
            if ref.startswith('.') and not (path.parent/ref).is_file(): errors.append(f'Missing JS module: {ref}')
    manifest=json.loads((DIST/'site.webmanifest').read_text())
    for item in manifest.get('icons',[]):
        if not (DIST/item['src']).is_file(): errors.append(f'Missing manifest icon: {item["src"]}')
    forbidden={'SSTC','.git','.sites','output','tmp','review','node_modules'}
    for file in DIST.rglob('*'):
        if set(file.relative_to(DIST).parts)&forbidden or file.suffix in {'.eml','.xlsx','.env'}:
            errors.append(f'Private or development file in artifact: {file}')
    from pypdf import PdfReader
    pdf=PdfReader(DIST/'assets/Pham_Ngoc_Gia_Bao_Java_Backend.pdf')
    if len(pdf.pages)!=1: errors.append('Backend CV is not one A4 page')
    if 'Backend Developer Intern' not in pdf.pages[0].extract_text(): errors.append('CV selectable text missing')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} HTML pages, local links/fragments, image/JS/CSS assets, one-page PDF and public-artifact boundaries.')


if __name__=='__main__':main()
