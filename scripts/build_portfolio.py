"""Build the public portfolio from shared, reviewable content. No JS framework required."""
from __future__ import annotations

import argparse
import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILE = json.loads((ROOT / 'data/profile.json').read_text())
PROJECTS = json.loads((ROOT / 'data/projects.json').read_text())
BY_ID = {p['id']: p for p in PROJECTS}
HIGHLIGHTS = json.loads((ROOT/'data/project-highlights.json').read_text())


def e(value):
    return escape(str(value), quote=True)


def icon(name='arrow', cls=''):
    return f'<svg class="icon {cls}" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-{name}"></use></svg>'


ICONS = '''<svg class="icon-library" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14"/></symbol>
<symbol id="i-right" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></symbol>
<symbol id="i-down" viewBox="0 0 24 24"><path d="M12 4v16m-6-6 6 6 6-6"/></symbol>
<symbol id="i-code" viewBox="0 0 24 24"><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
<symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></symbol>
<symbol id="i-github" viewBox="0 0 24 24"><path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .2-2-1-3 4 0 6-2 6-5 0-1-.3-2-1-3 .3-1 .2-2-.1-3-1 0-2 .5-3 1-2-.5-5-.5-7 0-1-.5-2-1-3-1-.3 1-.4 2-.1 3-.7 1-1 2-1 3 0 3 2 5 6 5-1 1-1 2-1 3v4"/></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h8"/></symbol>
<symbol id="i-location" viewBox="0 0 24 24"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></symbol>
</defs></svg>'''


def head(title, description, prefix='./', route='', base_url=None, cinematic=False):
    origin = (base_url or PROFILE['site_url']).rstrip('/')
    url = f'{origin}/{route}'
    schema = {'@context': 'https://schema.org', '@type': 'Person', 'name': PROFILE['name'],
              'jobTitle': PROFILE['role'], 'url': origin + '/', 'sameAs': [PROFILE['github']],
              'description': 'Java backend candidate focused on business workflows, PostgreSQL and transaction correctness.'}
    presentation = f'''<link rel="stylesheet" href="{prefix}cinematic.css?v=8">
<script type="module" src="{prefix}cinematic.js?v=8"></script>''' if cinematic else f'''<link rel="stylesheet" href="{prefix}styles.css?v=9"><script src="{prefix}theme.js?v=5"></script>'''+f'<script defer src="{prefix}app.js?v=9"></script>'
    return f'''<!doctype html><html lang="en" data-theme="dark"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(description)}">
<meta name="theme-color" content="#060a10"><meta name="color-scheme" content="dark">
<link rel="canonical" href="{e(url)}"><meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}">
<meta property="og:url" content="{e(url)}"><meta property="og:image" content="{origin}/assets/og-preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="author" content="Pham Ngoc Gia Bao">
<link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="{prefix}assets/apple-touch-icon.png">
<link rel="manifest" href="{prefix}site.webmanifest"><link rel="stylesheet" href="{prefix}assets/fonts/fonts.css">
{presentation}
<link rel="stylesheet" href="{prefix}site-ui.css?v=8">
<script type="application/ld+json">{json.dumps(schema)}</script>
</head>'''


def header(prefix='./', home=False):
    home_url = prefix + 'index.html'
    anchor = '' if home else home_url
    tools = '<button id="pause-motion" hidden type="button" aria-pressed="false"><span class="pause-symbol">Ⅱ</span><span class="pause-text">Pause motion</span></button>' if home else f'<button type="button" class="search-trigger">Search projects {icon("search")}</button>'
    return f'''<a class="site-skip" href="#main">Skip to content</a><header class="site-nav" data-site-header><a class="site-brand" href="{home_url}" aria-label="Gia Bao home">GIA BAO<span class="brand-dot">.</span><small>JAVA BACKEND</small></a><nav class="site-links" aria-label="Primary navigation"><a href="{anchor}#work" data-section-link="work">Work</a><a href="{prefix}assets/Pham_Ngoc_Gia_Bao_Java_Backend.pdf" download>CV <span aria-hidden="true">↓</span><span class="sr-only"> — Download PDF</span></a><a href="{anchor}#contact" data-section-link="contact">Contact</a></nav><details class="site-menu"><summary aria-label="More navigation">More <span aria-hidden="true">+</span></summary><nav class="site-menu-panel" aria-label="More navigation"><a href="{anchor}#approach" data-section-link="approach">Approach</a><a href="{anchor}#playground" data-section-link="playground">Engineering playground</a><a href="{anchor}#about" data-section-link="about">About me</a><a href="{prefix}assets/Resume.html">Read résumé</a><a href="{PROFILE['github']}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>{tools}<a data-view-link href="{home_url}?view=static#top">Static view</a></nav></details></header>'''


