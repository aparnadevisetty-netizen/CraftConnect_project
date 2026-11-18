import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadSession, saveSession } from '../services/storage.js';
import { cleanPhone, uid } from '../utils/format.js';
import { getUserByPhone, getUserById, createUser, updateUser, upsertArtisan } from '../services/supabaseDb.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    const sessionId = loadSession();
    if (!sessionId) { setLoading(false); return; }
    getUserById(sessionId).then(({ data, error }) => {
      if (!error && data && !data.blocked) setUser(data);
      else saveSession(null); // clear stale session
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (phone, password) => {
    const { data, error } = await getUserByPhone(cleanPhone(phone));
    if (error || !data) return { ok: false, error: 'noAccount' };
    if (data.blocked) return { ok: false, error: 'blocked' };
    if (data.password !== password) return { ok: false, error: 'wrongPassword' };
    setUser(data);
    saveSession(data.id);
    return { ok: true, user: data };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  const register = useCallback(async ({ name, phone, password, role, village, experience, specialties, city }) => {
    const p = cleanPhone(phone);
    // Check if phone already taken
    const { data: existing } = await getUserByPhone(p);
    if (existing) return { ok: false, error: 'phoneTaken' };

    const id = role === 'artisan' ? uid('a') : uid('b');
    const newUser = {
      id, name: name.trim(), name_te: '', phone: p, password, role,
      blocked: false, created_at: new Date().toISOString(),
      ...(role === 'buyer' ? { city: city || '' } : {}),
    };
    const { data, error } = await createUser(newUser);
    if (error) return { ok: false, error: 'serverError' };

    if (role === 'artisan') {
      await upsertArtisan({
        id, name: name.trim(), name_te: '', village: village || 'Durgi',
        experience: Number(experience) || 0,
        specialties: specialties?.length ? specialties : ['decor'],
        languages: ['Telugu'], bio: '', bio_te: '',
        tone: 'sage', featured: false, joined: new Date().toISOString(),
      });
    }
    setUser(data);
    saveSession(data.id);
    return { ok: true, user: data };
  }, []);

  const updateProfile = useCallback(async (changes) => {
    if (!user) return;
    const { data } = await updateUser(user.id, changes);
    if (data) setUser(data);
  }, [user]);

  const value = useMemo(() => ({
    user,
    role: user?.role || 'guest',
    loading,
    login,
    logout,
    register,
    updateProfile,
  }), [user, loading, login, logout, register, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const homeFor = (role) => ({ artisan: '/artisan', buyer: '/buyer', admin: '/admin' }[role] || '/');
