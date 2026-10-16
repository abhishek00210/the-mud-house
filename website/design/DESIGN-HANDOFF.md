# Missing guest pages — design handoff

Visual blueprint: [missing-pages.html](./missing-pages.html), served at `/design/missing-pages.html`. It contains responsive HTML compositions for Gallery, Contact, FAQs, Explore Varanasi, the shared information template and a general 404. Resize to 390px and 320px to inspect the mobile composition. Gallery filters/lightbox, FAQ search and a local form-preview response demonstrate intent.

## Design direction

- **Visual thesis:** warm stone, quiet paper and wine-red typography make the hotel feel personal, with natural photography carrying the atmosphere.
- **Content plan:** a clear introduction, a useful browse/answer/enquiry surface, practical detail, then one direct next step.
- **Interaction thesis:** a restrained hero entrance; gentle photo zoom on intentional hover; clear filter, accordion and focus states. Respect reduced motion.

The previous screenshot-matched pages retain their own designs. New guest pages form one cohesive family using existing header `Brand` and a new shared footer owned by the integrator. No broad header/footer restyling of existing pages is required.

## Shared production contract

Parent owns `app/guest-shared.tsx` and `app/guest-shared.css`:

```tsx
GuestHero({ eyebrow, title, description, photo?: ReactNode, children?: ReactNode, compact?: boolean })
GuestCTA({ title, description, href, label })
GuestBreadcrumb({ current })
GuestPhoto({ source: 'about' | 'rooms' | 'restaurant' | 'travel' | 'experience', name: string, alt?, className? })
```

Shared classes: `.guest-container`, `.guest-eyebrow`, `.guest-button`, `.guest-button--outline`, `.guest-text-link`, `.guest-section-heading`, `.guest-note`. Page-specific CSS should use `guest-gallery-`, `guest-contact-`, `guest-faq-`, `guest-city-` and `guest-reading-` prefixes. The HTML board uses illustrative local classes; use the production names above when implementing.

Foundation: `#f8f5f0` paper, `#eee8df` sand, `#581b15` wine, `#292822` ink, `#686660` muted, `#c4a062` gold, `#e3dcd2` border. Georgia/Times serif for display and headings; Arial/Helvetica for UI/body. Container 92%, max 1320px; 90% on mobile. Desktop header about 86–90px, mobile 73–76px. Headings: desktop H1 58–64px, H2 35–38px, mobile H1 40–44px and H2 29–31px. Body 15–17px, supporting UI 12–14px. Buttons 47px minimum, 2px radius, outlined secondary, no pill styles. Section padding 46–54px desktop/31–36px mobile. Borders replace decorative shadows.

Breakpoints: 1100px for density; 900/960px for layout; 700px stacks primary grids; 380px removes two-column form/photo layouts where needed. Header mobile navigation must use the existing working menu, not the board demonstration button.

## Page compositions and behaviors

### Gallery — design lead

- Breadcrumb then 47/53 split hero. Left: eyebrow, two-line title, short deck, Browse Gallery and Plan Your Stay. Right: one tall entrance image with room/table images stacked alongside, height 355px desktop / 280px mobile.
- Sand browse section: heading left; category buttons right. Gallery photographs in 3 columns desktop, 2 on 390px, 1 below 380px. Image height 220px desktop / 155px two-column mobile; serif title and quiet category/concept caption below. No card boxes.
- Categories: All, Stay, Dine, Explore. Filter state uses `aria-pressed` and announces result count. Photo lightbox: visible title, concept caption, previous/next buttons, ArrowLeft/ArrowRight, Escape, focus return. Filtered order governs navigation.
- Keep photo labels accurate. Reuse `AboutPhoto` entrance/reception/bathroom, `RoomPhoto` categories, `RestaurantPhoto` dining/table, and `TravelPhoto` destination scenes.

### Contact — contact/FAQ builder

- 54/46 compact introduction with reception/lounge photo, height around 295px.
- Content 36/64 split with 7% gap. Left: approachable context plus truthful location and contact data; no invented phone, precise address, directions map or live availability. Right: sand enquiry form, two columns; single column below 380px.
- Topic select: general, stay, dining, experiences, group, access. Name, method, contact, optional dates/guests, message, privacy acknowledgement. Date/contact/count validation. Review before email draft, preserve edits. Show topic-specific onward links to established room/table/experience flows as appropriate.
- Arrival/access section: 2 useful text columns plus an access callout. Ask users to confirm meeting points/arrangements rather than invent travel times or access promises.

### FAQs — contact/FAQ builder

- 64/36 compact hero with table photo; left includes search field beneath short deck.
- Desktop 235px category rail plus answer column, 55px gap; mobile category links wrap above the questions. Group headings 29px, accordions separated by thin rules.
- Search names and answer text; hide empty groups and show an informative empty state with clear search. Preserve accessible accordion semantics and keyboard use. Existing room, dining and experience FAQs supply factual content; add clear contextual links.

### Explore Varanasi — design lead

- Breadcrumb then edge-to-edge river image, about 415px desktop / 430px mobile. Restrained left gradient gives title/deck strong contrast. One primary action to browse inspiration.
- Three open editorial columns: river/ghats, heritage lanes, food/time at the table. 250px photographs; headings, short copy, contextual links to current experiences and restaurant.
- Sand practical section with four numbered pointers in 2 columns desktop / 1 mobile. Finish with enquiry CTA. No unsupported attraction opening times, prices, hotel distances, transfer guarantees or included services. Research factual destination claims from primary sources before adding them.

### Shared policy / house-rules reading pages — information builder

- Breadcrumb, text-led title, short deck, visible truthful pending-approval status where final business content is absent.
- Desktop 220px contents rail + comfortable reading column max780px, gap70px. Mobile contents wrap above the body. Sections separated by thin rules with a consistent hierarchy.
- Four routes: `/privacy-policy`, `/terms-and-conditions`, `/cancellation-refund-policy`, `/house-rules`.
- The privacy prototype describes the current email-draft UI, not an invented comprehensive legal policy. Each page should explain what is known and what the hotel must confirm. No made-up refund windows, cancellation charges, data retention promises, legal jurisdiction or house rules. End with a topic-specific enquiry link.

### 404 — integrator

- Large calm headline, short explanation, Back to Hotel and Contact actions, and links to rooms/dining/experiences. Warm entrance photo with an architectural arch crop. Stack at 700px.
- Preserve existing room/experience-specific not-found outcomes.

## Acceptance checks

- Every route has one H1, useful title/meta description, working header/footer links and a visible primary next step.
- No UI pixels from screenshot source assets leak into photo crops; images have useful alt text, correct concept labels and deliberate cropping.
- No horizontal page overflow at 320, 390, 768 or 1440px. Controls remain usable, headings do not collide, and the first viewport has a clear visual anchor.
- All filters, searches, accordions, gallery controls, query-prefilled enquiries and empty states work with keyboard as well as pointer.
- Forms preserve input on review/edit and honestly distinguish an enquiry draft from a confirmed booking.
- Type check and production build pass; browser review checks console, desktop/mobile layout and meaningful interactions.

## Asset and content limits

Existing photographs are screenshot crops with limited resolution; source files remain unchanged. Use separate SVG viewports for separate moments and readable HTML text. The logo varies in older reference pages (arch, stacked mark, leaf): new pages use the current shared arch Brand, while reference-specific pages stay intact. Gold-button travel pages remain intentionally different; use wine as the default new-page action color and gold only for CTA emphasis.
