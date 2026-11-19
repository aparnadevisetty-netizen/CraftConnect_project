import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { loadState, saveState, seedState, clearAll } from '../services/storage.js';
import { uid } from '../utils/format.js';
import {
  getAllUsers, getAllArtisans, getAllPosts, getAllTransactions,
  createUser, updateUser as dbUpdateUser, deleteUser as dbDeleteUser,
  upsertArtisan as dbUpsertArtisan,
  createTransaction, updateTransaction as dbUpdateTransaction,
  createPost, deletePost as dbDeletePost, togglePostLike,
  createComment, deleteComment as dbDeleteComment,
} from '../services/supabaseDb.js';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const patch = (list, id, changes) =>
  list.map((x) => (x.id === id ? { ...x, ...(typeof changes === 'function' ? changes(x) : changes) } : x));

function reducer(state, a) {
  switch (a.type) {
    case 'hydrate': return { ...state, ...a.payload, hydrated: true };
    // users
    case 'user/add':    return { ...state, users: [...state.users, a.user] };
    case 'user/update': return { ...state, users: patch(state.users, a.id, a.changes) };
    case 'user/remove':
      return {
        ...state,
        users: state.users.filter((u) => u.id !== a.id),
        artisans: state.artisans.filter((x) => x.id !== a.id),
        products: state.products.filter((p) => p.artisanId !== a.id),
        posts: state.posts.filter((p) => p.authorId !== a.id),
      };
    // artisans
    case 'artisan/upsert': {
      const exists = state.artisans.some((x) => x.id === a.artisan.id);
      return { ...state, artisans: exists ? patch(state.artisans, a.artisan.id, a.artisan) : [...state.artisans, a.artisan] };
    }
    // products (still localStorage)
    case 'product/add':    return { ...state, products: [a.product, ...state.products] };
    case 'product/update': return { ...state, products: patch(state.products, a.id, a.changes) };
    case 'product/remove': return { ...state, products: state.products.filter((p) => p.id !== a.id) };
    // requests → transactions
    case 'request/add':    return { ...state, requests: [a.request, ...state.requests] };
    case 'request/update': return { ...state, requests: patch(state.requests, a.id, a.changes) };
    // posts
    case 'post/add':    return { ...state, posts: [a.post, ...state.posts] };
    case 'post/remove': return { ...state, posts: state.posts.filter((p) => p.id !== a.id) };
    case 'post/update': return { ...state, posts: patch(state.posts, a.id, a.changes) };
    case 'post/like':
      return {
        ...state,
        posts: patch(state.posts, a.id, (p) => ({
          likes: p.likes.includes(a.userId)
            ? p.likes.filter((u) => u !== a.userId)
            : [...p.likes, a.userId],
        })),
      };
    case 'comment/add':
      return { ...state, posts: patch(state.posts, a.postId, (p) => ({ comments: [...(p.comments || []), a.comment] })) };
    case 'comment/remove':
      return { ...state, posts: patch(state.posts, a.postId, (p) => ({ comments: (p.comments || []).filter((c) => c.id !== a.commentId) })) };
    // videos (localStorage)
    case 'video/add':     return { ...state, videos: [a.video, ...state.videos] };
    case 'video/remove':  return { ...state, videos: state.videos.filter((v) => v.id !== a.id) };
    case 'video/watched':
      return { ...state, watched: { ...state.watched, [a.userKey]: Array.from(new Set([...(state.watched[a.userKey] || []), a.id])) } };
    case 'reset': return { ...seedState(), hydrated: false };
    default: return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ ...loadState(), hydrated: false }));
  const saveFailed = useRef(false);

  // ── Hydrate from Supabase on mount ─────────────────────────────────────
  useEffect(() => {
    async function hydrate() {
      const [usersRes, artisansRes, postsRes, txRes] = await Promise.all([
        getAllUsers(),
        getAllArtisans(),
        getAllPosts(),
        getAllTransactions(),
      ]);

      // Map Supabase column names → app field names for posts
      const posts = (postsRes.data || []).map((p) => ({
        ...p,
        authorId: p.author_id ?? p.authorId,
        createdAt: p.created_at ?? p.createdAt,
        likes: p.likes || [],
        comments: [], // comments loaded separately per-post
      }));

      // Map transactions → requests shape the app expects
      const requests = (txRes.data || []).map((t) => ({
        id: t.id,
        type: t.type,
        buyerId: t.buyer_id,
        buyerName: t.buyer_name,
        buyerPhone: t.buyer_phone,
        artisanId: t.artisan_id,
        productId: t.product_id,
        title: t.title,
        quantity: t.quantity,
        message: t.message,
        details: t.details || {},
        images: t.images || [],
        status: t.status,
        amount: t.amount,
        replies: t.replies || [],
        createdAt: t.created_at,
      }));

      // Merge Supabase artisans with seed artisans so seed products always
      // have a matching artisan (Supabase may be empty or use different IDs).
      // Also normalise remote artisans so array fields are never null/undefined.
      const remoteArtisans = (artisansRes.data || []).map((a) => ({
        specialties: [],
        languages: [],
        experience: 0,
        bio: '',
        tone: 'slate',
        photos: [],
        ...a,
        specialties: Array.isArray(a.specialties) ? a.specialties : [],
        languages: Array.isArray(a.languages) ? a.languages : [],
      }));
      const remoteArtisanIds = new Set(remoteArtisans.map((a) => a.id));
      const mergedArtisans = [
        ...remoteArtisans,
        ...state.artisans.filter((a) => !remoteArtisanIds.has(a.id)),
      ];

      dispatch({
        type: 'hydrate',
        payload: {
          users: usersRes.data || state.users,
          artisans: mergedArtisans.length ? mergedArtisans : state.artisans,
          posts,
          requests,
        },
      });
    }
    hydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist non-Supabase state to localStorage ─────────────────────────
  useEffect(() => {
    saveFailed.current = !saveState(state);
  }, [state]);

  // ── Actions ────────────────────────────────────────────────────────────
  const actions = useMemo(() => ({
    // Users
    addUser: async (user) => {
      dispatch({ type: 'user/add', user });
      await createUser(user);
    },
    updateUser: async (id, changes) => {
      dispatch({ type: 'user/update', id, changes });
      await dbUpdateUser(id, changes);
    },
    removeUser: async (id) => {
      dispatch({ type: 'user/remove', id });
      await dbDeleteUser(id);
    },

    // Artisans
    upsertArtisan: async (artisan) => {
      dispatch({ type: 'artisan/upsert', artisan });
      await dbUpsertArtisan(artisan);
    },

    // Products (localStorage only for now)
    addProduct: (data) => {
      const product = { id: uid('p'), createdAt: new Date().toISOString(), featured: false, photos: [], ...data };
      dispatch({ type: 'product/add', product });
      return product;
    },
    updateProduct: (id, changes) => dispatch({ type: 'product/update', id, changes }),
    removeProduct: (id) => dispatch({ type: 'product/remove', id }),

    // Requests / Transactions
    addRequest: async (data) => {
      const request = { id: uid('r'), status: 'new', replies: [], images: [], details: {}, createdAt: new Date().toISOString(), ...data };
      dispatch({ type: 'request/add', request });
      // Write to Supabase transactions table
      await createTransaction({
        id: request.id,
        type: request.type,
        buyer_id: request.buyerId,
        buyer_name: request.buyerName,
        buyer_phone: request.buyerPhone,
        artisan_id: request.artisanId || null,
        product_id: request.productId || null,
        title: request.title,
        quantity: request.quantity || 1,
        message: request.message || '',
        details: request.details || {},
        images: request.images || [],
        status: request.status,
        replies: request.replies || [],
      });
      return request;
    },
    updateRequest: async (id, changes) => {
      dispatch({ type: 'request/update', id, changes });
      // Map app field names → Supabase column names
      const dbChanges = {};
      if (changes.status !== undefined)  dbChanges.status  = changes.status;
      if (changes.replies !== undefined) dbChanges.replies = changes.replies;
      if (changes.amount !== undefined)  dbChanges.amount  = changes.amount;
      if (Object.keys(dbChanges).length) await dbUpdateTransaction(id, dbChanges);
    },

    // Posts
    addPost: async (data) => {
      const post = {
        id: uid('c'), createdAt: new Date().toISOString(),
        likes: [], comments: [], art: null, image: null, ...data,
      };
      dispatch({ type: 'post/add', post });
      await createPost({
        id: post.id,
        author_id: post.authorId,
        tag: post.tag,
        text: post.text,
        text_te: post.text_te || null,
        image: post.image || null,
        likes: post.likes,
      });
      return post;
    },
    removePost: async (id) => {
      dispatch({ type: 'post/remove', id });
      await dbDeletePost(id);
    },
    toggleLike: async (id, userId) => {
      // Optimistic update
      dispatch({ type: 'post/like', id, userId });
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        const newLikes = post.likes.includes(userId)
          ? post.likes.filter((u) => u !== userId)
          : [...post.likes, userId];
        await togglePostLike(id, userId, post.likes);
        dispatch({ type: 'post/update', id, changes: { likes: newLikes } });
      }
    },

    // Comments
    addComment: async (postId, comment) => {
      const full = { id: uid('cc'), createdAt: new Date().toISOString(), ...comment };
      dispatch({ type: 'comment/add', postId, comment: full });
      await createComment({
        id: full.id,
        post_id: postId,
        author_id: full.authorId,
        text: full.text,
        text_te: full.text_te || null,
      });
    },
    removeComment: async (postId, commentId) => {
      dispatch({ type: 'comment/remove', postId, commentId });
      await dbDeleteComment(commentId);
    },

    // Videos (localStorage only)
    addVideo: (data) => {
      const video = { id: uid('v'), art: { kind: 'mandala' }, tone: 'sage', steps: [], steps_te: [], ...data };
      dispatch({ type: 'video/add', video });
      return video;
    },
    removeVideo: (id) => dispatch({ type: 'video/remove', id }),
    markWatched: (userKey, id) => dispatch({ type: 'video/watched', userKey, id }),

    resetDemo: () => { clearAll(); dispatch({ type: 'reset' }); },
  }), [state.posts]);

  const getters = useMemo(() => ({
    getProduct: (id) => state.products.find((p) => p.id === id),
    getArtisan: (id) => state.artisans.find((a) => a.id === id),
    getUser:    (id) => state.users.find((u) => u.id === id),
  }), [state]);

  const value = useMemo(() => ({ ...state, ...actions, ...getters }), [state, actions, getters]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