def copy_feedback():
    return f'''<div class="copy-feedback" role="status" aria-live="polite" id="copy-feedback"></div><div class="copy-fallback" hidden><label for="email-to-copy">Select and copy my email</label><input id="email-to-copy" readonly value="{e(PROFILE['email'])}" spellcheck="false"><button type="button" data-close-copy>Done</button></div>'''


def highlight_list(pid):
    p = HIGHLIGHTS[pid]
    return '<dl class="project-highlights">' + ''.join(f'<div><dt>{label}</dt><dd>{e(p[key])}</dd></div>' for label,key in [('My role','ownership'),('Delivered','delivered'),('Key decision','decision')]) + '</dl>'


def case_overview(pid):
    p = HIGHLIGHTS[pid]
    return '<section class="case-quick wrap" aria-labelledby="quick-title"><h2 id="quick-title">At a glance</h2><dl>' + ''.join(f'<div><dt>{label}</dt><dd>{e(p[key])}</dd></div>' for label,key in [('Problem','problem'),('My role','ownership'),('Delivered','delivered'),('Key decision','decision')]) + '</dl></section>'


def overlays(prefix='./'):
    index = [{'title': p['shortName'], 'description': p['summary'], 'keywords': ' '.join(p['stack'] + p['focus'] + p['tags']), 'href': f"{prefix}cases/{p['id']}/index.html", 'category': 'PROJECT'} for p in sorted(PROJECTS, key=lambda p: ['sstc', 'unihub', 'lunfa', 'coffee', 'auction', 'homestay', 'petcare', 'melodix'].index(p['id']))]
    index += [{'title': 'Backend résumé', 'description': 'Experience, education and core skills', 'href': prefix + 'assets/Resume.html', 'category': 'RÉSUMÉ'},
              {'title': 'Download CV', 'description': 'A4 PDF with selectable text', 'href': prefix + 'assets/Pham_Ngoc_Gia_Bao_Java_Backend.pdf', 'category': 'PDF'},
              {'title': 'Contact Gia Bao', 'description': PROFILE['email'], 'href': 'mailto:' + PROFILE['email'], 'category': 'CONTACT'}]
    return f'''<dialog id="search-dialog" class="search-dialog" aria-labelledby="search-title"><div class="search-heading"><h2 id="search-title" class="sr-only">Search projects and actions</h2>{icon('search')}<label class="sr-only" for="search-input">Search projects, résumé or contact</label><input id="search-input" type="search" placeholder="A project, a skill, a question…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="search-results" aria-expanded="true"><button class="escape-button" data-close-dialog aria-label="Close search">Esc</button></div><div id="search-results" role="listbox" aria-label="Search results"></div><div class="search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span class="mono">BUILT TO BE EXPLORED</span></div></dialog>
<script id="search-data" type="application/json">{json.dumps(index, ensure_ascii=False).replace('<', chr(92)+'u003c')}</script>
<dialog id="lightbox" class="lightbox" aria-label="Project image preview"><button class="icon-button" data-close-dialog aria-label="Close image">{icon('close')}</button><figure><img alt=""><figcaption></figcaption></figure></dialog><div class="toast" id="toast" role="status" aria-live="polite"></div>'''


