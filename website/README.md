# The Mud House — website and admin panel

A responsive hotel website based on the supplied visual references, built with React 19, TypeScript and Vite. A Node.js server provides the password-protected admin panel, persistent content and images, and a guest enquiry inbox.

## Run locally

Use Node.js 22.12 or later, or Node.js 20.19 or later in the 20.x release line.

```sh
npm install
npm run dev
```

Keep this process running while using the website. It starts the frontend at **http://127.0.0.1:5173/** and the API at `127.0.0.1:5180`. Vite proxies `/api` and `/uploads` to the API. Open **http://127.0.0.1:5173/admin** for administration.

On the first server start, the administrator ID is `admin` and a random password is written to the private **`.data/initial-admin.txt`** file. Use those credentials to sign in, then change the ID/password in **Settings → Administrator account**. Changing credentials removes this initial password file and invalidates other sessions. The password is never bundled with the frontend or included in a content export.

### Build and serve

```sh
npm run build
npm start
```

The build runs TypeScript checks and writes `dist/`. `npm start` serves both the built website and API at **http://127.0.0.1:5180/**, including `/admin` and client-route fallbacks. Stop the development server first so that only one API process uses the datastore.

For a Vite preview of the production frontend, use two terminals after stopping development:

```sh
# Terminal 1: API and persistent datastore
npm run server
```

```sh
# Terminal 2: production frontend with API/upload proxy
npm run preview
```

Preview uses port 5173, a trusted local origin for authenticated writes and guest submissions. A frontend-only/static server cannot replace the API; the website reads its published content from `/api/site` before rendering.

## Administration

- **Page content:** search and edit registered headings, descriptions, labels and information-page copy. Restore individual fields to their original wording.
- **Images & media:** upload PNG, JPEG, WebP or GIF files up to 8 MB, edit descriptions and captions, and replace existing image placements. Referenced images cannot be deleted until their uses are removed.
- **Rooms & availability:** edit the four room categories, descriptions, facilities, guest capacity, rates, images, visibility, request availability and blocked dates.
- **Travel packages:** add, arrange, edit, hide or remove experiences; manage names, URLs, descriptions, images, prices, durations, itineraries, inclusions, exclusions and date blocks.
- **Food menu, FAQs and Gallery:** manage structured entries, ordering, visibility and supported images/categories.
- **Bookings & enquiries:** review guest requests, filter/search the inbox, record internal notes, update statuses and manually add enquiries received elsewhere.
- **Settings:** manage branding, colours, logo, contact details, currency, global booking availability and separate stay, dining and experience request switches. Change administrator credentials and download a JSON backup.

Content changes stay in the current editor until **Publish changes** is selected. Publishing makes them available to the public site on its next load. **Discard** restores the last published state. Revision checks prevent an older draft from silently overwriting a newer publication. Media uploads, booking status/notes and account changes save immediately; the interface separates those operations from an unpublished content draft.

See [the admin guide](app/admin/ADMIN-GUIDE.md) for the editing workflow and [the server guide](server/README.md) for API, storage and hosting details.

## Guest bookings and enquiries

`/booking` accepts stay, dining, experience and general requests. Existing hotel enquiry dialogs, restaurant table forms, travel/package forms and the contact form also submit to the same backend. Visitors review their details, acknowledge the privacy information and send the request. A successful response displays a reference and saves the request in the admin inbox. Some existing forms offer an email draft as a fallback if sending fails; the browser does not send that email automatically.

Dates, date order, contact details, guest counts and required fields are validated in the browser and again on the server. Dining times use India Standard Time. Booking switches and room/package date blocks are enforced by the API, including for already-open browser pages. Blocks include their start and end dates; a room stay may check out on the first blocked day because checkout is exclusive. General questions remain available when booking channels are closed. Repeated identical submissions with the same request ID do not create duplicate requests.

**A received enquiry is not a confirmed reservation.** Staff can review it and change its status after agreeing arrangements with the guest. No payment collection, email/SMS delivery, channel-manager connection, automatic room inventory allocation or external booking-system integration is configured. Updating a status does not notify the guest automatically.

## Public pages

The seeded website has **22 canonical public URLs**, plus `/admin`. Additional published travel packages create their own detail URLs.

