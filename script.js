/* ===========================================
   THE WORKFLOW ENGINE — interactions
   =========================================== */

/* ---------- Project data: each project is a state machine ---------- */
const ICON_CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const PROJECTS = [
  {
    id: "lunfa",
    featured: true,
    featuredOrder: 2,
    name: "Lunfa — AI Chinese writing tutor",
    context:
      "A university research group needed a production web app that helps Chinese learners self-correct without the AI simply giving away the answer.",
    role: "Freelance full-stack developer · team of 2 · requirements through deployment",
    evidenceLabel: "Verified delivery",
    evidence:
      "Live at lunfa.net · actively used by the research team · delivered on time and paid in full.",
    tagline:
      "A chatbot that finds grammar mistakes in a learner's Chinese sentence, highlights them, and coaches the learner to fix it themselves — instead of handing over the answer.",
    tags: ["ai", "backend", "ba"],
    badge: "Freelance",
    badgeType: "badge-green",
    date: "Mar – Apr 2026",
    live: "lunfa.net",
    stack: [
      "React 19",
      "Express 5",
      "MongoDB",
      "Vertex AI · Gemini 2.5",
      "JWT",
    ],
    media: [
      {
        src: "./assets/photo_prod/lunfa-chat.png",
        alt: "Lunfa chatbot highlighting a Chinese grammar error and coaching the learner to rewrite the sentence",
        caption: "Guided correction — highlight the error, explain the rule, then ask the learner to try again.",
      },
      {
        src: "./assets/photo_prod/lunfa-login.png",
        alt: "Lunfa sign-in screen with email and Google authentication options",
        caption: "Production authentication flow with email and Google sign-in.",
      },
    ],
    links: [
      { label: "Live site →", href: "https://lunfa.net" },
      {
        label: "GitHub profile →",
        href: "https://github.com/giabaocode",
        ghost: true,
      },
    ],
    flow: [
      {
        label: "USER INPUT",
        desc: "Learner types a sentence in Chinese (HSK 1–4 level).",
      },
      {
        label: "AI ANALYZE",
        desc: "Gemini 2.5 Flash evaluates the sentence against a grammar rulebook.",
        challenge:
          "The AI sometimes returns broken JSON — control characters inside string values crash the parser.",
        fix: "A ~3,000-word system prompt pins the grammar rules + a strict output schema, with responseMimeType=JSON. On top of that, a 3-layer guard: normal parse → sanitize + regex-extract the JSON → safe fallback message. The chat never dies.",
      },
      {
        label: "HIGHLIGHT",
        desc: "Wrong words are painted red inside the original sentence.",
        challenge:
          "Highlighting the exact wrong word without matching a shorter substring elsewhere.",
        fix: "Build a dynamic split regex with error words sorted by length (longest first), then render each segment separately so only the real mistakes light up.",
      },
      {
        label: "SELF-CORRECT",
        desc: "The learner gets reason + correct structure + a prompt, and rewrites it themselves.",
        challenge:
          "Vertex AI requires the chat history to start with a 'user' role, and long history blows the token limit.",
        fix: "shift() off any leading non-user message and keep only the last 10 turns — pedagogy stays intact (never give the answer) while staying inside limits.",
      },
      {
        label: "MASTERED",
        desc: "Correct sentence accepted. Conversation auto-titled by Gemini and saved to MongoDB.",
      },
    ],
  },
  {
    id: "sstc",
    featured: true,
    featuredOrder: 1,
    openDetails: true,
    detailsLabel: "Warranty intake workflow",
    name: "SSTC warranty operations platform",
    context:
      "At the R&D and Service Center of SSTC Technology JSC, independently developed the warranty operations source from customer chat intake through shipping, warehouse reconciliation, inspection and return workflows.",
    role: "Backend Developer Intern · Sole developer from requirements and data design through implementation, testing and handover",
    evidenceLabel: "Internship delivery & proof",
    evidence:
      "29-state workflow engine · 57 versioned schema migrations · 800+ automated test methods in source · last documented full verification: 805 tests · handed over to SSTC R&D Center.",
    tagline:
      "A workflow-heavy Spring Boot platform that keeps business decisions deterministic while coordinating customer intake, shipment tracking, warehouse evidence, technical inspection and returns.",
    tags: ["ai", "backend", "ba"],
    badge: "R&D Internship",
    badgeType: "badge-green",
    date: "Jun – Aug 2026",
    stack: [
      "Java 21",
      "Spring Boot 3",
      "PostgreSQL 16",
      "Flyway",
      "Claude API",
      "Resilience4j",
      "Testcontainers",
      "Docker",
    ],
    media: [
      {
        src: "./assets/photo_prod/sstc-chat.png",
        alt: "Giao diện Web Chat tiếp nhận bảo hành SSTC với tiến trình 6 bước và khung nhập serial",
        caption: "Web Chat tiếp nhận — giao diện tương tác với tiến trình 6 bước, trích xuất serial và đối chiếu dữ liệu.",
      },
      {
        src: "./assets/photo_prod/sstc-intake.png",
        alt: "Bảng tiếp nhận kho nội bộ SSTC quản lý phiên nhận kiện, quét tem vận đơn và đối soát",
        caption: "Warehouse receiving — scan shipment labels, reconcile expected and observed components, and preserve evidence.",
      },
      {
        src: "./assets/photo_prod/sstc-inspection.png",
        alt: "Giao diện kiểm định kỹ thuật và ghi nhận kết quả bảo hành SSTC",
        caption: "Technical inspection — role-controlled findings and auditable approve or reject decisions.",
      },
      {
        src: "./assets/photo_prod/sstc-lookup.png",
        alt: "Trang tra cứu trạng thái phiếu bảo hành SSTC với dữ liệu cá nhân được che",
        caption: "Customer tracking — token-gated lookup with masked personal information.",
      },
    ],
    links: [],
    accessNote: "Company project · source repository is not publicly linked · no production data is included",
    architecture: {
      label: "Backend system map",
      status: "Complete source handover · production data excluded",
      nodes: [
        { kicker: "CHANNEL", title: "Web Chat", note: "normalized request contract" },
        { kicker: "ORCHESTRATOR", title: "Message Processor", note: "AI outside transaction" },
        { kicker: "BUSINESS CORE", title: "Workflow Engine", note: "backend owns 29 states" },
        { kicker: "DATA", title: "PostgreSQL", note: "warranty + operational truth" },
        { kicker: "OPERATIONS", title: "Warehouse & Inspection", note: "evidence + role controls" },
      ],
      metrics: [
        ["800+", "automated test methods"],
        ["805", "last documented full run"],
        ["57", "schema migrations"],
        ["29", "workflow states"],
      ],
      safeguards: ["idempotency", "optimistic lock", "PII-local rules", "AI fallback"],
    },
    flow: [
      {
        label: "CHAT INTAKE",
        desc: "The customer describes the warranty request naturally; the bot extracts intent and product clues without forcing a rigid form.",
        challenge:
          "An LLM is useful for understanding language, but it must never decide whether a product exists, is still covered, or deserves a ticket.",
        fix: "Claude is isolated behind an AiOrchestrator interface and only returns intent, confirmation and extracted fields. PII-bearing steps stay on local rules, and any timeout or malformed AI response falls back through Resilience4j to the deterministic mock engine.",
      },
      {
        label: "VERIFY SERIAL",
        desc: "The backend looks up the serial in PostgreSQL, reads the authoritative product identity and asks the customer to confirm it.",
        challenge:
          "Catalog values can be corrected later, but an issued warranty ticket must preserve exactly what was accepted at intake.",
        fix: "Serial-first verification reads warranty and product identity from relational data, then snapshots description, model, SKU, product number and serial onto the ticket while retaining the component foreign key.",
      },
      {
        label: "COLLECT PROOF",
        desc: "The bot gathers the issue, 1–5 condition photos, contact details, Zalo phone and pickup address, skipping fields already known.",
      },
      {
        label: "CREATE TICKET",
        desc: "A confirmed intake becomes a ticket with an atomic daily code such as NS-YYYYMMDD-000001.",
        challenge:
          "Rapid retries and duplicate messages can otherwise create duplicate tickets, active sessions or ticket codes.",
        fix: "Client-message idempotency, optimistic locking, database uniqueness constraints and an atomic ticket-code sequence keep concurrent turns consistent. External AI and shipping calls are kept outside long database transactions.",
      },
      {
        label: "SHIP & RECEIVE",
        desc: "A provider abstraction creates and tracks shipments; warehouse staff scan labels, reconcile received components and retain evidence.",
        challenge:
          "A shipping outage must not roll back or lose a warranty request that was already accepted.",
        fix: "Ticket creation and shipping application use separate short transactions. Idempotency and a shipping-state ledger make retries and out-of-order provider events recoverable.",
      },
      {
        label: "INSPECT & RETURN",
        desc: "Role-controlled inspection, manager decisions, customer consent and return fulfillment remain traceable through append-only audit and evidence records.",
      },
    ],
  },
  {
    id: "unihub",
    featured: true,
    featuredOrder: 3,
    name: "UniHub Workshop — event lifecycle platform",
    context:
      "A university event platform needed registration, payment and door check-in to remain dependable during traffic spikes and unreliable venue Wi-Fi.",
    role: "Team of 2 · admin panel, offline check-in, Redis, rate limiting, UI/UX and database design",
    evidenceLabel: "Performance test design",
    evidence:
      "Authored a K6 spike scenario targeting up to 12,000 virtual users; the portfolio does not present it as a live benchmark.",
    tagline:
      "Digitizes a university's 'skills & career week': student registers → pays by QR → gets an emailed QR ticket → staff scans it at the door, even with no WiFi. Built to survive a real traffic spike.",
    tags: ["backend", "ba"],
    badge: "Course",
    badgeType: "badge",
    date: "Apr – May 2026",
    note: "K6 spike scenario authored for up to 12,000 virtual users.",
    stack: [
      "Java 21",
      "Spring Boot 3",
      "PostgreSQL",
      "Redis",
      "Resilience4j",
      "PWA",
    ],
    links: [
      { label: "Run Concurrency Demo ⚡", href: "#concurrency-modal", isAction: true },
      { label: "GitHub profile →", href: "https://github.com/giabaocode" },
    ],
    flow: [
      {
        label: "REGISTER",
        desc: "Student claims a seat for a workshop.",
        challenge: "A registration traffic spike can oversell seats when requests read the same remaining capacity.",
        fix: "Optimistic locking (@Version): when two transactions read version=1, only one commits — the other gets OptimisticLockException and is told the seat is gone. A unique (user_id, workshop_id) constraint blocks double-submits, and a 2-tier Redis rate limit (5 req/10s per IP) shields the endpoint.",
      },
      {
        label: "QR PAYMENT",
        desc: "Pays via the SePay QR gateway; a webhook confirms asynchronously.",
        challenge:
          "If the payment gateway hangs, it could exhaust the thread pool and take the whole system down.",
        fix: "A Resilience4j circuit breaker trips OPEN after repeated timeouts → fail-fast instead of piling up blocked threads.",
      },
      {
        label: "EMAIL TICKET",
        desc: "A QR-coded ticket is emailed asynchronously via Spring events + @Async, so the API responds instantly.",
      },
      {
        label: "OFFLINE CHECK-IN",
        desc: "Staff scan tickets at the venue through a PWA.",
        challenge: "The auditorium WiFi drops in the middle of the event.",
        fix: "A service worker caches the app shell; scans are stored in IndexedDB offline and batch-synced automatically when the connection returns.",
      },
      {
        label: "ATTENDED",
        desc: "Check-in recorded. SeatReleaseJob frees expired PENDING tickets back to the pool.",
      },
    ],
  },
  {
    id: "auction",
    name: "Online Auction Platform",
    context:
      "A marketplace needed concurrent bidding, anti-sniping and the buyer–seller handoff after an auction to behave as one coherent system.",
    role: "Team of 2 · requirements, UI/UX, database design, bidder/seller systems, chat and order tracking",
    evidenceLabel: "Scope delivered",
    evidence:
      "17-table relational schema · 50+ documented endpoints · 6 route groups · 3 user roles.",
    tagline:
      "A full marketplace: bidders bid, sellers list, admins govern. Auto-bid, Buy Now, anti-sniping, a 4-step post-auction payment flow, buyer–seller chat and reputation — all kept correct under concurrent bids.",
    tags: ["backend", "ba"],
    badge: "Final project",
    badgeType: "badge",
    date: "Nov 2025 – Jan 2026",
    note: "17-table schema · 50+ documented endpoints · 6 route groups · 3 roles.",
    stack: ["TypeScript", "Express 5", "PostgreSQL", "Cloudinary", "node-cron"],
    links: [
      { label: "GitHub profile →", href: "https://github.com/giabaocode" },
    ],
    flow: [
      {
        label: "LISTED",
        desc: "Seller posts a product with a WYSIWYG editor and multi-image upload to Cloudinary.",
      },
      {
        label: "BIDDING",
        desc: "Bidders place manual bids or set an auto-bid ceiling.",
        challenge:
          "Many people bid the same product at the same millisecond → price race condition.",
        fix: "SELECT ... FOR UPDATE takes a row-level lock inside a transaction, so only one bid is processed per product at a time. Auto-bid is its own 3-branch state machine (raise ceiling / lose to old ceiling / beat old bidder), all in one transaction.",
      },
      {
        label: "ANTI-SNIPE",
        desc: "Guards against last-second sniping.",
        challenge:
          "Snipers bid in the final seconds to deny others a counter-bid.",
        fix: "If time-remaining < 5 minutes when a bid lands, end_at is pushed +10 minutes — the snipe strategy stops working.",
      },
      {
        label: "WON",
        desc: "Auction closes. A node-cron job runs every minute to detect ended auctions and fire 6 kinds of notification email.",
      },
      {
        label: "PAID → SHIPPED",
        desc: "Buyer uploads payment proof, seller confirms shipping, buyer confirms receipt.",
        challenge: "Sending email must never block the API response.",
        fix: "Every sendEmail() is called with .catch() and without await — the request returns immediately while mail goes out in the background.",
      },
      {
        label: "RATED",
        desc: "Both sides leave +/- reputation. Denormalized current_price & bid_count keep listing queries fast.",
      },
    ],
  },
  {
    id: "coffee",
    featured: true,
    featuredOrder: 4,
    name: "Coffee Shop POS & Management",
    context:
      "A real coffee shop needed staff ordering, role-specific operations and management reporting in one daily-use system.",
    role: "Team of 4 · owned the POS/order module, system UI/UX and requirements analysis",
    evidenceLabel: "Real-world use",
    evidence:
      "Deployed and actively used at a GUTA coffee shop for daily operations.",
    tagline:
      "A role-based system for a real coffee shop (GUTA): staff take orders on a POS, managers watch revenue analytics, HR runs shift scheduling. Admin / Manager / Staff each get their own surface.",
    tags: ["ba", "backend"],
    badge: "Running in a real shop",
    badgeType: "badge-amber",
    date: "Jun – Aug 2025",
    live: "in production",
    stack: ["React 19", "Express 5", "PostgreSQL", "Docker"],
    links: [
      {
        label: "Source code →",
        href: "https://github.com/tdthien106/Coffee_shop",
      },
    ],
    flow: [
      {
        label: "BROWSE",
        desc: "Staff browse drinks by category — the POS module I built end-to-end.",
      },
      {
        label: "CART",
        desc: "Real-time cart with per-item notes (preset tags + free text).",
      },
      {
        label: "CHECKOUT",
        desc: "A 3-step checkout: Summary → Transfer → Success.",
        challenge:
          "Circular foreign keys: orders.payment_id → payment and payment.order_id → orders.",
        fix: "DEFERRABLE INITIALLY DEFERRED constraints let both rows be inserted inside the same transaction without a chicken-and-egg failure.",
      },
      {
        label: "SUCCESS",
        desc: "Order completed and persisted; receipt issued.",
      },
      {
        label: "DASHBOARD",
        desc: "Managers see revenue-by-hour, peak hours and period-over-period comparisons.",
        challenge:
          "Heavy analytics queries on the manager dashboard, plus keeping staff out of it.",
        fix: "CTEs build the revenue aggregates, Promise.all() runs 9 analytics queries in parallel, and values are cast ::int/::bigint in SQL to avoid string/number bugs in JS. RBAC: a RequireAuth guard on the client + an authorize(...roles) middleware factory on the server.",
      },
    ],
  },
  {
    id: "homestay",
    name: "HomestayDorm — rental operations",
    context:
      "A multi-branch rental workflow needed to track each resident from initial inquiry through viewing, deposit, contract and move-out.",
    role: "Team of 4 · registration module, Prisma schema, UI/UX and requirements analysis",
    evidenceLabel: "Scope delivered",
    evidence:
      "15+ data models · bed-level availability · 6-state registration workflow.",
    tagline:
      "Runs a dorm/rental business down to the individual bed: intake → consult → viewing → deposit → contract → move-out & reconciliation. Multi-branch, 3 roles, built fullstack on Next.js Server Actions (no separate REST API).",
    tags: ["backend", "ba"],
    badge: "Team of 4",
    badgeType: "badge",
    date: "Mar – Apr 2026",
    stack: ["Next.js 16", "Prisma 7", "PostgreSQL", "TypeScript", "Zod"],
    links: [
      { label: "GitHub profile →", href: "https://github.com/giabaocode" },
    ],
    flow: [
      {
        label: "DRAFT → CONSULT",
        desc: "The registration ticket I owned: a 6-state machine (DRAFT → CONSULTING → WAITING_VIEW → WAITLIST → COMPLETED / CANCELLED).",
        challenge: "Manage availability at bed granularity, not just per room.",
        fix: "Modeled Room → Bed (1-to-N), each bed with its own status (AVAILABLE / OCCUPIED / DEPOSITED / MAINTENANCE) and price — so a room can be rented whole or shared.",
      },
      {
        label: "VIEWING",
        desc: "A viewing appointment is scheduled off the registration ticket.",
      },
      {
        label: "DEPOSIT → CONTRACT",
        desc: "Deposit taken, then a contract is signed per bed.",
        challenge:
          "If admin changes a bed's price later, old contracts must not change.",
        fix: "Price-snapshot pattern: ContractBedDetail stores priceAtSigning at signing time, fully decoupled from future price edits.",
      },
      {
        label: "RETURN",
        desc: "Move-out and reconciliation.",
        challenge: "Return-room has 10+ possible states.",
        fix: "A clearly-defined ReturnRoomTicketStatus enum, with every transition validated at the Server Action layer.",
      },
    ],
  },
  {
    id: "petcare",
    name: "PetCareX — vet clinic management",
    context:
      "A veterinary clinic system needed bookings, examinations, prescriptions, billing and customer benefits to work across multiple roles and branches.",
    role: "Team of 4 · sole frontend and backend implementer; teammates handled design",
    evidenceLabel: "Scope delivered",
    evidence:
      "5 roles · 9 route groups · customer and staff layouts · parameterized raw SQL without an ORM.",
    tagline:
      "A multi-branch veterinary clinic system — booking, examination, prescriptions, billing, subscription packages and loyalty points. I was the sole developer (frontend + backend) in a 4-person team.",
    tags: ["backend", "ba"],
    badge: "Sole implementer",
    badgeType: "badge",
    date: "Nov 2025 – Jan 2026",
    note: "5 roles · 9 route groups · dual layout (customer vs staff) · raw SQL, no ORM.",
    stack: ["React 18", "TypeScript", "Express", "PostgreSQL", "React Query"],
    links: [
      { label: "GitHub profile →", href: "https://github.com/giabaocode" },
    ],
    flow: [
      {
        label: "BOOK",
        desc: "Customer books an exam / vaccination / spa slot.",
        challenge: "Two customers book the same doctor for the same time slot.",
        fix: "A conflict-detection query checks the doctor's existing appointments before inserting; a clash returns 400 instead of a double-booking.",
      },
      { label: "CONFIRM", desc: "Front desk confirms (PENDING → WAITING)." },
      {
        label: "EXAM",
        desc: "Doctor examines the pet and records a diagnosis.",
      },
      {
        label: "PRESCRIBE → INVOICE",
        desc: "Prescription written, invoice generated automatically.",
        challenge:
          "Finishing an exam must atomically update status, write the prescription and create a correct invoice.",
        fix: "One PostgreSQL transaction (BEGIN/COMMIT/ROLLBACK) updates the visit, inserts the prescription and creates the invoice (exam fee + drug fee), then moves it to WAITING_PAYMENT. Parameterized $1,$2 queries keep raw SQL injection-safe.",
      },
      {
        label: "PAID",
        desc: "Payment recorded → loyalty points added, active service packages decremented per use.",
      },
    ],
  },
  {
    id: "melodix",
    name: "Melodix — Android music streaming",
    context:
      "A three-role music app needed resilient playback, offline listening and an artist workflow on top of a shared Supabase backend.",
    role: "Team of 4 · artist module, detail/search/share/profile flows, UI/UX and database co-design",
    evidenceLabel: "Scope delivered",
    evidence:
      "12 repositories · 14 API services · 10+ ViewModels · online and offline playback paths.",
    tagline:
      "A Spotify-style Android app with 3 roles (User / Artist / Admin): background playback, offline download, synced lyrics, Supabase backend. MVVM with 12 repositories, 14 API services, 10+ ViewModels.",
    tags: ["mobile", "backend", "ba"],
    badge: "Mobile",
    badgeType: "badge-blue",
    date: "Mar – Apr 2026",
    stack: ["Java", "Android", "MVVM", "Supabase", "Room", "ExoPlayer"],
    links: [
      { label: "GitHub profile →", href: "https://github.com/giabaocode" },
    ],
    flow: [
      {
        label: "PLAY",
        desc: "User taps a song; playback starts through ExoPlayer.",
        challenge: "The JWT can expire mid-session while the user is browsing.",
        fix: "An OkHttp Authenticator catches 401s, silently refreshes the token and retries the original request — transparent to the UI layer. A play only counts after 15 continuous seconds, so the play-count can't be spammed.",
      },
      {
        label: "BACKGROUND",
        desc: "Music keeps playing when the app is backgrounded, with a media notification.",
        challenge: "Android can kill the process and stop playback.",
        fix: "A Foreground Service + MediaSession + START_STICKY keeps the notification alive and stops the OS from killing the player.",
      },
      {
        label: "DOWNLOAD",
        desc: "Songs are downloaded for offline listening via WorkManager.",
        challenge:
          "Scoped Storage changed how files are written on Android 10+.",
        fix: "Branch by SDK version — Android 10+ uses the MediaStore API (ContentResolver), 9- uses the file system directly. Either way, metadata lands in Room DB.",
      },
      {
        label: "OFFLINE",
        desc: "Tracks play from the local Room library with no network.",
      },
    ],
  },
];

