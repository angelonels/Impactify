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

    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers: finalHeaders,
            body: payload,
            credentials: 'include',
            signal,
        });
    } catch (netErr) {
        // Network failure (offline, CORS, DNS) — surface a friendly message.
        const err = new Error('Cannot reach the server. Check your connection and try again.');
        err.status = 0;
        err.networkError = true;
        throw err;
    }

    let json = null;
    const text = await res.text();
    const ctype = res.headers.get('content-type') || '';
    const looksJson = ctype.includes('application/json') ||
        (text.trim().startsWith('{') || text.trim().startsWith('['));

    if (text && looksJson) {
        try { json = JSON.parse(text); } catch { json = null; }
    }

    if (res.status === 401 && auth) {
        clearAuth();
    }

    if (!res.ok) {
        // Map common cases to user-friendly messages instead of raw HTML.
        const friendly = friendlyError(res.status, json);
        const err = new Error(friendly);
        err.status = res.status;
        err.body = json;
        throw err;
    }

    return json;
}

function friendlyError(status, json) {
    if (json && (json.error || json.message)) return json.error || json.message;
    switch (status) {
        case 401: return 'Please sign in to continue.';
        case 403: return 'You don\'t have access to this.';
        case 404: return 'That resource isn\'t available right now.';
        case 409: return 'Still preparing your dataset. Try again in a moment.';
        case 429: return 'Too many requests right now. Please slow down.';
        case 502:
        case 503:
        case 504: return 'The service is temporarily unavailable. Please try again shortly.';
        default:  return status >= 500
            ? 'Something went wrong on our side. Please try again.'
            : `Request failed (${status}).`;
    }
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