def footer(prefix='./', compact=False):
    return f'''<footer class="site-footer wrap"><a class="footer-brand" href="{prefix}index.html">GIA BAO<span>.</span></a><p>Thoughtful systems. Human outcomes.</p><div><a href="{PROFILE['github']}" target="_blank" rel="noopener noreferrer">GitHub {icon()}</a><span class="mono">© {__import__('datetime').date.today().year} GIA BAO</span></div></footer>{overlays(prefix)}'''


def picture(name, prefix='./', cls='', alt='', lazy=True, dimensions=None, sizes='(max-width: 700px) 100vw, 55vw'):
    ratio = dimensions or ((3248, 1944) if name.startswith('lunfa') else (1440, 900))
    source_width = ratio[0] if dimensions else 1600
    variants = f'{prefix}assets/optimized/{name}-800.webp {min(800, source_width)}w'
    if source_width > 800:
        variants += f', {prefix}assets/optimized/{name}-1600.webp {min(1600, source_width)}w'
    return f'<img class="{cls}" src="{prefix}assets/optimized/{name}-800.webp" srcset="{variants}" sizes="{e(sizes)}" width="{ratio[0]}" height="{ratio[1]}" alt="{e(alt)}" {"loading=lazy" if lazy else "fetchpriority=high"} decoding="async">'


def case_media(m, prefix):
    name = Path(m['src']).stem
    layout = m.get('layout', '')
    cls = 'case-shot' + (f' case-shot-{layout}' if layout in ('wide', 'portrait', 'phone') else '')
    dimensions = (m['width'], m['height']) if 'width' in m and 'height' in m else None
    sizes = '90vw' if layout == 'wide' else '280px' if layout in ('portrait', 'phone') else '(max-width: 700px) 100vw, 55vw'
    title = f'<strong>{e(m["title"])}</strong> ' if m.get('title') else ''
    return f'<figure class="{cls}"><a href="{prefix}assets/optimized/{name}.webp" data-lightbox aria-label="{e("Enlarge image: "+m["alt"])}">{picture(name,prefix,alt=m["alt"],dimensions=dimensions,sizes=sizes)}</a><figcaption>{title}{e(m["caption"])}</figcaption></figure>'


def unihub_art():
    return '''<div class="unihub-art" aria-label="Illustrative workshop ticket and check-in interface"><div class="ticket-grid"></div><div class="event-ticket"><div class="ticket-brand">UniHub<span>WORKSHOP PASS</span></div><span class="ticket-eyebrow mono">DESIGNED FOR THE WHOLE JOURNEY</span><strong>A seat.<br>A scan.<br>You’re in.</strong><div class="ticket-bottom"><span class="ticket-qr" aria-hidden="true"></span><span class="mono">REGISTER → ATTEND<br><b>OFFLINE READY</b></span></div></div><div class="checkin-pill"><span>✓</span><div><b>Offline check-in</b><small>Scan now. Sync on reconnect.</small></div></div><span class="art-label mono">PRODUCT FLOW / ILLUSTRATION</span></div>'''


def home(base_url=None):
    archive_order = ['coffee', 'auction', 'homestay', 'petcare', 'melodix']
    archive_rows = ''.join(f'<a class="archive-row" href="./cases/{pid}/index.html"><span class="mono">{i+4:02}</span><h3>{e(BY_ID[pid]["shortName"])}</h3><p>{e(" / ".join(BY_ID[pid]["focus"][:2]))}</p><span aria-hidden="true">↗</span></a>' for i, pid in enumerate(archive_order))
    archive = f'<details class="work-archive" id="more-work"><summary><span>There’s more behind the work.</span><span class="mono">5 MORE PROJECTS <b>+</b></span></summary><div>{archive_rows}</div></details>'
    rows = ''.join(f'<div class="request-row" data-worker="{i}"><span class="worker-id mono">0{i+1}</span><span class="worker-name">Request {i+1}</span><span class="worker-bar"><i></i></span><span class="worker-status mono">READY</span></div>' for i in range(5))
    playground = (ROOT/'templates/playground.html').read_text().replace('{rows}', rows).replace('{icon()}', icon()).replace("{icon('right')}", icon('right'))
    tokens = {'ARCHIVE': archive, 'PLAYGROUND': playground, 'HEADER': header(home=True), 'COPY_FEEDBACK': copy_feedback(), 'EMAIL': e(PROFILE['email']),
              'GITHUB': e(PROFILE['github']), 'NAME_UPPER': e(PROFILE['name'].upper()),
              'ROLE_UPPER': e(PROFILE['role'].upper()), 'YEAR': str(__import__('datetime').date.today().year)}
    tokens.update({'HIGHLIGHTS_' + pid.upper(): highlight_list(pid) for pid in ['sstc', 'unihub', 'lunfa']})
    tokens.update({'INTRO_' + pid.upper(): e(HIGHLIGHTS[pid]['problem']) for pid in ['sstc', 'unihub', 'lunfa']})
    body = (ROOT/'templates/cinematic-home.html').read_text()
    for key, value in tokens.items():
        body = body.replace('{{' + key + '}}', value)
    return head('Gia Bao — Behind the Interface', 'Java backend developer building the logic, data and safeguards behind dependable software. Explore eight engineering case studies and my experience.', base_url=base_url, cinematic=True) + body.replace('<body>', '<body data-page="home">' + ICONS)


