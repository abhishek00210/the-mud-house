# The Mud House CMS server

Run `node server/index.mjs` from the website directory. The API listens on `127.0.0.1:5180`. In development, Vite should proxy `/api` and `/uploads` to this address. With a frontend build in `dist`, the same server also serves the complete website, including the admin application.

The first start seeds the website from `cms/seed.json`, creates a random administrator password, and writes the ID and password to `.data/initial-admin.txt` with owner-only permissions. Sign in at `/admin`. Changing the ID or password requires the current password, revokes existing sessions, and removes the initial-credentials file. Credentials are never included in a public response or content export.

## Private data and backups

- `.data/store.json`: website content, media metadata, booking requests, and the salted scrypt password hash. Writes use an atomic replacement and files have owner-only permissions.
- `.data/uploads/`: uploaded image bytes, served through validated image URLs.
- Admin JSON export: website configuration and booking requests, without password hashes or session secrets. Download the media files separately or back up the full private `.data` directory for complete recovery.

Use one API process for this local datastore. Do not run several server instances against the same directory. Stop the server before restoring a full filesystem backup. Do not include `.data` in source archives, public folders, or version control. Sessions live in memory and expire after eight hours; restarting the server signs administrators out without losing website edits or bookings.

For hosting, run this server behind an HTTPS reverse proxy and set `PUBLIC_ORIGIN=https://your-domain.example`. This explicitly permits that website origin and enables Secure session cookies. `API_PORT` can override port 5180. Keep the private data directory on persistent storage. No email/SMS delivery, payment provider, OTA channel sync, or real-time inventory service is configured: guest submissions become staff-managed booking requests, and a staff member confirms their status.

## API behavior

- Public: `GET /api/site`, `GET /api/auth/session`, `POST /api/auth/login`, `POST /api/bookings`.
- Authenticated: `/api/admin/site`, `/api/admin/manifest`, `/api/admin/media`, `/api/admin/bookings`, `/api/admin/export`, `/api/auth/logout`, `/api/auth/password`.
- Every write requires a trusted `Origin`. Authenticated writes additionally require the session's `X-CSRF-Token`. Sessions use an HttpOnly, SameSite=Strict cookie scoped to `/api`.
- Site edits require the current revision; conflicts return 409. Content and image placement IDs must exist in the current manifest. Uploaded metadata and modification timestamps remain server-controlled.
- Uploads accept PNG, JPEG, WebP and GIF, validate file signatures, and allow at most 8 MB each. SVG is excluded. The server generates storage names; referenced images cannot be deleted.
- Public requests validate availability switches and room/package date blocks. Stay check-out is exclusive; blocked dates are inclusive. General contact questions remain available while bookings are closed. Staff can manually record requests for closed/past dates. Request IDs make repeated identical submissions idempotent.
- Login and guest submissions have IP-based rate limits. Enquiry dates and dining times are interpreted in India Standard Time.

Run `node --test server/test.mjs` for isolated integration tests. They use temporary private directories and never change real website content or the real admin credentials.

Security implementation references: [Node.js crypto](https://nodejs.org/api/crypto.html), [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie), and [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
