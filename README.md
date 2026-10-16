# The Mud House

Hotel website and administration panel built with React, TypeScript, Vite, and a Node.js API. Includes room and travel package pages, dining and food menus, a gallery, content and image management, and a guest enquiry inbox.

## Run locally

Use Node.js 22.12 or later, or Node.js 20.19 or later in the 20.x release line.

```sh
cd website
npm ci
npm run dev
```

- Website: http://127.0.0.1:5173/
- Admin: http://127.0.0.1:5173/admin

A fresh installation generates administrator credentials in the private `website/.data/initial-admin.txt` file. Local passwords, saved enquiries, uploaded media, and the live content datastore are excluded from this repository. A new installation starts with the included public seed content and assets.

## Validate

```sh
cd website
npm run build
npm run test:server
```

The booking forms currently collect enquiries. Live room inventory, payments, and eZee synchronisation are not yet connected.

See the [application README](website/README.md), [admin guide](website/app/admin/ADMIN-GUIDE.md), and [server guide](website/server/README.md) for features, API details, persistent storage, and deployment instructions.
