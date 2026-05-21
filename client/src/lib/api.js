// Centralized API client. Automatically attaches the bearer token,
// handles 401 by clearing local auth, and unwraps JSON errors.

const RAW = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = RAW.replace(/\/$/, '');

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const setAuth = (token, user) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
};

export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('auth-change'));
};

async function request(path, { method = 'GET', body, headers = {}, auth = true, signal } = {}) {
    const finalHeaders = { ...headers };
    let payload = body;

    if (body && !(body instanceof FormData)) {
        finalHeaders['Content-Type'] = 'application/json';
        payload = JSON.stringify(body);
    }

    if (auth) {
        const token = getToken();
        if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: payload,
        credentials: 'include',
        signal,
    });

    let json = null;
    const text = await res.text();
    if (text) {
        try { json = JSON.parse(text); } catch { json = { error: text }; }
    }

    if (res.status === 401 && auth) {
        clearAuth();
    }

    if (!res.ok) {
        const err = new Error((json && (json.error || json.message)) || `HTTP ${res.status}`);
        err.status = res.status;
        err.body = json;
        throw err;
    }

    return json;
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
