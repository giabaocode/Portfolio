# HomestayDorm interface captures

Captured on 1 November 2026 from the actual application running locally.

- Source: https://github.com/NotTodaySirr/HomestayDorm
- Commit: `3ffe4829319c1bb8ddbc41f237c8b6aa35a0495d`
- Runtime: Next.js 16.2.1 / React 19, generated Prisma client, isolated PostgreSQL.
- The repository schema was applied to a new empty database. A separate demo
  seed created three `.test` users, two branches, seven rooms, 28 beds, eight
  registrations and three viewing appointments. It does not contain real tenants,
  identity documents, leases or payment records.
- Names and phone numbers are synthetic. Optional identity/birth/address fields
  were left empty in the captured intake form. Mixed bed states are seeded
  inventory examples, not evidence that live deposits or leases were processed.
- Original application layout and business logic were preserved. Configuration
  used loopback, fresh session credentials, authentication bypass disabled and
  no email credentials. Only the Next.js development indicator was disabled
  through its documented configuration for unobstructed screenshots.
- Desktop screenshots: 1440 × 900 browser JPEG captures. Responsive WebP copies
  are encoded by `scripts/prepare_assets.py`.

Both the production build and TypeScript checks passed. Through the normal login
and UI, the demo sales user expanded individual beds, filtered rooms for two male
residents with a 2,000,000 VND budget, selected room 101 and saved a new registration.
The new record appeared in the queue, was found by search and was moved from
CONSULTING to WAITLIST. PostgreSQL confirmed headcount 2, maxPrice 2000000,
the USER creator, the room 101 relation and the appended waitlist note.
There are nine registrations after this UI-created record.

The first two captures precede saving; the queue capture follows the WAITLIST
update. The viewing schedule displays the three seeded appointments. No email,
appointment creation, deposit/payment, contract signing or move-out action was
performed. ContractBedDetail.priceAtSigning exists in source; contract snapshot
behavior was not runtime-tested in this session.

The schema has a legacy DRAFT default/comment, while the current intake action
creates CONSULTING and the list/status action exposes five active states.
Portfolio copy describes the current tested path rather than implying that the
entire legacy state diagram was exercised.

Checkout, database, credentials and session cookies remain outside the portfolio.
