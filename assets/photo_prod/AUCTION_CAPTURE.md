# Online Auction / AuctionBay interface captures

Captured on 1 November 2026 from the actual application running locally.

- Source: https://github.com/giabaocode/ptudw-final-project/tree/fix_final
- Commit: `917c8f6d63406004a29177671dd88de4dc8238e9`
- Runtime: Express 5 / TypeScript, React / Vite, isolated PostgreSQL.
- Synthetic data: five `.test` users, nine sample products, seeded bid history,
  one sample order and one seller upgrade request. No items were offered for
  real sale and no money changed hands.
- The repository had database documentation and SQL queries, but no SQL setup
  script. A local demo schema was bootstrapped from those sources. This is not
  a production database snapshot or a migration verification.
- Desktop captures: 1440 × 900. Originals are browser JPEG screenshots;
  responsive WebP copies are encoded by `scripts/prepare_assets.py`.
- UI source was preserved. Temporary runtime configuration used loopback
  addresses, a separate database, fresh demo credentials, and local non-TLS
  PostgreSQL. Committed environment credentials were replaced in the temporary
  checkout; external SMTP/Cloudinary credentials were not used.
- The seller UI reads `Products.images[0]`, while its query also returns an
  `image` alias from `Product_Images`. Demo seed data populates both representations.
  Product creation/upload was not tested.

Browser verification: bidder/seller/admin login, viewing the marketplace, a
manual bid, bid history, seller product search, and admin user/upgrade lists.
Submitting a bid ceiling of 25,000,000 changed the current price from 23,500,000
to 24,500,000 and changed the leading bidder to the demo bidder. PostgreSQL
confirmed the new leader and four bid records for that product afterward.
The marketplace capture precedes this action; bidding/seller captures follow it.

Not verified: concurrent requests, anti-sniping time boundaries, real email,
OAuth, Cloudinary uploads, payment proof upload, shipment and receipt flows.
No performance or production usage results are claimed.

The frontend README credits its Figma Community base. Source attributions also
credit shadcn/ui and Unsplash. Product images are illustrative Unsplash images
referenced by the project's existing frontend, paired with synthetic listings.

Checkout, database, credentials, logs and tokens remain outside the portfolio.
