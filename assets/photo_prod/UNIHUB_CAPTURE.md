# UniHub interface captures

Captured on 1 November 2026 from the actual application running locally.

- Source: https://github.com/giabaocode/UniHub_Workshop
- Source commit: `76e562528f77aad53074dd9a2d2cdbf58b68cddd`
- Runtime: Java 21 / Spring Boot, React / Vite, isolated PostgreSQL.
- Data: synthetic `.test` accounts, three workshops and thirteen demo tickets.
- Workshop dates were moved into the future for this demonstration. Counts,
  attendance and revenue shown in the interface are sample data, not production
  usage, business results or performance measurements.
- Desktop captures: 1440 × 900. Staff mobile capture: 390 × 844.
- Originals are browser JPEG screenshots. Responsive WebP copies are resized
  and encoded by `scripts/prepare_assets.py`; the interface was not reconstructed
  or altered for the images.

Verified through the browser: admin/student/staff login, attendee search,
student QR ticket rendering, workshop selection on mobile, and manual check-in
(attendance count changed from four to five and persisted after signing in again).

Camera scanning and offline-to-online reconciliation were not exercised. Payment,
email, OAuth, AI and Telegram integrations were not exercised. The local session
used the in-memory rate-limit store, not Redis. The checked-in frontend uses
`localStorage` for cached attendees and pending check-ins; it does not use IndexedDB.

The checkout, local database, demo credentials and session tokens are outside
the portfolio repository and are excluded from the public site.