/* ---------- Render project cards ---------- */
const grid = document.getElementById("project-grid");
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function nodeMarkup(node, i, pid) {
  const hasNote = !!(node.challenge || node.fix);
  return `
    <button class="node${i === 0 ? " active" : ""}${hasNote ? " has-note" : ""}"
            data-project="${pid}" data-i="${i}" aria-pressed="${i === 0}">
      <span class="node-dot"><span class="node-num">${i + 1}</span></span>
      <span class="node-label">${node.label}</span>
    </button>`;
}

function detailMarkup(node) {
  const isNote = !!(node.challenge || node.fix);
  let html = `<p class="fd-stage">${node.label}</p><p class="fd-desc">${node.desc}</p>`;
  if (node.challenge) {
    html += `<div class="fd-block challenge"><span class="fd-tag">⚠ Hard problem</span><p>${node.challenge}</p></div>`;
  }
  if (node.fix) {
    html += `<div class="fd-block fix"><span class="fd-tag">✓ How I solved it</span><p>${node.fix}</p></div>`;
  }
  return { html, isNote };
}

function mediaMarkup(media = []) {
  if (!media.length) return "";
  const items = media
    .map(
      (item) => `
        <figure class="project-shot">
          <a href="${item.src}" target="_blank" rel="noopener" aria-label="Open full-size image: ${item.alt}">
            <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" />
          </a>
          <figcaption>${item.caption}</figcaption>
        </figure>`,
    )
    .join("");
  return `<div class="project-media" aria-label="Product screenshots">${items}</div>`;
}

