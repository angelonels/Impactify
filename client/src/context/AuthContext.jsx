import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, getUser, setAuth, clearAuth } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUser());
    const [token, setToken] = useState(getToken());
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const t = getToken();
        if (!t) {
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        }
        try {
            const data = await api.get('/api/auth/me');
            setUser(data.user);
            setToken(t);
            setAuth(t, data.user);
        } catch {
            clearAuth();
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    useEffect(() => {
        const onChange = () => {
            setUser(getUser());
            setToken(getToken());
        };
        window.addEventListener('auth-change', onChange);
        window.addEventListener('storage', onChange);
        return () => {
            window.removeEventListener('auth-change', onChange);
            window.removeEventListener('storage', onChange);
        };
    }, []);

    const login = (t, u) => { setAuth(t, u); setUser(u); setToken(t); };
    const logout = () => { clearAuth(); setUser(null); setToken(null); };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};
