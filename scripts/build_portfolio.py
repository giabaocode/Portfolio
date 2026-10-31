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


def head(title, description, prefix='./', route='', base_url=None):
    origin = (base_url or PROFILE['site_url']).rstrip('/')
    url = f'{origin}/{route}'
    schema = {'@context': 'https://schema.org', '@type': 'Person', 'name': PROFILE['name'],
              'jobTitle': PROFILE['role'], 'url': origin + '/', 'sameAs': [PROFILE['github']],
              'description': 'Java backend candidate focused on business workflows, PostgreSQL and transaction correctness.'}
    return f'''<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(description)}">
<meta name="theme-color" content="#101211"><meta name="color-scheme" content="dark light">
<link rel="canonical" href="{e(url)}"><meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}">
<meta property="og:url" content="{e(url)}"><meta property="og:image" content="{origin}/assets/og-preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="author" content="Pham Ngoc Gia Bao">
<link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="{prefix}assets/apple-touch-icon.png">
<link rel="manifest" href="{prefix}site.webmanifest"><link rel="stylesheet" href="{prefix}assets/fonts/fonts.css">
<link rel="stylesheet" href="{prefix}styles.css?v=4"><script src="{prefix}theme.js?v=4"></script>
<script type="application/ld+json">{json.dumps(schema)}</script>
<script defer src="{prefix}app.js?v=4"></script></head>'''


def header(prefix='./', home=False):
    home_url = prefix + 'index.html'
    anchor = '' if home else home_url
    return f'''<a class="skip-link" href="#main">Skip to content</a>{ICONS}
<header class="site-header"><div class="nav-shell wrap">
<a class="brand" href="{home_url}" aria-label="Gia Bao home"><span class="brand-mark">g<span>b</span><i>.</i></span><span class="brand-caption">GIA BAO<br><small>BACKEND DEVELOPER</small></span></a>
<nav class="desktop-nav" aria-label="Primary navigation"><a href="{anchor}#work">Selected work</a><a href="{anchor}#approach">Approach</a><a href="{anchor}#about">About</a></nav>
<div class="nav-actions"><button class="icon-button search-trigger" aria-label="Search projects and actions">{icon('search')}<kbd>⌘ K</kbd></button><button class="icon-button theme-toggle" aria-label="Switch to light theme">{icon('sun')}</button><a class="nav-resume" href="{prefix}assets/Resume.html">Résumé {icon()}</a><button class="icon-button menu-toggle" aria-label="Open navigation" aria-controls="mobile-menu" aria-expanded="false">{icon('menu')}</button></div>
</div></header>
<dialog class="mobile-menu" id="mobile-menu" aria-label="Navigation"><div class="menu-top"><span class="eyebrow">EXPLORE</span><button class="icon-button" data-close-dialog aria-label="Close navigation">{icon('close')}</button></div><nav><a href="{anchor}#work">Selected work <span>01</span></a><a href="{anchor}#approach">Approach <span>02</span></a><a href="{anchor}#about">About me <span>03</span></a><a href="{anchor}#contact">Let’s talk {icon()}</a><a class="menu-cv" href="{prefix}assets/Resume.html">View résumé {icon('file')}</a></nav><p class="mono">Ho Chi Minh City, Vietnam</p></dialog>'''