function architectureMarkup(architecture) {
  if (!architecture) return "";
  const nodes = architecture.nodes
    .map(
      (node, index) => `
        <div class="architecture-node">
          <span>${node.kicker}</span>
          <strong>${node.title}</strong>
          <small>${node.note}</small>
        </div>
        ${index < architecture.nodes.length - 1 ? '<span class="architecture-link" aria-hidden="true"><i></i></span>' : ""}`,
    )
    .join("");
  const metrics = architecture.metrics
    .map(
      ([value, label]) => `
        <div class="architecture-metric">
          <strong>${value}</strong><span>${label}</span>
        </div>`,
    )
    .join("");
  const safeguards = architecture.safeguards
    .map((item) => `<span>${ICON_CHECK}${item}</span>`)
    .join("");

  return `
    <section class="architecture-panel" aria-label="${architecture.label}">
      <header>
        <div><span class="architecture-eyebrow">SYSTEM / 01</span><h4>${architecture.label}</h4></div>
        <span class="architecture-status"><i></i>${architecture.status}</span>
      </header>
      <div class="architecture-scroll">
        <div class="architecture-flow">${nodes}</div>
      </div>
      <div class="architecture-metrics">${metrics}</div>
      <div class="architecture-safeguards">${safeguards}</div>
    </section>`;
}

