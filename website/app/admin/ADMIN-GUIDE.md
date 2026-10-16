# The Mud House · Admin guide

Open `/admin` on the website and sign in with the administrator ID and password from the private `.data/initial-admin.txt` file. The file is created on the CMS server's first start. It is removed automatically after the password is changed. Do not place this file in the public website or share it with guests.

## Edit and publish

Choose a section from the left navigation. Room, package, food-menu, FAQ and gallery records have dedicated editors. **Page content** lets you search other headings and copy, filter by page, and restore individual fields to their original wording. Edits remain in the current workspace until you choose **Publish changes**. **Discard** restores the last published state. The browser warns before leaving with unpublished changes.

If another administrator publishes first, your save is stopped so it cannot overwrite their work. Download your draft if needed, load the latest version and reapply the changes you want to keep.

## Photographs

In **Images & media**, upload JPEG, PNG, WebP or GIF photographs up to 8 MB each. Add a helpful image description for screen readers and an optional caption. Uploading and editing media metadata saves immediately, so publish or discard other pending changes first.

Use **Website placements** to replace a photograph wherever an existing placement is used. Rooms, packages, dishes, gallery entries and the logo also have **Choose image** controls. **Restore original** returns a placement to the supplied concept image. Add and order gallery entries in **Gallery**, then publish. Images still used by the website cannot be deleted from the library.

## Rooms and experiences

**Rooms & availability** controls the four room categories, including names, descriptions, facilities, rates, guest capacity and request availability. **Travel packages** lets you add, arrange, hide or remove packages and edit their descriptions, itinerary steps, inclusions, exclusions, duration and price. A package's page address is its public URL; keep an established address unchanged when possible.

A blank rate or price means a quote is requested. Date blocks include both the start and end day. A room stay that checks out on the first blocked day is permitted because checkout is exclusive. Global booking switches in **Settings** must also be open for a room or experience to accept requests. Hiding a record removes it from the public collection while preserving its details in the workspace.

## Guest requests

**Bookings & enquiries** receives requests submitted on the website. Search by guest, contact or reference and filter by type or status. Open an enquiry to review its details, change the status or save internal notes. **Add enquiry** records a request received by phone, email or another channel. Enter details with the guest's agreement.

Changing an enquiry's status saves immediately. It does not send an email, charge a payment or reserve inventory in an external booking system. Mark a request **Confirmed** only after agreeing the arrangements with the guest.

## Settings and account

**Settings** controls property branding, verified contact details, logo, colours, currency and whether stay, dining and experience requests are open. Publish website-setting changes with the main save button. General contact enquiries remain available while booking channels are closed.

To change the administrator ID or password, enter the current password and a new password of at least 12 characters under **Administrator account**. Changing credentials saves immediately and invalidates other active sessions. Store the new credentials in a password manager.

## Backups

**Download backup** exports the published website document and guest enquiries as JSON. It contains private guest contact details, so store it securely. The export includes image metadata and references, but not the actual image files. Back up the server's private `.data` directory, including `uploads`, for complete recovery. See `server/README.md` for deployment and recovery notes. No upload/restore operation is exposed in the interface.
