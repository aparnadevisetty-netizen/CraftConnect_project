import { seedUsers, seedPosts, seedRequests } from '../data/community.js';
import { seedArtisans } from '../data/artisans.js';
import { seedProducts } from '../data/products.js';
import { seedVideos } from '../data/learning.js';

const KEY = 'craftconnect:v5'; // bumped — reloads seed with all 20 photos wired in
const SESSION_KEY = 'craftconnect:session';

export const seedState = () => ({
  version: 1,
  users: seedUsers,
  artisans: seedArtisans,
  products: seedProducts,
  requests: seedRequests,
  posts: seedPosts,
  videos: seedVideos,
  watched: {},
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return parsed;
    }
  } catch {
    /* ignore corrupted storage and fall back to the seed */
  }
  return seedState();
}

/** Returns false if the browser refused the write (private mode or storage full). */
export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export const loadSession = () => {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
};
export const saveSession = (id) => {
  try { id ? localStorage.setItem(SESSION_KEY, id) : localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
};
export const clearAll = () => {
  try { localStorage.removeItem(KEY); localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
};