function projectMarkup(p) {
  const nodes = p.flow
    .map(
      (n, i) =>
        nodeMarkup(n, i, p.id) +
        (i < p.flow.length - 1
          ? '<span class="wire" aria-hidden="true"></span>'
          : ""),
    )
    .join("");

  const first = detailMarkup(p.flow[0]);
  const stack = p.stack.map((s) => `<span>${s}</span>`).join("");
  const links = p.links
    .map((l) => {
      if (l.isAction) {
        return `<button type="button" class="btn-project-action" data-action="${l.href}" ${l.file ? `data-file="${l.file}"` : ""}>${l.label}</button>`;
      }
      return `<a href="${l.href}" target="_blank" rel="noopener"${l.ghost ? ' class="ghost"' : ""}>${l.label}</a>`;
    })
    .join("");
  const accessNote = p.accessNote
    ? `<span class="project-access">${p.accessNote}</span>`
    : "";
  const livePill = p.live
    ? `<span class="live-pill"><span class="sys-dot"></span>${p.live === "in production" ? "IN PRODUCTION" : "LIVE · " + p.live}</span>`
    : "";
  const noteRow = p.note
    ? `<p class="project-note">${p.note}</p>`
    : "";
  const media = mediaMarkup(p.media);
  const architecture = architectureMarkup(p.architecture);
  const caseSummary = `
    <dl class="case-summary">
      <div>
        <dt>Context</dt>
        <dd>${p.context}</dd>
      </div>
      <div>
        <dt>My role</dt>
        <dd>${p.role}</dd>
      </div>
      <div class="case-evidence">
        <dt>${p.evidenceLabel}</dt>
        <dd>${p.evidence}</dd>
      </div>
    </dl>`;

  return `
    <article class="project ${p.featured ? "featured-project" : "supporting-project"}" data-project="${p.id}" data-tags="${p.tags.join(" ")}">
      <span class="spotlight" aria-hidden="true"></span>
      <div class="project-top">
        <div class="project-head">
          <div class="project-meta">
            ${p.featured ? '<span class="featured-label">Featured</span>' : ""}
            <span class="badge ${p.badgeType}">${p.badge}</span>
            <time>${p.date}</time>
          </div>
          <h3>${p.name}</h3>
          <p class="project-tagline">${p.tagline}</p>
          ${noteRow}
        </div>
        ${livePill}
      </div>

      ${caseSummary}

      ${architecture}

      ${media}

      <details class="technical-details"${p.id === "lunfa" || p.openDetails ? " open" : ""}>
        <summary>${p.detailsLabel || (p.id === "lunfa" ? "Technical workflow" : "View technical breakdown")}</summary>
        <div class="flow-wrap">
          <div class="flow" role="group" aria-label="${p.name} workflow">${nodes}</div>
        </div>
        <div class="flow-detail${first.isNote ? " is-note" : ""}" id="detail-${p.id}" aria-live="polite">${first.html}</div>
      </details>

      <div class="project-foot">
        <div class="project-stack">${stack}</div>
        <div class="project-actions">${accessNote}${links}</div>
      </div>
    </article>`;
}

