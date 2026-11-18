import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useStore } from './StoreContext.jsx';
import { loadSession, saveSession } from '../services/storage.js';
import { cleanPhone, uid } from '../utils/format.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/**
 * Prototype auth: accounts live in the browser, so passwords are stored in plain text here.
 * Replace with the Express /auth endpoints (hashed passwords + JWT) before going live.
 */
export function AuthProvider({ children }) {
  const store = useStore();
  const [sessionId, setSessionId] = useState(loadSession);
  const user = store.users.find((u) => u.id === sessionId && !u.blocked) || null;

  const login = useCallback(
    (phone, password) => {
      const found = store.users.find((u) => u.phone === cleanPhone(phone));
      if (!found) return { ok: false, error: 'noAccount' };
      if (found.blocked) return { ok: false, error: 'blocked' };
      if (found.password !== password) return { ok: false, error: 'wrongPassword' };
      setSessionId(found.id);
      saveSession(found.id);
      return { ok: true, user: found };
    },
    [store.users]
  );

  const logout = useCallback(() => {
    setSessionId(null);
    saveSession(null);
  }, []);

  const register = useCallback(
    ({ name, phone, password, role, village, experience, specialties, city }) => {
      const p = cleanPhone(phone);
      if (store.users.some((u) => u.phone === p)) return { ok: false, error: 'phoneTaken' };
      const id = role === 'artisan' ? uid('a') : uid('b');
      const newUser = { id, name: name.trim(), phone: p, password, role, blocked: false, createdAt: new Date().toISOString(), ...(role === 'buyer' ? { city: city || '' } : {}) };
      store.addUser(newUser);
      if (role === 'artisan') {
        store.upsertArtisan({
          id, name: name.trim(), name_te: '', village: village || 'Durgi', experience: Number(experience) || 0,
          specialties: specialties?.length ? specialties : ['decor'], phone: p, languages: ['Telugu'],
          bio: '', bio_te: '', tone: 'sage', featured: false, joined: new Date().toISOString(),
        });
      }
      setSessionId(id);
      saveSession(id);
      return { ok: true, user: newUser };
    },
    [store]
  );

  const updateProfile = useCallback((changes) => { if (user) store.updateUser(user.id, changes); }, [store, user]);

  const value = useMemo(() => ({ user, role: user?.role || 'guest', login, logout, register, updateProfile }), [user, login, logout, register, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const homeFor = (role) => ({ artisan: '/artisan', buyer: '/buyer', admin: '/admin' }[role] || '/');
