/**
 * supabaseDb.js — All database operations for CraftConnect.
 * Each function returns { data, error } consistent with the Supabase JS client.
 */
import { supabase } from './supabase.js';

// ─────────────────────────────────────────────
// AUTH / USERS
// ─────────────────────────────────────────────

/** Look up a user by phone for login */
export async function getUserByPhone(phone) {
  return supabase.from('users').select('*').eq('phone', phone).single();
}

/** Get a user by ID */
export async function getUserById(id) {
  return supabase.from('users').select('*').eq('id', id).single();
}

/** Get ALL users (for store hydration) */
export async function getAllUsers() {
  return supabase.from('users').select('*').order('created_at');
}

/** Register a new user */
export async function createUser(user) {
  return supabase.from('users').insert(user).select().single();
}

/** Update a user record */
export async function updateUser(id, changes) {
  return supabase.from('users').update(changes).eq('id', id).select().single();
}

/** Block / unblock a user (admin) */
export async function setUserBlocked(id, blocked) {
  return supabase.from('users').update({ blocked }).eq('id', id);
}

/** Delete a user (admin) */
export async function deleteUser(id) {
  return supabase.from('users').delete().eq('id', id);
}

// ─────────────────────────────────────────────
// ARTISANS
// ─────────────────────────────────────────────

export async function getAllArtisans() {
  return supabase.from('artisans').select('*').order('featured', { ascending: false });
}

export async function upsertArtisan(artisan) {
  return supabase.from('artisans').upsert(artisan, { onConflict: 'id' }).select().single();
}

// ─────────────────────────────────────────────
// TRANSACTIONS (requests / orders)
// ─────────────────────────────────────────────

export async function getAllTransactions() {
  return supabase.from('transactions').select('*').order('created_at', { ascending: false });
}

export async function getTransactionsByBuyer(buyerId) {
  return supabase.from('transactions').select('*').eq('buyer_id', buyerId).order('created_at', { ascending: false });
}

export async function getTransactionsByArtisan(artisanId) {
  return supabase.from('transactions').select('*').eq('artisan_id', artisanId).order('created_at', { ascending: false });
}

export async function createTransaction(tx) {
  return supabase.from('transactions').insert(tx).select().single();
}

export async function updateTransaction(id, changes) {
  return supabase.from('transactions').update(changes).eq('id', id).select().single();
}

// ─────────────────────────────────────────────
// COMMUNITY POSTS
// ─────────────────────────────────────────────

export async function getAllPosts() {
  return supabase.from('posts').select('*').order('created_at', { ascending: false });
}

export async function createPost(post) {
  return supabase.from('posts').insert(post).select().single();
}

export async function deletePost(id) {
  return supabase.from('posts').delete().eq('id', id);
}

export async function togglePostLike(postId, userId, currentLikes) {
  const likes = currentLikes.includes(userId)
    ? currentLikes.filter((u) => u !== userId)
    : [...currentLikes, userId];
  return supabase.from('posts').update({ likes }).eq('id', postId).select().single();
}

// ─────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────

export async function getCommentsByPost(postId) {
  return supabase.from('comments').select('*').eq('post_id', postId).order('created_at');
}

export async function createComment(comment) {
  return supabase.from('comments').insert(comment).select().single();
}

export async function deleteComment(id) {
  return supabase.from('comments').delete().eq('id', id);
}