def case_page(p, next_p, base_url=None):
    prefix = '../../'
    tags = ''.join(f'<span>{e(s)}</span>' for s in p['stack'])
    decisions = [n for n in p['flow'] if n.get('challenge')]
    decision_html = ''.join(f'''<details class="decision"{' open' if i == 0 else ''}><summary><span class="mono">{i+1:02d}</span><h3>{e(n['challenge'])}</h3><span class="decision-plus">+</span></summary><div class="decision-body"><span class="eyebrow">THE DECISION</span><p>{e(n['fix'])}</p></div></details>''' for i,n in enumerate(decisions))
    flow = ''.join(f'<li><span class="mono">{i+1:02d}</span><div><h3>{e(n["label"].title())}</h3><p>{e(n["desc"])}</p></div></li>' for i,n in enumerate(p['flow']))
    media = ''.join(case_media(m, prefix) for m in p.get('media',[]))
    gallery_class = ' case-gallery-phones' if p.get('media') and all(m.get('layout') == 'phone' for m in p['media']) else ''
    if p.get('mediaIntro'):
        media = f'<p class="case-gallery-note">{e(p["mediaIntro"])}</p>' + media
    if p['id']=='unihub' and not media:media=f'<div class="case-illustration">{unihub_art()}</div>'
    if not media:media=f'<div class="case-concept"><span class="mono">ENGINEERING FOCUS / ILLUSTRATION</span><div>{"".join(f"<span>{e(f)}</span>" for f in p["focus"])}</div>{icon("code")}</div>'
    links = ''.join(f'<a class="button button-outline" href="{e(l["href"])}" target="_blank" rel="noopener noreferrer">{e(l["label"].replace(" →", ""))} {icon()}</a>' for l in p['links'] if not l.get('isAction'))
    if p['id']=='sstc':links='<p class="private-note">Company project. The source repository is private; company data is excluded.</p>'
    evidence_detail = ''
    if p['id']=='sstc':
        evidence_detail='''<div class="handover-metrics"><div><strong>29</strong><span>Workflow states</span></div><div><strong>57</strong><span>Versioned migrations</span></div><div><strong>800+</strong><span>Test methods implemented</span></div><div><strong>805</strong><span>Tests in last documented full run</span></div></div><p class="evidence-note">Implementation and execution are different measures. The 805-test result refers to the last documented complete Maven verification, rather than a current CI indicator.</p>'''
    if p['id']=='unihub':evidence_detail=f'<a class="button button-accent" href="{prefix}index.html#playground">Explore the concurrency model {icon("right")}</a>'
    lessons=''.join(f'<li>{e(x)}</li>' for x in p['lessons'])
    limitations=''.join(f'<li>{e(x)}</li>' for x in p['limitations'])
    return head(f'{p["shortName"]} — A case study by Gia Bao',p['summary'],prefix,f'cases/{p["id"]}/',base_url)+f'''<body data-page="case">{ICONS}{header(prefix)}<main id="main"><section class="case-hero wrap"><a class="back-link mono" href="{prefix}index.html#work">← ALL WORK</a><p class="eyebrow">{e(p['category'])}</p><h1><span class="case-project-label">{e(p["shortName"])}</span>{e(p["title"])}</h1><p class="case-subtitle serif">{e(p['subtitle'])}</p></section>{case_overview(p["id"])}<div class="case-meta wrap"><div><span class="eyebrow">WHEN</span><p>{e(p['date'])}</p></div><div><span class="eyebrow">BUILT WITH</span><div class="work-tags">{tags}</div></div></div><nav class="case-nav wrap" aria-label="Case study sections"><a href="#overview">Overview</a><a href="#workflow">Workflow</a><a href="#decisions">Engineering decisions</a><a href="#evidence">Evidence &amp; scope</a></nav><section class="case-overview wrap section-space" id="overview"><p class="eyebrow">THE CONTEXT</p><div><h2>{e(p['shortName'])}<span class="serif"> / the problem</span></h2><p class="case-lead">{e(p['context'])}</p><p>{e(p['summary'])}</p></div></section><div class="case-gallery wrap{gallery_class}">{media}</div><section class="case-content-grid wrap section-space" id="workflow"><div class="case-aside"><p class="eyebrow">THE WORKFLOW</p><h2>Follow the<br><span class="serif">business rule.</span></h2><p>A simplified path through the system. Each step has an explicit responsibility.</p></div><ol class="workflow-timeline">{flow}</ol></section><section class="case-decisions wrap section-space" id="decisions"><div class="section-heading"><div><p class="eyebrow">ENGINEERING DECISIONS</p><h2>The interesting<br><span class="serif">part of the work.</span></h2></div><p>The constraints, the trade-offs,<br>and how I approached them.</p></div><div class="decisions-list">{decision_html}</div></section><section class="case-evidence wrap section-space" id="evidence"><p class="eyebrow">EVIDENCE &amp; SCOPE</p><h2>What was delivered.<br><span class="serif">What it means.</span></h2><p class="case-lead">{e(p['evidence'])}</p>{evidence_detail}<div class="evidence-links">{links}</div><div class="scope-grid"><div><h3>What I take from this project</h3><ul>{lessons}</ul></div><div><h3>Scope &amp; limitations</h3><ul>{limitations}</ul></div></div></section><a class="next-project wrap" href="../{next_p['id']}/index.html"><span class="eyebrow">NEXT CASE STUDY</span><div><h2>{e(next_p['shortName'])}<span class="serif"> / keep exploring</span></h2>{icon()}</div></a><div class="case-contact wrap"><p>Interested in working together?</p><a class="text-link" href="mailto:{PROFILE['email']}">Let’s talk {icon()}</a><button type="button" class="copy-email" data-copy-email="{PROFILE['email']}"><span data-copy-label>Copy email</span></button><a class="text-link" href="{prefix}assets/Pham_Ngoc_Gia_Bao_Java_Backend.pdf" download>Download CV ↓</a></div>{copy_feedback()}</main>{footer(prefix)}</body></html>'''


