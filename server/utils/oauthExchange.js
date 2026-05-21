const crypto = require("crypto");

const TTL_MS = 60 * 1000;
const store = new Map();

function purgeExpired() {
    const now = Date.now();
    for (const [code, entry] of store.entries()) {
        if (entry.expiresAt <= now) store.delete(code);
    }
}

exports.issueCode = (token) => {
    purgeExpired();
    const code = crypto.randomBytes(24).toString("base64url");
    store.set(code, { token, expiresAt: Date.now() + TTL_MS });
    return code;
};

exports.consumeCode = (code) => {
    purgeExpired();
    const entry = store.get(code);
    if (!entry) return null;
    store.delete(code); // single-use
    if (entry.expiresAt <= Date.now()) return null;
    return entry.token;
};