const featuredProjects = PROJECTS.filter((project) => project.featured).sort(
  (a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99),
);
const supportingProjects = PROJECTS.filter((project) => !project.featured);
grid.innerHTML = [
  ...featuredProjects.map(projectMarkup),
  `<button class="project-toggle" id="project-toggle" type="button" aria-expanded="false" aria-controls="supporting-projects">
    <span>View ${supportingProjects.length} more projects</span>
    <span class="project-toggle-icon" aria-hidden="true">+</span>
  </button>`,
  '<div class="project-subgrid" id="supporting-projects">',
  '<div class="project-divider" id="supporting-divider" hidden><span>More selected work</span></div>',
  ...supportingProjects.map(projectMarkup),
  "</div>",
].join("");

const projectToggle = document.getElementById("project-toggle");
const projectDivider = document.getElementById("supporting-divider");
let supportingExpanded = false;
let activeProjectFilter = "all";

function updateProjectVisibility() {
  const filtering = activeProjectFilter !== "all";
  let visibleSupporting = 0;

  document.querySelectorAll(".project").forEach((project) => {
    const tags = project.dataset.tags?.split(" ") || [];
    const matches = !filtering || tags.includes(activeProjectFilter);
    const isSupporting = project.classList.contains("supporting-project");
    const revealSupporting = supportingExpanded || filtering;
    const visible = matches && (!isSupporting || revealSupporting);
    project.hidden = !visible;
    if (visible && isSupporting) visibleSupporting += 1;
  });

  if (projectDivider) {
    projectDivider.hidden = visibleSupporting === 0;
  }
  if (projectToggle) {
    projectToggle.hidden = filtering;
    projectToggle.setAttribute("aria-expanded", supportingExpanded);
    projectToggle.querySelector("span:first-child").textContent = supportingExpanded
      ? "Show fewer projects"
      : `View ${supportingProjects.length} more projects`;
    projectToggle.querySelector(".project-toggle-icon").textContent = supportingExpanded
      ? "−"
      : "+";
  }
}

projectToggle?.addEventListener("click", () => {
  supportingExpanded = !supportingExpanded;
  updateProjectVisibility();
});

updateProjectVisibility();

/* ---------- Screenshot lightbox ---------- */
const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