def overlays(prefix='./'):
    index = [{'title': p['shortName'], 'description': p['summary'], 'keywords': ' '.join(p['stack'] + p['focus'] + p['tags']), 'href': f"{prefix}cases/{p['id']}/index.html", 'category': 'PROJECT'} for p in sorted(PROJECTS, key=lambda p: ['sstc', 'unihub', 'lunfa', 'coffee', 'auction', 'homestay', 'petcare', 'melodix'].index(p['id']))]
    index += [{'title': 'Backend résumé', 'description': 'Experience, education and core skills', 'href': prefix + 'assets/Resume.html', 'category': 'RÉSUMÉ'},
              {'title': 'Download CV', 'description': 'A4 PDF with selectable text', 'href': prefix + 'assets/Pham_Ngoc_Gia_Bao_Java_Backend.pdf', 'category': 'PDF'},
              {'title': 'Contact Gia Bao', 'description': PROFILE['email'], 'href': 'mailto:' + PROFILE['email'], 'category': 'CONTACT'}]
    return f'''<dialog id="search-dialog" class="search-dialog" aria-labelledby="search-title"><div class="search-heading"><h2 id="search-title" class="sr-only">Search projects and actions</h2>{icon('search')}<label class="sr-only" for="search-input">Search projects, résumé or contact</label><input id="search-input" type="search" placeholder="A project, a skill, a question…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="search-results" aria-expanded="true"><button class="escape-button" data-close-dialog aria-label="Close search">Esc</button></div><div id="search-results" role="listbox" aria-label="Search results"></div><div class="search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span class="mono">BUILT TO BE EXPLORED</span></div></dialog>
<script id="search-data" type="application/json">{json.dumps(index, ensure_ascii=False).replace('<', chr(92)+'u003c')}</script>
<dialog id="lightbox" class="lightbox" aria-label="Project image preview"><button class="icon-button" data-close-dialog aria-label="Close image">{icon('close')}</button><figure><img alt=""><figcaption></figcaption></figure></dialog><div class="toast" id="toast" role="status" aria-live="polite"></div>'''


def footer(prefix='./', compact=False):
    return f'''<footer class="site-footer wrap"><a class="footer-brand" href="{prefix}index.html">gia bao<span>®</span></a><p>Thoughtful systems. Human outcomes.</p><div><a href="{PROFILE['github']}" target="_blank" rel="noopener noreferrer">GitHub {icon()}</a><span class="mono">© {__import__('datetime').date.today().year} GIA BAO</span></div></footer>{overlays(prefix)}'''


def picture(name, prefix='./', cls='', alt='', lazy=True):
    ratio = (3248, 1944) if name.startswith('lunfa') else (1440, 900)
    return f'<img class="{cls}" src="{prefix}assets/optimized/{name}-800.webp" srcset="{prefix}assets/optimized/{name}-800.webp 800w, {prefix}assets/optimized/{name}-1600.webp 1600w" sizes="(max-width: 700px) 100vw, 55vw" width="{ratio[0]}" height="{ratio[1]}" alt="{e(alt)}" {"loading=lazy" if lazy else "fetchpriority=high"} decoding="async">'


