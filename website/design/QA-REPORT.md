# Frontend completion verification

Date: 4 October 2026

## Completed checks

- TypeScript and Vite production build pass. New guest pages load in a separate bundle; no new runtime dependencies.
- All 21 canonical routes render one main H1, expected page title and no desktop horizontal overflow. A general unknown URL renders the intended recovery state.
- All eight new pages fit 320px, 390px and 768px viewports. A 320px header overflow found during inspection was corrected. Desktop composition reviewed at 1440px.
- Mobile navigation opens with correct destination links. Contact's `?topic=groups#enquiry` preselects groups and scrolls to the form after the guest-page bundle mounts.
- Gallery filters Rooms to four photographs. Lightbox ArrowRight advances within the filter, Escape closes it and focus returns to the opening photograph.
- FAQs filter Dining to five questions, search finds the breakfast answer, unrelated search produces a useful empty state and reset restores the full set.
- Contact validates empty form fields, preserves entries through its privacy dialog, and retains name/contact/topic/guest count/message through review → edit → review. Generated mailto body contains the expected fields. No email was sent.
- The original homepage enquiry modal now retains entered name, email and message when editing its prepared draft; browser verification passed.
- Independent rendered-source audit checked 759 internal links across all 21 routes, plus FAQ destinations; no nonexistent route or anchor targets remained.
- Pure validation checks covered Contact calendar dates, IST day boundary, guest counts, preferred contact methods, privacy acknowledgement and encoded email text. FAQ filters and gallery asset references passed bounded data checks. All four policy pages passed section-anchor and compact-dialog rendering checks.
- Browser console contained no current-page errors or warnings at the end of the route checks.

## Product limits

This is a complete frontend for the researched scope, not a connected booking system. Enquiries prepare email drafts and never automatically send, charge or reserve. The existing email recipient and actual address/contact details need business confirmation. Policies and property rules identify missing approved information instead of inventing it. Concept images reuse the supplied references; full-resolution property photography can replace them later.

The HTML UI blueprint is a development artifact served at `/design/missing-pages.html` by Vite, not a production content route. The source archive includes the board and design handoff. A production host needs SPA fallback to `index.html`.