grid.addEventListener("click", (event) => {
  const shotLink = event.target.closest(".project-shot a");
  if (!shotLink || !lightbox || !lightboxImage || !lightboxCaption) return;
  event.preventDefault();
  const sourceImage = shotLink.querySelector("img");
  const caption = shotLink.closest("figure")?.querySelector("figcaption");
  lightboxImage.src = shotLink.href;
  lightboxImage.alt = sourceImage?.alt || "Project screenshot";
  lightboxCaption.textContent = caption?.textContent || "";
  lightbox.showModal();
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
});

lightboxClose?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target !== lightbox) return;
  const bounds = lightbox.getBoundingClientRect();
  const inside =
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom;
  if (!inside) lightbox.close();
});
lightbox?.addEventListener("close", () => {
  document.body.style.overflow = "";
  lightboxImage?.removeAttribute("src");
});

/* ---------- Node interactions (event delegation) ---------- */
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".node");
  if (!btn) return;
  const pid = btn.dataset.project;
  const i = parseInt(btn.dataset.i, 10);
  const project = PROJECTS.find((p) => p.id === pid);
  if (!project) return;

  // toggle active state within this project
  btn.parentElement.querySelectorAll(".node").forEach((n, nodeIndex) => {
    const on = n === btn;
    n.classList.toggle("active", on);
    n.classList.toggle("completed", nodeIndex < i);
    n.setAttribute("aria-pressed", on);
  });
  btn.parentElement.querySelectorAll(".wire").forEach((wire, wireIndex) => {
    wire.classList.toggle("completed", wireIndex < i);
  });

  const { html, isNote } = detailMarkup(project.flow[i]);
  const panel = document.getElementById(`detail-${pid}`);
  panel.innerHTML = html;
  panel.classList.toggle("is-note", isNote);
  if (!prefersReduced) {
    panel.animate(
      [
        { opacity: 0.25, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 190, easing: "ease-out" },
    );
  }
});

/* ---------- Theme ---------- */
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const themeButton = document.getElementById("theme-btn");
if (savedTheme) {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.dataset.theme = "light";
}
const updateThemeLabel = () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  themeButton?.setAttribute("aria-label", `Use ${nextTheme} theme`);
};
updateThemeLabel();
themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
  updateThemeLabel();
});

/* ---------- Year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Hamburger ---------- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const setMenuOpen = (open) => {
  hamburger?.classList.toggle("open", open);
  mobileMenu?.classList.toggle("open", open);
  hamburger?.setAttribute("aria-expanded", open);
  hamburger?.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu",
  );
  mobileMenu?.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
};
hamburger?.addEventListener("click", () => {
  setMenuOpen(hamburger.getAttribute("aria-expanded") !== "true");
});
document.querySelectorAll(".mobile-menu a").forEach((a) => {
  a.addEventListener("click", () => setMenuOpen(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && hamburger?.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    hamburger.focus();
  }
});

/* ---------- Project filters ---------- */
const filters = document.querySelectorAll(".filter");
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    activeProjectFilter = f;
    filters.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active);
    });
    updateProjectVisibility();
  });
});

/* ---------- Active nav on scroll ---------- */
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
const secObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle(
          "active",
          a.getAttribute("href") === `#${e.target.id}`,
        ),
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);
sections.forEach((s) => secObs.observe(s));

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById("copy-email");
copyBtn?.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  copyBtn.textContent = "Copied ✓";
  setTimeout(() => {
    copyBtn.textContent = "Copy email address";
  }, 2000);
});

