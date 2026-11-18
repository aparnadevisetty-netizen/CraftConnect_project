# CraftConnect — Connecting Crafts, Creating Futures.

Marketplace, learning hub and community for the Durgi stone-carving artisans of Palnadu, Andhra Pradesh.
React 18 · Vite · Tailwind CSS · React Router 6 · Lucide icons. English and Telugu.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Demo logins (mobile number / password)

| Role    | Number     | Password  |
|---------|------------|-----------|
| Artisan | 9000000001 | craft123  |
| Buyer   | 9000000011 | buyer123  |
| Admin   | 9000000099 | admin123  |

The login page also has one-tap demo buttons. All data is kept in the browser (localStorage). Admin > Overview > "Reset demo data" restores the samples.

## Structure

```
src/
  components/    Reusable UI: Navbar, cards, modals, forms, uploader, request thread
  context/       StoreContext (data), AuthContext (roles), ToastContext (confirmations)
  data/          Sample artisans, products, lessons, posts, users, requests
  i18n/          translations.js (EN + TE) and LanguageContext
  pages/         One file per page; pages/dashboards/ for the three dashboards
  services/      storage.js (localStorage) and api.js (backend contract)
  utils/         Formatting, validation, in-browser image compression
```

## Real photographs

Stone illustrations (`components/StoneArt.jsx`) stand in until photos exist. To use photographs:
put files in `public/images/products/` and set `photos: ['/images/products/lakshmi-1.jpg']` on the product in `src/data/products.js`
(or Cloudinary URLs later). Photos are shown first and the illustration is the fallback. Artisan portraits: set `photo` on the artisan.

## Learning videos

The sample lessons use generic demo clips. Replace `src` in `src/data/learning.js` with your own tutorial links, or add lessons from Admin > Lessons.

## Moving to Node + Express + MongoDB + Cloudinary

1. `src/services/api.js` lists the REST endpoints and Mongo collections the UI expects.
2. Replace the reducer actions in `StoreContext.jsx` with calls to those endpoints (set `VITE_API_URL`).
3. Replace `AuthContext.jsx` with `/auth/login` and `/auth/register` (hashed passwords + JWT). The prototype stores passwords in plain text in the browser, so do not use it for real accounts.
4. Upload images to Cloudinary from the server and store the returned URLs in `photos`.

## Low-bandwidth choices

Route-level code splitting, lazy images, SVG artwork instead of heavy images, in-browser photo compression before upload, `preload="metadata"` on videos, system-font fallbacks.