| Route | Content |
| --- | --- |
| `/` | Hotel homepage, room and experience previews, dining, stories and enquiries |
| `/about` | Story, approach, spaces, practical details and arrival/access information |
| `/rooms` | Four room categories, stay selection, inclusions, policies and FAQs |
| `/rooms/deluxe-room` | Deluxe Room details and stay enquiries |
| `/rooms/premium-room` | Premium Room details and stay enquiries |
| `/rooms/family-room` | Family Room details and stay enquiries |
| `/rooms/dormitory-room` | Dormitory details and bed enquiries |
| `/restaurant` | Dining, menu previews, restaurant gallery and table requests |
| `/food-menu` | Searchable menu with five categories and twelve seeded dishes |
| `/travel-packages` | Filterable experience listing and travel enquiries |
| `/travel-packages/sunrise-on-the-ganga` | Sunrise package details and itinerary |
| `/travel-packages/varanasi-heritage-walk` | Heritage Walk details and itinerary |
| `/travel-packages/stay-explore-kashi` | Stay & Explore package details and itinerary |
| `/gallery` | Category filters, image lightbox and contextual links |
| `/contact` | Guest enquiries and arrival guidance |
| `/faqs` | Searchable questions and category filters |
| `/explore-varanasi` | City guide, tourism-source links and practical guidance |
| `/privacy-policy` | Enquiry data and privacy information |
| `/terms-and-conditions` | Terms to confirm before booking |
| `/cancellation-refund-policy` | Changes, cancellations and refund information |
| `/house-rules` | Property arrangements to confirm before arrival |
| `/booking` | Unified stay, dining, experience and general request form |

Aliases include `/dine`, `/restaurant/menu`, `/experiences` and `/explore`. Experience detail paths also work under `/experiences/`. Unknown room/package paths show contextual recovery pages; other unknown paths show a general not-found page.

Room and experience detail pages reuse shared layouts with different data and photographs. Stay selections carry through validated URL parameters; dormitory requests use beds. Gallery dialogs support keyboard navigation, Escape and focus return. Mobile navigation, reduced-motion styles, FAQ filters and empty states are included. `/gallery?category=rooms` preselects a gallery category; `/contact?topic=groups#enquiry` opens a relevant contact flow. `/booking?type=stay&item=deluxe-room` preselects a room request.

## Storage and hosting

The server creates a private `.data/` directory:

- `store.json` contains published website data, media metadata, enquiries and the salted password hash.
- `uploads/` contains uploaded image files.
- `initial-admin.txt` contains first-run credentials until the password is changed.

Edits and enquiries survive browser and server restarts. Sessions are kept in server memory and expire after eight hours; restarting the server signs administrators out. Use **one API process** for this file-based datastore.

Back up the whole private `.data/` directory for complete recovery, and stop the server before restoring it. Admin JSON exports include content and enquiries but omit credentials and uploaded image bytes. Exports contain private guest contact details. Keep `.data`, exports and credentials outside public directories, source archives and version control. `.data/` is git-ignored; deleting it resets the installation and loses its saved content and enquiries.

For deployment, serve the Node application behind an HTTPS reverse proxy, set `PUBLIC_ORIGIN` to the exact public website origin, and retain `.data/` on persistent storage across deployments. `API_PORT` changes the API port; the development proxy expects 5180 unless its configuration is also updated. The server provides client-route fallback for the built frontend. See [server/README.md](server/README.md) before hosting.

## Content and image provenance

The original references remain in `public/images/*-reference.png` and `public/images/reference.png`. SVG viewports reuse their photographs without reproducing screenshot text or controls. `public/images/hero.png` is a generated hero; [IMAGE-PROMPT.md](IMAGE-PROMPT.md) records its prompt and provenance. Existing concept photographs are illustrative and can be replaced through the media library.

Unverified prices, contact details, policies, room arrangements and operating information remain labelled for confirmation. Owners should publish verified business information and approved policies through the admin panel. No founding history, exact property map, floor plan or accessibility guarantee has been invented. Floor-plan actions let guests request verified layouts. The optional, feature-detected WebMCP room tool is read-only and does not check live inventory.

## Code map and checks

- `app/main.tsx` loads published data before the public site and loads the admin application separately.
- `app/page.tsx` and the `about`, `rooms`, `room-detail`, `restaurant`, `food-menu`, `travel` and `experience-detail` modules implement the reference-based pages.
- `app/guest-*` contains gallery, contact, FAQs, city guide, policy pages and shared guest components.
- `app/booking-request.tsx` contains the unified booking page, shared submission UI and client validation; existing request modules reuse it.
- `app/admin/` contains the admin application, editors, styles, design notes and user guide.
- `cms/` contains shared types, public data/image helpers, initial seed content and the editable-field/image-placement manifest. The seed initializes a new datastore; changing it does not overwrite an existing installation.
- `server/` contains authentication, API validation, persistent storage, media handling and isolated integration tests.
- `scripts/dev.mjs` starts and stops the two development processes. Seed/registration scripts support developer maintenance of the initial content and manifest.
- `design/` records the earlier page audit, design handoff and public-site QA scope.

```sh
npm run build
npm run test:server
```

The build checks TypeScript and bundles the application. Backend tests create temporary private directories, so they do not change the real website, bookings or administrator credentials. Public UI and admin workflow checks should use the running app and include mobile layouts, publication/reload, image replacement and guest-request/inbox flows.
