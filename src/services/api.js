/**
 * API boundary for CraftConnect.
 *
 * Today the app keeps all data in the browser (see context/StoreContext.jsx + services/storage.js).
 * When the Node/Express + MongoDB backend is ready, implement each function below with `request()`
 * and have StoreContext call these instead of dispatching local reducer actions.
 *
 * Suggested REST contract (Express routers):
 *
 *   POST   /auth/register            { name, phone, password, role, ...artisanFields }
 *   POST   /auth/login               { phone, password }            -> { token, user }
 *   GET    /products?category=&q=&artisan=&min=&max=&sort=
 *   GET    /products/:id
 *   POST   /products                (artisan)  multipart: fields + images[] -> Cloudinary
 *   PUT    /products/:id            (owner)
 *   DELETE /products/:id            (owner/admin)
 *   GET    /artisans, GET /artisans/:id, PUT /artisans/:id
 *   POST   /requests                (buyer)    type: 'product' | 'custom', images[] -> Cloudinary
 *   GET    /requests?mine=1         (buyer/artisan)
 *   PATCH  /requests/:id            status change, reply, quote
 *   GET    /videos, POST /videos (admin), DELETE /videos/:id
 *   GET    /posts, POST /posts, POST /posts/:id/like, POST /posts/:id/comments, DELETE /posts/:id
 *   GET    /admin/users, PATCH /admin/users/:id (block), DELETE /admin/users/:id
 *
 * Mongo collections: users, artisans, products, requests, posts, videos.
 * Images: upload to Cloudinary from the server (signed upload) and store the secure_url in `photos`.
 */
export const API_URL = import.meta.env.VITE_API_URL || '';

export async function request(path, { method = 'GET', body, token, isForm = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_URL}${path}`, { method, headers, body: isForm ? body : body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export const isBackendEnabled = () => Boolean(API_URL);