def resume_page():
    p = PROFILE
    skills = ', '.join(p['skills'])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{p['name']} — Java Backend Résumé</title><meta name="description" content="Java Backend Intern / Fresher résumé for Pham Ngoc Gia Bao"><link rel="icon" href="./favicon.svg"><link rel="stylesheet" href="./resume.css"></head><body><nav class="resume-toolbar" aria-label="Résumé actions"><a href="../index.html">← Portfolio</a><a href="./Pham_Ngoc_Gia_Bao_Java_Backend.pdf" download>Download PDF ↗</a><button type="button" id="print-resume">Print</button></nav><main class="resume-paper"><header><p class="resume-label">JAVA BACKEND INTERN / FRESHER</p><h1>{p['name'].upper()}</h1><p class="resume-contact">Ho Chi Minh City · <a href="mailto:{p['email']}">{p['email']}</a> · {p['phone']}</p><p class="resume-contact"><a href="{p['github']}">github.com/giabaocode</a> · <a href="{p['site_url']}/">Portfolio &amp; case studies</a></p></header><section><h2>Profile</h2><p>Information Technology undergraduate at HCMUS with backend internship experience and a delivered freelance AI application. Focused on Spring Boot, PostgreSQL, explicit workflows, transaction correctness and failure recovery.</p></section><section><h2>Technical skills</h2><p><strong>Core:</strong> {skills}.</p><p><strong>Supporting:</strong> REST APIs, JPA, SQL, idempotency, optimistic and row-level locking, JUnit, Node.js/Express, TypeScript, React, MongoDB, Git.</p></section><section><h2>Experience</h2><article><div class="resume-row"><h3>Backend Developer Intern · SSTC Technology JSC</h3><span>Jun – Aug 2026</span></div><p class="resume-sub">R&amp;D and Service Center · Sole developer · Java 21, Spring Boot, PostgreSQL</p><ul><li>Worked directly with the company director to clarify requirements; owned data design, implementation, testing and complete source handover.</li><li>Built a backend-owned warranty workflow spanning intake, shipping, warehouse reconciliation, inspection, consent and returns; confined Claude API to language extraction with deterministic fallback.</li><li>Applied message idempotency, optimistic locking, atomic ticket codes and short transactions with external calls outside database locks.</li><li>Final handover records: 29 workflow states, 57 migrations and 800+ test methods. Latest documented complete Maven verification: 805 tests passed.</li></ul></article><article><div class="resume-row"><h3>Full-Stack Developer · Lunfa (Freelance)</h3><span>Mar – Apr 2026</span></div><p class="resume-sub">University research group · Team of 2 · React, Express, Gemini/Vertex AI, MongoDB</p><ul><li>Delivered a Chinese-writing tutor that highlights errors and guides learner self-correction; participated from requirements through deployment.</li><li>Implemented structured AI responses, layered malformed-output recovery, authentication and conversation persistence.</li></ul></article></section><section><h2>Selected projects</h2><article><div class="resume-row"><h3>UniHub · Workshop lifecycle platform</h3><span>Apr – May 2026</span></div><p>Team of 2. Owned admin panel, offline QR check-in, Redis rate limiting, UI/UX and database design. Authored a K6 spike scenario targeting up to 12,000 virtual users; no measured benchmark result is claimed.</p></article><article><div class="resume-row"><h3>Online Auction · Transaction integrity</h3><span>Nov 2025 – Jan 2026</span></div><p>Team of 2. Database and bidder/seller workflows; PostgreSQL row-level locking, auto-bid logic, anti-sniping and post-auction settlement.</p></article></section><section><h2>Education</h2><div class="resume-row"><h3>University of Science — VNU HCMC</h3><span>Expected Oct 2027</span></div><p>B.Sc. Information Technology · GPA 3.46 / 4.0</p></section><p class="resume-foot">Company source and production data excluded. Test figures describe historical handover evidence.</p></main><script src="./resume.js"></script></body></html>'''


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url')
    args=parser.parse_args()
    (ROOT/'index.html').write_text(home(args.base_url))
    order=['sstc','unihub','lunfa','coffee','auction','homestay','petcare','melodix']
    for i,pid in enumerate(order):
        target=ROOT/'cases'/pid
        target.mkdir(parents=True,exist_ok=True)
        (target/'index.html').write_text(case_page(BY_ID[pid],BY_ID[order[(i+1)%len(order)]],args.base_url))
    (ROOT/'assets/Resume.html').write_text(resume_page())
    index=[{'id':p['id'],'name':p['shortName']} for p in PROJECTS]
    (ROOT/'data/project-index.json').write_text(json.dumps(index,indent=2)+'\n')
    origin=(args.base_url or PROFILE['site_url']).rstrip('/')
    urls=[origin+'/']+[f'{origin}/cases/{pid}/' for pid in order]
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{e(u)}</loc></url>' for u in urls)+'</urlset>\n')
    print(f'Built homepage, {len(order)} case studies, résumé and sitemap.')


if __name__=='__main__':main()