def system_model():
    return '''<div class="hero-visual reveal" aria-label="Interactive backend architecture illustration">
<div class="visual-top"><span class="mono"><i class="status-dot"></i> SYSTEM THINKING</span><span class="mono faded">MODEL / 001</span></div>
<div class="system-model" data-scenario="request"><svg class="system-drawing" viewBox="0 0 560 410" aria-hidden="true">
<defs><pattern id="dot-grid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".19"/></pattern><linearGradient id="node-fill" x2="0" y2="1"><stop stop-color="var(--model-top)"/><stop offset="1" stop-color="var(--model-bottom)"/></linearGradient><filter id="node-shadow" x="-30%" y="-30%" width="160%" height="190%"><feDropShadow dx="0" dy="16" stdDeviation="12" flood-opacity=".2"/></filter></defs>
<rect width="560" height="410" fill="url(#dot-grid)"/>
<g class="system-wires" fill="none" stroke="currentColor"><path d="M124 202H213"/><path d="M350 202h85"/><path class="ai-wire" d="M281 116v45"/><path d="M281 247v49"/><path d="M123 202v120h94" opacity=".3"/></g>
<g class="signal-path" fill="none"><path d="M124 202H213M350 202h85"/><path class="ai-wire" d="M281 116v45"/></g>
<g class="diagram-node client-node" filter="url(#node-shadow)"><rect x="20" y="157" width="111" height="89" rx="13"/><path class="node-icon" d="M60 175h31v23H60zm0 6h31"/><text x="76" y="220" text-anchor="middle">Web request</text><text class="tiny" x="76" y="234" text-anchor="middle">INPUT / VALIDATE</text></g>
<g class="diagram-node ai-node" filter="url(#node-shadow)"><rect x="217" y="28" width="128" height="88" rx="13"/><path class="node-icon" d="m281 42 3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/><text x="281" y="87" text-anchor="middle">AI extraction</text><text class="tiny" x="281" y="102" text-anchor="middle">LANGUAGE ONLY</text></g>
<g class="diagram-node core-node" filter="url(#node-shadow)"><rect x="207" y="154" width="148" height="96" rx="15"/><path class="node-icon" d="m266 173-7 7 7 7m30-14 7 7-7 7m-12-17-5 20"/><text x="281" y="212" text-anchor="middle">Workflow engine</text><text class="tiny" x="281" y="230" text-anchor="middle">THE BUSINESS RULES</text></g>
<g class="diagram-node database-node" filter="url(#node-shadow)"><rect x="431" y="157" width="111" height="89" rx="13"/><path class="node-icon" d="M473 179v17c0 7 27 7 27 0v-17m-27 8c0 7 27 7 27 0"/><ellipse class="node-icon" cx="486.5" cy="179" rx="13.5" ry="5"/><text x="487" y="220" text-anchor="middle">PostgreSQL</text><text class="tiny" x="487" y="234" text-anchor="middle">SOURCE OF TRUTH</text></g>
<g class="diagram-node audit-node" filter="url(#node-shadow)"><rect x="217" y="294" width="128" height="80" rx="13"/><path class="node-icon" d="m268 317 7 7 16-16"/><text x="281" y="345" text-anchor="middle">Auditable result</text><text class="tiny" x="281" y="360" text-anchor="middle">COMMIT / TRACE</text></g>
<g class="wire-caption"><text x="155" y="189">01</text><text x="386" y="189">02</text><text x="291" y="142">EXTRACT</text><text x="291" y="278">COMMIT</text></g>
</svg><div class="mobile-system" aria-hidden="true"><div><span class="mono">01</span><strong>Understand the request</strong><small>AI extraction / local fallback</small></div><div class="mobile-core"><span class="mono">02</span><strong>Apply the business rules</strong><small>Backend-owned decisions</small></div><div><span class="mono">03</span><strong>Commit a traceable result</strong><small>PostgreSQL / audit trail</small></div></div><div class="model-note"><span class="mono">THE PRINCIPLE</span><p>AI understands.<br><strong>The backend decides.</strong></p></div></div>
<div class="scenario-controls" role="group" aria-label="Explore a request scenario"><button type="button" data-scenario="request" aria-pressed="true">Happy path</button><button type="button" data-scenario="duplicate" aria-pressed="false">Duplicate request</button><button type="button" data-scenario="fallback" aria-pressed="false">AI timeout</button></div><p class="scenario-description" id="scenario-description" role="status">Validate the request. Apply the rules. Commit a traceable result.</p><span class="model-disclaimer mono">INTERACTIVE ARCHITECTURE ILLUSTRATION</span></div>'''


def unihub_art():
    return '''<div class="unihub-art" aria-label="Illustrative workshop ticket and check-in interface"><div class="ticket-grid"></div><div class="event-ticket"><div class="ticket-brand">UniHub<span>WORKSHOP PASS</span></div><span class="ticket-eyebrow mono">DESIGNED FOR THE WHOLE JOURNEY</span><strong>A seat.<br>A scan.<br>You’re in.</strong><div class="ticket-bottom"><span class="ticket-qr" aria-hidden="true"></span><span class="mono">REGISTER → ATTEND<br><b>OFFLINE READY</b></span></div></div><div class="checkin-pill"><span>✓</span><div><b>Offline check-in</b><small>Scan now. Sync on reconnect.</small></div></div><span class="art-label mono">PRODUCT FLOW / ILLUSTRATION</span></div>'''


def project_feature():
    p = BY_ID['sstc']
    return f'''<a class="work-card work-feature reveal" href="./cases/sstc/index.html"><div class="work-copy"><div class="work-meta mono"><span>01 / SSTC</span><span>BACKEND INTERNSHIP</span></div><h3>Complex operations.<br><span>One coherent system.</span></h3><p>{e(p['summary'])}</p><div class="work-tags"><span>Java / Spring Boot</span><span>PostgreSQL</span><span>Workflow design</span></div><span class="case-link">Inside the engineering {icon()}</span></div><div class="sstc-art"><span class="cover-label mono">WARRANTY OPERATIONS / SOURCE HANDOVER</span><div class="browser-shot"><div class="browser-chrome"><i></i><i></i><i></i><span>warehouse / receiving</span></div>{picture('sstc-intake',alt='SSTC warehouse receiving interface')}</div><div class="architecture-chip">{icon('code')}<span>Language interpreted.<br><b>Business rules enforced.</b></span></div><span class="cover-bottom mono">INTAKE → VERIFY → INSPECT → RETURN</span></div></a>'''


