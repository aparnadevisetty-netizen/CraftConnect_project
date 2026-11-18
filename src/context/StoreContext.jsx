import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { loadState, saveState, seedState, clearAll } from '../services/storage.js';
import { uid } from '../utils/format.js';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const patch = (list, id, changes) => list.map((x) => (x.id === id ? { ...x, ...(typeof changes === 'function' ? changes(x) : changes) } : x));

function reducer(state, a) {
  switch (a.type) {
    case 'user/add': return { ...state, users: [...state.users, a.user] };
    case 'user/update': return { ...state, users: patch(state.users, a.id, a.changes) };
    case 'user/remove':
      return {
        ...state,
        users: state.users.filter((u) => u.id !== a.id),
        artisans: state.artisans.filter((x) => x.id !== a.id),
        products: state.products.filter((p) => p.artisanId !== a.id),
        posts: state.posts.filter((p) => p.authorId !== a.id),
      };
    case 'artisan/upsert': {
      const exists = state.artisans.some((x) => x.id === a.artisan.id);
      return { ...state, artisans: exists ? patch(state.artisans, a.artisan.id, a.artisan) : [...state.artisans, a.artisan] };
    }
    case 'product/add': return { ...state, products: [a.product, ...state.products] };
    case 'product/update': return { ...state, products: patch(state.products, a.id, a.changes) };
    case 'product/remove': return { ...state, products: state.products.filter((p) => p.id !== a.id) };
    case 'request/add': return { ...state, requests: [a.request, ...state.requests] };
    case 'request/update': return { ...state, requests: patch(state.requests, a.id, a.changes) };
    case 'post/add': return { ...state, posts: [a.post, ...state.posts] };
    case 'post/remove': return { ...state, posts: state.posts.filter((p) => p.id !== a.id) };
    case 'post/like':
      return {
        ...state,
        posts: patch(state.posts, a.id, (p) => ({ likes: p.likes.includes(a.userId) ? p.likes.filter((u) => u !== a.userId) : [...p.likes, a.userId] })),
      };
    case 'comment/add': return { ...state, posts: patch(state.posts, a.id, (p) => ({ comments: [...p.comments, a.comment] })) };
    case 'comment/remove': return { ...state, posts: patch(state.posts, a.id, (p) => ({ comments: p.comments.filter((c) => c.id !== a.commentId) })) };
    case 'video/add': return { ...state, videos: [a.video, ...state.videos] };
    case 'video/remove': return { ...state, videos: state.videos.filter((v) => v.id !== a.id) };
    case 'video/watched':
      return { ...state, watched: { ...state.watched, [a.userKey]: Array.from(new Set([...(state.watched[a.userKey] || []), a.id])) } };
    case 'reset': return seedState();
    default: return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const saveFailed = useRef(false);

  useEffect(() => {
    saveFailed.current = !saveState(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      addUser: (user) => dispatch({ type: 'user/add', user }),
      updateUser: (id, changes) => dispatch({ type: 'user/update', id, changes }),
      removeUser: (id) => dispatch({ type: 'user/remove', id }),
      upsertArtisan: (artisan) => dispatch({ type: 'artisan/upsert', artisan }),
      addProduct: (data) => { const product = { id: uid('p'), createdAt: new Date().toISOString(), featured: false, photos: [], ...data }; dispatch({ type: 'product/add', product }); return product; },
      updateProduct: (id, changes) => dispatch({ type: 'product/update', id, changes }),
      removeProduct: (id) => dispatch({ type: 'product/remove', id }),
      addRequest: (data) => { const request = { id: uid('r'), status: 'new', replies: [], images: [], details: {}, createdAt: new Date().toISOString(), ...data }; dispatch({ type: 'request/add', request }); return request; },
      updateRequest: (id, changes) => dispatch({ type: 'request/update', id, changes }),
      addPost: (data) => { const post = { id: uid('c'), createdAt: new Date().toISOString(), likes: [], comments: [], art: null, image: null, ...data }; dispatch({ type: 'post/add', post }); return post; },
      removePost: (id) => dispatch({ type: 'post/remove', id }),
      toggleLike: (id, userId) => dispatch({ type: 'post/like', id, userId }),
      addComment: (id, comment) => dispatch({ type: 'comment/add', id, comment: { id: uid('cc'), createdAt: new Date().toISOString(), ...comment } }),
      removeComment: (id, commentId) => dispatch({ type: 'comment/remove', id, commentId }),
      addVideo: (data) => { const video = { id: uid('v'), art: { kind: 'mandala' }, tone: 'sage', steps: [], steps_te: [], ...data }; dispatch({ type: 'video/add', video }); return video; },
      removeVideo: (id) => dispatch({ type: 'video/remove', id }),
      markWatched: (userKey, id) => dispatch({ type: 'video/watched', userKey, id }),
      resetDemo: () => { clearAll(); dispatch({ type: 'reset' }); },
    }),
    []
  );

  const getters = useMemo(
    () => ({
      getProduct: (id) => state.products.find((p) => p.id === id),
      getArtisan: (id) => state.artisans.find((a) => a.id === id),
      getUser: (id) => state.users.find((u) => u.id === id),
    }),
    [state]
  );

  const value = useMemo(() => ({ ...state, ...actions, ...getters }), [state, actions, getters]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
