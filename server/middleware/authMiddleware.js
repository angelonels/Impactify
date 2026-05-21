const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const AUTH_DISABLED = process.env.AUTH_REQUIRED === 'false';

let cachedDefaultUserId = null;
async function getOrCreateDefaultUser() {
    if (cachedDefaultUserId) return cachedDefaultUserId;
    let user = await prisma.user.findFirst({ where: { role: 'GUEST' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: `default_${Date.now()}@impactify.local`,
                name: 'Default User',
                role: 'GUEST',
                authProvider: 'EMAIL',
            },
        });
    }
    cachedDefaultUserId = user.id;
    return user.id;
}

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            if (!AUTH_DISABLED) {
                return res.status(401).json({ message: "Token is not valid" });
            }
            // fall through to default-user hydration
        }
    } else if (!AUTH_DISABLED) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const id = await getOrCreateDefaultUser();
        req.user = { id, role: 'GUEST' };
        next();
    } catch (e) {
        next(e);
    }
};

module.exports = authMiddleware;
