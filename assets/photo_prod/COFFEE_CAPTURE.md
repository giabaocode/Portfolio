# Coffee Shop interface captures

Captured on 1 November 2026 from the application running locally.

- Source: https://github.com/tdthien106/Coffee_shop
- Commit: `34678d0d5ef595253f62745fde29e88052f4467f`
- Runtime: Express / Node, React / Vite, isolated PostgreSQL.
- Database: the repository's `02_create_tables.sql`, populated with a new
  synthetic seed instead of the original personal/account records.
- Demo seed: five synthetic users, seven coffee drinks and 104 historical/sample
  orders with matching payment and line totals. Names, credentials and `.test`
  emails are synthetic; no original personal details were used in screenshots.
- Two drink images shipped with the source are reused as illustrative menu images.
- Screenshots: 1440 × 900 browser JPEG captures, encoded to responsive WebP.
  They show the interface, not production usage or commercial results.

The POS workflow was exercised through the browser: staff login, drink selection,
quantity adjustment, preset/free-text notes, checkout review and the cash path.
PostgreSQL confirmed a new PAID/cash order of 70,000 VND, two lines, three drinks
and the saved takeaway note. No money was transferred. A second equivalent draft
was used to capture the checkout review with its heading visible.
Manager login was verified; `/api/home` returned 403 for the demo staff token
and 200 for the manager token with the development authentication bypass disabled.

Local runtime changes (not pushed to the source repository):

- Loopback ports, CORS origin, API URLs and fresh demo environment credentials.
- Revenue API requests now send the JWT already created by the normal login.
- Numeric strings from PostgreSQL are converted before number formatting;
  product revenue is labelled in VND rather than millions of VND.

The reporting screenshot includes these documented functional fixes. It preserves
the layout and charts; values come from the running API, not injected DOM or
fabricated success states. Financial aggregation correctness was not validated.
In particular, the metrics query joins payments to order lines and needs review
for duplicate revenue aggregation. The reporting screenshot is team-product
context; the portfolio owner's scope remains POS/order, UI/UX and requirements.

Other source findings: deferred foreign keys exist, but the current checkout
controller performs separate database steps rather than one shared transaction.
Checkout's authentication middleware is commented out. The success heading says
TRANSFER even for the cash path. These were not silently fixed or represented
as guarantees. The original home chart and report time-range comparisons were
not validated. Bank transfer/QR payment and exports were not exercised.

Checkout, database, credentials and logs remain outside the portfolio repository.