/* Scroll progress bar */
const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
  let progressQueued = false;
  const onScroll = () => {
    if (progressQueued) return;
    progressQueued = true;
    requestAnimationFrame(() => {
      progressQueued = false;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const progress = max > 0 ? h.scrollTop / max : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Scroll to top ---------- */
const toTop = document.getElementById("to-top");
let topQueued = false;
window.addEventListener(
  "scroll",
  () => {
    if (topQueued) return;
    topQueued = true;
    requestAnimationFrame(() => {
      topQueued = false;
      toTop?.classList.toggle("show", window.scrollY > 500);
    });
  },
  { passive: true },
);
toTop?.addEventListener("click", () =>
  window.scrollTo({
    top: 0,
    behavior: prefersReduced ? "auto" : "smooth",
  }),
);

/* ===========================================
   CARD SPOTLIGHT (CURSOR TRACKING)
   =========================================== */
function initCardSpotlights() {
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}
initCardSpotlights();

/* ===========================================
   KEYBOARD NAVIGATION FOR WORKFLOW NODES
   =========================================== */
grid.addEventListener("keydown", (e) => {
  const btn = e.target.closest(".node");
  if (!btn) return;
  const nodes = [...btn.parentElement.querySelectorAll(".node")];
  const currentIndex = nodes.indexOf(btn);

  if (e.key === "ArrowRight" && currentIndex < nodes.length - 1) {
    e.preventDefault();
    nodes[currentIndex + 1].focus();
    nodes[currentIndex + 1].click();
  } else if (e.key === "ArrowLeft" && currentIndex > 0) {
    e.preventDefault();
    nodes[currentIndex - 1].focus();
    nodes[currentIndex - 1].click();
  }
});


/* ===========================================
   COMMAND PALETTE (CMD + K)
   =========================================== */
const cmdPalette = document.getElementById("cmd-palette");
const cmdInput = document.getElementById("cmd-input");
const cmdResults = document.getElementById("cmd-results");
const cmdCloseBtn = document.getElementById("cmd-close-btn");
const cmdKBtn = document.getElementById("cmd-k-btn");
const mobileCmdBtn = document.getElementById("mobile-cmd-btn");

const COMMANDS = [
  // Navigation
  { category: "Navigation", title: "Selected Work & Case Studies", desc: "View production systems and state machines", href: "#projects", icon: "💼", badge: "WORK" },
  { category: "Navigation", title: "Backend Capabilities", desc: "Java, PostgreSQL, transactions & reliability", href: "#capabilities", icon: "⚡", badge: "STACK" },
  { category: "Navigation", title: "About & Engineering Philosophy", desc: "Background, HCMUS & workflow-driven approach", href: "#about", icon: "👤", badge: "ABOUT" },
  { category: "Navigation", title: "Contact Information", desc: "Get in touch for internships & opportunities", href: "#contact", icon: "✉️", badge: "EMAIL" },

  // Key Projects
  { category: "Case Studies", title: "SSTC Technology JSC — R&D Internship", desc: "29-state warranty operations workflow, PostgreSQL, Testcontainers", action: "open_sstc", icon: "🏢", badge: "SSTC" },
  { category: "Case Studies", title: "UniHub Workshop Lifecycle Platform", desc: "K6 test design, optimistic locking, Redis rate limit", action: "open_unihub", icon: "🎓", badge: "UNIHUB" },
  { category: "Case Studies", title: "Lunfa — AI Chinese Writing Tutor", desc: "Live in production at lunfa.net with Vertex AI Gemini 2.5", href: "https://lunfa.net", isExternal: true, icon: "🌏", badge: "LUNFA" },

  // Interactive Tools & Actions
  { category: "Interactive Actions", title: "Explore Concurrency Design", desc: "Visualize five requests competing for one remaining seat", action: "open_concurrency_sim", icon: "🔥", badge: "DEMO" },
  { category: "Interactive Actions", title: "View 1-Page Resume (ATS-Ready)", desc: "Open print-ready single-page resume", href: "./assets/Resume.html", icon: "📄", badge: "RESUME" },
  { category: "Interactive Actions", title: "View Data Engineering CV", desc: "PostgreSQL, schema evolution, imports and data reliability", href: "./assets/CV_Data_Engineer.html", icon: "📊", badge: "DATA CV" },
  { category: "Interactive Actions", title: "View Software Tester CV", desc: "Test design, API/integration automation, concurrency and security", href: "./assets/CV_Tester.html", icon: "🧪", badge: "QA CV" },
  { category: "Interactive Actions", title: "View IT Business Analyst CV", desc: "Workflow analysis, business rules, API/data contracts and traceability", href: "./assets/CV_BA.html", icon: "💼", badge: "BA CV" },
  { category: "Interactive Actions", title: "View Full-Stack AI Developer CV", desc: "Tailored for Full-Stack AI, LLM Orchestration, Next.js & Spring Boot", href: "./assets/CV_FullStack_AI.html", icon: "🤖", badge: "AI CV" },
  { category: "Interactive Actions", title: "View Detailed Academic CV (Java Backend)", desc: "Comprehensive course metrics & 8 projects breakdown", href: "./assets/CV_Detail.html", icon: "📋", badge: "CV" },
  { category: "Interactive Actions", title: "Copy Email Address", desc: "pn.giabao9705@gmail.com", action: "copy_email", icon: "📋", badge: "COPY" },
  { category: "Interactive Actions", title: "Toggle Dark / Light Theme", desc: "Switch color theme palette", action: "toggle_theme", icon: "🌓", badge: "THEME" },
];

let activeCmdIndex = 0;
let filteredCommands = [...COMMANDS];

function renderCmdResults() {
  if (!cmdResults) return;
  if (filteredCommands.length === 0) {
    cmdResults.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-3); font-size: 13px;">
        No results found for "${cmdInput?.value || ""}".
      </div>`;
    return;
  }

  const groups = {};
  filteredCommands.forEach((cmd, idx) => {
    if (!groups[cmd.category]) groups[cmd.category] = [];
    groups[cmd.category].push({ cmd, globalIndex: idx });
  });

  let html = "";
  for (const [category, items] of Object.entries(groups)) {
    html += `<div class="cmd-group-title">${category}</div>`;
    items.forEach(({ cmd, globalIndex }) => {
      const isActive = globalIndex === activeCmdIndex;
      html += `
        <div class="cmd-item${isActive ? " active" : ""}" data-index="${globalIndex}" role="option" aria-selected="${isActive}">
          <div class="cmd-item-left">
            <span class="cmd-item-icon">${cmd.icon}</span>
            <div class="cmd-item-info">
              <div class="cmd-item-title">${cmd.title}</div>
              <div class="cmd-item-desc">${cmd.desc}</div>
            </div>
          </div>
          <span class="cmd-item-badge">${cmd.badge}</span>
        </div>`;
    });
  }

  cmdResults.innerHTML = html;

  const activeEl = cmdResults.querySelector(".cmd-item.active");
  if (activeEl) {
    activeEl.scrollIntoView({ block: "nearest" });
  }
}

function openCmdPalette() {
  if (!cmdPalette) return;
  cmdPalette.showModal();
  document.body.style.overflow = "hidden";
  if (cmdInput) {
    cmdInput.value = "";
    cmdInput.focus();
  }
  filteredCommands = [...COMMANDS];
  activeCmdIndex = 0;
  renderCmdResults();
}

function closeCmdPalette() {
  if (!cmdPalette) return;
  cmdPalette.close();
  document.body.style.overflow = "";
}

function executeCommand(cmd) {
  if (!cmd) return;
  closeCmdPalette();

  if (cmd.href) {
    if (cmd.isExternal) {
      window.open(cmd.href, "_blank", "noopener");
    } else if (cmd.href.startsWith("#")) {
      const target = document.querySelector(cmd.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = cmd.href;
    }
  } else if (cmd.action) {
    if (cmd.action === "open_sstc") {
      const sstcEl = document.querySelector('[data-project="sstc"]');
      if (sstcEl) {
        sstcEl.scrollIntoView({ behavior: "smooth" });
        const details = sstcEl.querySelector(".technical-details");
        if (details) details.open = true;
      }
    } else if (cmd.action === "open_unihub") {
      const unihubEl = document.querySelector('[data-project="unihub"]');
      if (unihubEl) {
        unihubEl.scrollIntoView({ behavior: "smooth" });
        const details = unihubEl.querySelector(".technical-details");
        if (details) details.open = true;
      }
    } else if (cmd.action === "open_concurrency_sim") {
      openConcurrencyModal();
    } else if (cmd.action === "copy_email") {
      navigator.clipboard?.writeText("pn.giabao9705@gmail.com");
      const copyBtn = document.getElementById("copy-email");
      if (copyBtn) {
        copyBtn.textContent = "Copied ✓";
        setTimeout(() => (copyBtn.textContent = "Copy email address"), 2000);
      }
    } else if (cmd.action === "toggle_theme") {
      const themeBtn = document.getElementById("theme-btn");
      themeBtn?.click();
    }
  }
}

cmdKBtn?.addEventListener("click", openCmdPalette);
mobileCmdBtn?.addEventListener("click", openCmdPalette);
cmdCloseBtn?.addEventListener("click", closeCmdPalette);

cmdPalette?.addEventListener("click", (e) => {
  if (e.target === cmdPalette) closeCmdPalette();
});

cmdInput?.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    filteredCommands = [...COMMANDS];
  } else {
    filteredCommands = COMMANDS.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.desc.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.badge.toLowerCase().includes(query),
    );
  }
  activeCmdIndex = 0;
  renderCmdResults();
});

cmdInput?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (filteredCommands.length > 0) {
      activeCmdIndex = (activeCmdIndex + 1) % filteredCommands.length;
      renderCmdResults();
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (filteredCommands.length > 0) {
      activeCmdIndex =
        (activeCmdIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderCmdResults();
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (filteredCommands[activeCmdIndex]) {
      executeCommand(filteredCommands[activeCmdIndex]);
    }
  } else if (e.key === "Escape") {
    closeCmdPalette();
  }
});

cmdResults?.addEventListener("click", (e) => {
  const item = e.target.closest(".cmd-item");
  if (!item) return;
  const idx = parseInt(item.dataset.index, 10);
  executeCommand(filteredCommands[idx]);
});

// Global shortcut Cmd+K / Ctrl+K
window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (cmdPalette?.open) {
      closeCmdPalette();
    } else {
      openCmdPalette();
    }
  }
});

/* ===========================================
   CONCURRENCY PLAYGROUND CONTROLLER
   =========================================== */
const concurrencyModal = document.getElementById("concurrency-modal");
const concurrencyClose = document.getElementById("concurrency-close");
const simFireBtn = document.getElementById("sim-fire-btn");
const simResetBtn = document.getElementById("sim-reset-btn");
const simThreads = document.getElementById("sim-threads");
const simDbVersion = document.getElementById("sim-db-version");
const simRedisStatus = document.getElementById("sim-redis-status");
const simExplanation = document.getElementById("sim-explanation");

const THREADS_DATA = [
  { id: "Thread #1", user: "student_492", pid: "tx-4921" },
  { id: "Thread #2", user: "student_883", pid: "tx-4922" },
  { id: "Thread #3", user: "student_104", pid: "tx-4923" },
  { id: "Thread #4", user: "student_771", pid: "tx-4924" },
  { id: "Thread #5", user: "student_315", pid: "tx-4925" },
];

function renderInitialThreads() {
  if (!simThreads) return;
  simThreads.innerHTML = THREADS_DATA.map(
    (t) => `
      <div class="sim-thread" id="sim-${t.pid}">
        <div>
          <span class="sim-thread-name">${t.id} (${t.user})</span>
          <span style="color: var(--text-3); font-size: 10px; margin-left: 6px;">[PID ${t.pid}]</span>
        </div>
        <span class="sim-thread-status">IDLE · version=1 read</span>
      </div>`,
  ).join("");
  if (simDbVersion) {
    simDbVersion.textContent = "workshop_id=1 · version=1 · available=1";
  }
  if (simRedisStatus) {
    simRedisStatus.textContent = "5 req/10s bucket healthy";
  }
  if (simExplanation) {
    simExplanation.innerHTML = `Click <strong>"Fire 5 Concurrent Requests"</strong> to visualize how Spring Boot's <code>@Version</code> detects conflicting updates when one seat remains.`;
  }
}

function openConcurrencyModal() {
  if (!concurrencyModal) return;
  concurrencyModal.showModal();
  document.body.style.overflow = "hidden";
  renderInitialThreads();
}

function closeConcurrencyModal() {
  if (!concurrencyModal) return;
  concurrencyModal.close();
  document.body.style.overflow = "";
}

concurrencyClose?.addEventListener("click", closeConcurrencyModal);
concurrencyModal?.addEventListener("click", (e) => {
  if (e.target === concurrencyModal) closeConcurrencyModal();
});

simResetBtn?.addEventListener("click", renderInitialThreads);

simFireBtn?.addEventListener("click", () => {
  if (simFireBtn.disabled) return;
  simFireBtn.disabled = true;
  simFireBtn.textContent = "Executing 5 concurrent transactions...";

  if (simRedisStatus) {
    simRedisStatus.textContent = "Tokens consumed: 5/5 claimed (Bucket throttled)";
  }

  // Set all to TRYING
  document.querySelectorAll(".sim-thread").forEach((el) => {
    el.className = "sim-thread";
    el.querySelector(".sim-thread-status").textContent =
      "TRY_COMMIT (WHERE version=1)";
  });

  // Winner is random thread
  const winnerIndex = Math.floor(Math.random() * THREADS_DATA.length);

  setTimeout(() => {
    THREADS_DATA.forEach((t, idx) => {
      const el = document.getElementById(`sim-${t.pid}`);
      if (!el) return;

      if (idx === winnerIndex) {
        el.className = "sim-thread winner";
        el.querySelector(".sim-thread-status").textContent =
          "200 OK · COMMITTED (version=2, seat claimed)";
      } else {
        el.className = "sim-thread conflict";
        el.querySelector(".sim-thread-status").textContent =
          "409 CONFLICT · OptimisticLockException (Rollback)";
      }
    });

    if (simDbVersion) {
      simDbVersion.innerHTML = `<strong>workshop_id=1 · version=2 · available=0 (LOCKED)</strong>`;
    }

    if (simExplanation) {
      simExplanation.innerHTML = `
        <strong>Result:</strong> ${THREADS_DATA[winnerIndex].id} won the atomic write race. The other 4 threads caught 
        <code>OptimisticLockException</code> because the row version incremented to 2, causing their 
        <code>UPDATE ... WHERE version=1</code> to affect 0 rows. 
        <strong>Illustrated outcome: one commit succeeds and conflicting workers are rejected.</strong>`;
    }

    simFireBtn.disabled = false;
    simFireBtn.innerHTML = `<span class="sim-fire-icon">🔥</span> Fire Again`;
  }, 450);
});

// Event delegation for opening concurrency modal from action buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-action="#concurrency-modal"]');
  if (btn) {
    e.preventDefault();
    openConcurrencyModal();
  }
});

// Re-init spotlights when projects are expanded
projectToggle?.addEventListener("click", () => {
  setTimeout(initCardSpotlights, 50);
});