def home(base_url=None):
    archive_order = ['coffee', 'auction', 'homestay', 'petcare', 'melodix']
    archive = ''.join(f'<a class="archive-row" href="./cases/{pid}/index.html"><span class="mono">{str(i+4).zfill(2)}</span><h3>{e(BY_ID[pid]["shortName"])}</h3><p>{e(" / ".join(BY_ID[pid]["focus"][:2]))}</p>{icon()}</a>' for i,pid in enumerate(archive_order))
    skills = ''.join(f'<span>{e(s)}</span>' for s in PROFILE['skills'])
    rows = ''.join(f'<div class="request-row" data-worker="{i}"><span class="worker-id mono">0{i+1}</span><span class="worker-name">Request {i+1}</span><span class="worker-bar"><i></i></span><span class="worker-status mono">READY</span></div>' for i in range(5))
    return head('Gia Bao — Thoughtful Backend Engineering', 'Java backend developer turning complex business workflows into dependable software. Explore internship, Java systems and AI product case studies.',base_url=base_url) + f'''<body data-page="home">{header(home=True)}<main id="main">
<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-intro"><div class="availability"><span class="status-dot"></span>OPEN TO INTERN &amp; FRESHER ROLES</div><span class="hero-coordinate mono">HCMC, VIETNAM <span>10.8° N / 106.7° E</span></span></div><div class="hero-grid"><div class="hero-copy"><p class="eyebrow hero-eyebrow">PHAM NGOC GIA BAO / JAVA BACKEND DEVELOPER</p><h1 id="hero-title">Complex logic.<br><span class="serif">Clear outcomes.</span></h1><p class="hero-description">I turn complex business workflows into dependable software. Thoughtful APIs, deliberate data models, and failure paths considered from the start.</p><div class="hero-actions"><a class="button button-accent" href="#work">Explore my work {icon('down')}</a><a class="text-link" href="./assets/Pham_Ngoc_Gia_Bao_Java_Backend.pdf" download>Download CV {icon()}</a></div><div class="hero-personal"><span class="personal-mark">gb.</span><p>HCMUS undergraduate.<br><span>Backend intern. Product builder.</span></p></div></div>{system_model()}</div><div class="hero-foot mono"><span>BUILT AROUND THE RULES. DESIGNED FOR THE EXCEPTIONS.</span><a href="#work">SCROLL TO EXPLORE {icon('down')}</a></div></section>
<div class="stack-strip" aria-label="Core technologies"><div class="wrap"><span class="mono">MY CORE TOOLKIT</span><div>{skills}</div></div></div>
<section class="work-section section-space wrap" id="work" aria-labelledby="work-title"><div class="section-heading reveal"><div><p class="eyebrow">01 / SELECTED WORK</p><h2 id="work-title">Real problems.<br><span class="serif">Considered solutions.</span></h2></div><p>From a warranty operation to a classroom.<br>Three projects. Three different kinds of responsibility.</p></div>{project_feature()}<div class="work-pair"><a class="work-card reveal" href="./cases/unihub/index.html"><div class="work-art">{unihub_art()}</div><div class="pair-copy"><div class="work-meta mono"><span>02 / UNIHUB</span><span>JAVA SYSTEMS</span></div><h3>Built for the edge cases.</h3><p>Competing registrations, async payments and check-in when the Wi-Fi gives up.</p><div class="pair-foot"><span class="mono">SPRING BOOT · POSTGRESQL · REDIS</span><span class="round-arrow">{icon()}</span></div></div></a><a class="work-card reveal" href="./cases/lunfa/index.html"><div class="work-art lunfa-art"><span class="cover-label mono">LUNFA / AI-ASSISTED LEARNING</span><div class="lunfa-window">{picture('lunfa-chat',alt='Lunfa Chinese writing tutor showing guided corrections')}</div><span class="lunfa-sticker">A little guidance.<br><i>A lot of discovery.</i></span></div><div class="pair-copy"><div class="work-meta mono"><span>03 / LUNFA</span><span>FREELANCE DELIVERY</span></div><h3>AI that helps you think.</h3><p>A delivered writing tutor that guides learners to correct their own Chinese sentences.</p><div class="pair-foot"><span class="mono">REACT · EXPRESS · GEMINI · MONGODB</span><span class="round-arrow">{icon()}</span></div></div></a></div><details class="work-archive reveal"><summary><span>There’s more behind the work.</span><span class="mono">5 MORE PROJECTS <b>+</b></span></summary><div>{archive}</div></details></section>
<section class="approach-section section-space" id="approach" aria-labelledby="approach-title"><div class="wrap"><div class="section-heading reveal"><div><p class="eyebrow">02 / HOW I THINK</p><h2 id="approach-title">Reliable is a<br><span class="serif">design decision.</span></h2></div><p>The happy path is only the beginning.<br>I pay attention to what happens around it.</p></div><div class="principles"><article class="reveal"><span class="principle-num mono">01 / UNDERSTAND</span><h3>Start with the rules.</h3><p>Who decides? What can change? I clarify requirements and model the workflow before turning it into endpoints.</p><a href="./cases/sstc/index.html#decisions">See it in SSTC {icon('right')}</a></article><article class="reveal"><span class="principle-num mono">02 / DESIGN</span><h3>Consider the failure.</h3><p>A duplicate message. A late payment. A timeout. I design transaction boundaries and recovery paths around them.</p><a href="./cases/unihub/index.html#decisions">See it in UniHub {icon('right')}</a></article><article class="reveal"><span class="principle-num mono">03 / VERIFY</span><h3>Test the invariant.</h3><p>The rule should survive competing requests and partial failure. I use automated tests and database constraints to check it.</p><a href="./cases/sstc/index.html#evidence">Explore the evidence {icon('right')}</a></article></div></div></section>
<section class="playground-section section-space wrap" id="playground" aria-labelledby="playground-title"><div class="playground-copy reveal"><p class="eyebrow">A SMALL ENGINEERING PLAYGROUND</p><h2 id="playground-title">One seat.<br>Five requests.<br><span class="serif">What could go wrong?</span></h2><p>When every request reads the same remaining seat, a check alone is not enough. See how a version check changes the outcome.</p><div class="playground-legend"><span><i></i>Successful commit</span><span><i></i>Version conflict</span></div><a class="text-link" href="./cases/unihub/index.html#decisions">The design behind it {icon()}</a></div><div class="playground-panel reveal"><div class="playground-top"><span class="mono">RESERVATION MODEL</span><span class="model-tag mono">ILLUSTRATION</span></div><div class="mode-toggle" role="group" aria-label="Concurrency model"><button type="button" data-locking="true" aria-pressed="true">With version check</button><button type="button" data-locking="false" aria-pressed="false">Without coordination</button></div><div class="db-state"><span class="mono">WORKSHOP / 001</span><div><span>Seats remaining <b id="seat-count">1</b></span><span>Version <b id="version-count">1</b></span></div></div><div class="request-rows">{rows}</div><div class="playground-controls"><button class="button button-accent" id="run-simulation" type="button">Run 5 requests {icon('right')}</button><button class="reset-button" id="reset-simulation" type="button">Reset</button></div><p class="simulation-result" id="simulation-result" role="status">Ready. All five requests will read version 1.</p><p class="playground-disclaimer mono">BROWSER MODEL · NO BACKEND CALLS OR BENCHMARK RESULTS</p></div></section>
<section class="about-section section-space wrap" id="about" aria-labelledby="about-title"><div class="about-identity reveal"><p class="eyebrow">03 / THE PERSON BEHIND THE SYSTEMS</p><div class="identity-art" aria-hidden="true"><span>g</span><span>b<i>.</i></span><div class="identity-orbit"></div><small class="mono">CURIOUS BY DEFAULT.<br>DELIBERATE BY DESIGN.</small></div><p class="identity-caption mono">PHAM NGOC GIA BAO<br>HO CHI MINH CITY, VIETNAM</p></div><div class="about-content reveal"><h2 id="about-title">I like making<br> complex things<br><span class="serif">make sense.</span></h2><p class="about-lead">I’m Gia Bao, an Information Technology undergraduate at HCMUS, focused on Java backend engineering.</p><p>My work sits between understanding a business and building its software. At SSTC, I worked directly with the director to clarify requirements, then carried the warranty workflow through implementation, testing and source handover.</p><p>I’ve also delivered a freelance AI application with a research team. That experience keeps me interested in the people using a system, as much as the code behind it.</p><div class="education-note"><span class="mono">EDUCATION</span><strong>University of Science — VNU HCMC</strong><p>B.Sc. Information Technology · Expected Oct 2027<br>GPA 3.46 / 4.0</p></div><a class="text-link" href="./assets/Resume.html">The résumé version {icon()}</a></div></section>
<section class="experience-section wrap" aria-label="Professional experience"><div class="experience-row reveal"><span class="mono">JUN — AUG 2026</span><div><h3>Backend Developer Intern</h3><p>SSTC Technology JSC · R&amp;D and Service Center</p></div><a href="./cases/sstc/index.html" aria-label="Read SSTC internship case study">{icon()}</a></div><div class="experience-row reveal"><span class="mono">MAR — APR 2026</span><div><h3>Full-Stack Developer · Freelance</h3><p>Lunfa · University research group · Team of two</p></div><a href="./cases/lunfa/index.html" aria-label="Read Lunfa freelance case study">{icon()}</a></div></section>
<section class="contact-section section-space wrap" id="contact" aria-labelledby="contact-title"><div class="contact-heading reveal"><p class="eyebrow"><span class="status-dot"></span> OPEN TO THE NEXT CHALLENGE</p><h2 id="contact-title">Good systems start<br>with a <span class="serif">conversation.</span></h2><a class="contact-email" href="mailto:{PROFILE['email']}?subject=Java%20Backend%20opportunity">Let’s build something thoughtful. {icon()}</a></div><div class="contact-bottom"><p>Java Backend Intern / Fresher<br><span>Ho Chi Minh City · Open to discussing remote roles</span></p><div><button class="text-link" type="button" data-copy-email>Copy email {icon('copy')}</button><a class="text-link" href="{PROFILE['github']}" target="_blank" rel="noopener noreferrer">GitHub {icon()}</a></div></div></section>
</main>{footer()}<script id="profile-data" type="application/json">{json.dumps({'email':PROFILE['email']})}</script></body></html>'''


