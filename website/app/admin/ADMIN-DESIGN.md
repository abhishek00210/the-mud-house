# The Mud House · Management workspace

**Visual thesis:** a quiet, practical hotel workspace with a deep wine navigation rail, warm paper surfaces, generous readable tables, and restrained gold accents.

**Content plan:** credential entry → overview and enquiry queue → section-specific editing workspaces → persistent save and clear publication feedback. The overview prioritises new enquiries and currently open booking channels; the working areas use lists and a focused editor instead of dashboard mosaics.

**Interaction thesis:** a short workspace entrance establishes context, crisp row/selection transitions signal focus, and the mobile navigation drawer slides in with an accessible dismiss control. Motion respects reduced-motion preferences.

## Layout

- Desktop: 244px navigation rail; top utility bar with preview, account and save state; content area with an editorial section title and compact action row.
- Editors: searchable list on the left, a clearly labelled form on the right. Image fields include a visual preview and library chooser. Repeatable records use add, select and remove controls with confirmation.
- Mobile: top brand bar and menu button; single-column workspace. Lists remain readable, forms use full-width inputs, sticky save action retains a safe bottom inset.
- Palette: wine `#581b15`, cream `#f8f5f0`, paper `#fffdf9`, sand `#eae3d9`, ink `#302b27`, muted `#777068`, gold `#ba9251`. Georgia headings and the existing Arial body font.
- Controls: minimum 42px targets, explicit labels, visible focus rings, 4px corners, subtle separators; no ornamental gradients.

## Workspaces

1. **Overview:** new and active enquiries, publication revision, content totals, booking channel state, recent enquiries and quick editing links.
2. **Bookings & enquiries:** search/filter inbox, full request details, status, internal notes and manually entered records. Confirmation is an explicit operator action.
3. **Page content:** source/page grouping, searchable text fields, current/default content context, individual reset and publication.
4. **Images & media:** upload, caption/alt metadata, library, usage-aware deletion, and image-slot replacement.
5. **Rooms:** existing room descriptions, capacity, bed configuration, amenities and visibility.
6. **Travel packages:** create/edit/archive packages, image, category, concept, itinerary and availability.
7. **Food menu:** category and dish editing, descriptions and visibility.
8. **FAQs:** category, question, answer and linked guidance.
9. **Gallery:** ordered image entries, category, caption and accessibility text.
10. **Settings:** brand/contact, colours, booking channel toggles, password and authenticated backup.

## Integrity and feedback

Unsaved changes are labelled and protected before leaving the workspace. Saving publishes the editable document atomically using its revision. A conflict preserves the local draft and asks the operator to reload after reviewing or exporting it. Network failures remain visible. Empty states describe the next useful action; saved, uploaded and status-changed messages use live announcements.

The login form uses standard username/password fields and browser password-manager semantics. Sessions are server managed; passwords are never stored in local browser storage. Security settings require the current password.