def case_page(p, next_p, base_url=None):
    prefix = '../../'
    tags = ''.join(f'<span>{e(s)}</span>' for s in p['stack'])
    decisions = [n for n in p['flow'] if n.get('challenge')]
    decision_html = ''.join(f'''<details class="decision"{' open' if i == 0 else ''}><summary><span class="mono">{i+1:02d}</span><h3>{e(n['challenge'])}</h3><span class="decision-plus">+</span></summary><div class="decision-body"><span class="eyebrow">THE DECISION</span><p>{e(n['fix'])}</p></div></details>''' for i,n in enumerate(decisions))
    flow = ''.join(f'<li><span class="mono">{i+1:02d}</span><div><h3>{e(n["label"].title())}</h3><p>{e(n["desc"])}</p></div></li>' for i,n in enumerate(p['flow']))
    media = ''.join(f'<figure class="case-shot"><a href="{prefix}assets/optimized/{Path(m["src"]).stem}.webp" data-lightbox aria-label="{e("Enlarge image: "+m["alt"])}">{picture(Path(m["src"]).stem,prefix,alt=m["alt"])}</a><figcaption>{e(m["caption"])}</figcaption></figure>' for m in p.get('media',[]))
    if p['id']=='unihub':media=f'<div class="case-illustration">{unihub_art()}</div>'
    if not media:media=f'<div class="case-concept"><span class="mono">ENGINEERING FOCUS / ILLUSTRATION</span><div>{"".join(f"<span>{e(f)}</span>" for f in p["focus"])}</div>{icon("code")}</div>'
    links = ''.join(f'<a class="button button-outline" href="{e(l["href"])}" target="_blank" rel="noopener noreferrer">{e(l["label"].replace(" →", ""))} {icon()}</a>' for l in p['links'] if not l.get('isAction'))
    if p['id']=='sstc':links='<p class="private-note">Company project. The source repository is private; company data is excluded.</p>'
    evidence_detail = ''
    if p['id']=='sstc':
        evidence_detail='''<div class="handover-metrics"><div><strong>29</strong><span>Workflow states</span></div><div><strong>57</strong><span>Versioned migrations</span></div><div><strong>800+</strong><span>Test methods implemented</span></div><div><strong>805</strong><span>Tests in last documented full run</span></div></div><p class="evidence-note">Implementation and execution are different measures. The 805-test result refers to the last documented complete Maven verification, rather than a current CI indicator.</p>'''
    if p['id']=='unihub':evidence_detail=f'<a class="button button-accent" href="{prefix}index.html#playground">Explore the concurrency model {icon("right")}</a>'
    lessons=''.join(f'<li>{e(x)}</li>' for x in p['lessons'])
    limitations=''.join(f'<li>{e(x)}</li>' for x in p['limitations'])
    return head(f'{p["shortName"]} — A case study by Gia Bao',p['summary'],prefix,f'cases/{p["id"]}/',base_url)+f'''<body data-page="case">{header(prefix)}<main id="main"><section class="case-hero wrap"><a class="back-link mono" href="{prefix}index.html#work">← ALL WORK</a><p class="eyebrow">{e(p['category'])}</p><h1>{e(p['title'])}</h1><p class="case-subtitle serif">{e(p['subtitle'])}</p><div class="case-meta"><div><span class="eyebrow">MY ROLE</span><p>{e(p['role'])}</p></div><div><span class="eyebrow">WHEN</span><p>{e(p['date'])}</p></div><div><span class="eyebrow">BUILT WITH</span><div class="work-tags">{tags}</div></div></div></section><nav class="case-nav wrap" aria-label="Case study sections"><a href="#overview">Overview</a><a href="#workflow">Workflow</a><a href="#decisions">Engineering decisions</a><a href="#evidence">Evidence &amp; scope</a></nav><section class="case-overview wrap section-space" id="overview"><p class="eyebrow">THE CONTEXT</p><div><h2>{e(p['shortName'])}<span class="serif"> / the problem</span></h2><p class="case-lead">{e(p['context'])}</p><p>{e(p['summary'])}</p></div></section><div class="case-gallery wrap">{media}</div><section class="case-content-grid wrap section-space" id="workflow"><div class="case-aside"><p class="eyebrow">THE WORKFLOW</p><h2>Follow the<br><span class="serif">business rule.</span></h2><p>A simplified path through the system. Each step has an explicit responsibility.</p></div><ol class="workflow-timeline">{flow}</ol></section><section class="case-decisions wrap section-space" id="decisions"><div class="section-heading"><div><p class="eyebrow">ENGINEERING DECISIONS</p><h2>The interesting<br><span class="serif">part of the work.</span></h2></div><p>The constraints, the trade-offs,<br>and how I approached them.</p></div><div class="decisions-list">{decision_html}</div></section><section class="case-evidence wrap section-space" id="evidence"><p class="eyebrow">EVIDENCE &amp; SCOPE</p><h2>What was delivered.<br><span class="serif">What it means.</span></h2><p class="case-lead">{e(p['evidence'])}</p>{evidence_detail}<div class="evidence-links">{links}</div><div class="scope-grid"><div><h3>What I take from this project</h3><ul>{lessons}</ul></div><div><h3>Scope &amp; limitations</h3><ul>{limitations}</ul></div></div></section><a class="next-project wrap" href="../{next_p['id']}/index.html"><span class="eyebrow">NEXT CASE STUDY</span><div><h2>{e(next_p['shortName'])}<span class="serif"> / keep exploring</span></h2>{icon()}</div></a><div class="case-contact wrap"><p>Have a similar problem to solve?</p><a class="text-link" href="mailto:{PROFILE['email']}">Let’s talk {icon()}</a></div></main>{footer(prefix)}</body></html>'''


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
