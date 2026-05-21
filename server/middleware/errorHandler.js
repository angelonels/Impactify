/**
 * Central Express error handler.
 * Honors `error.statusCode` set by services (502/503/etc.)
 * and returns a consistent JSON shape.
 */
module.exports = function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    const status = err.statusCode || err.status || 500;
    const payload = {
        error: err.message || "Internal server error",
    };

    if (process.env.NODE_ENV !== "production") {
        payload.stack = err.stack;
    }

    if (status >= 500) {
        console.error(`[${req.method} ${req.originalUrl}]`, err);
    } else {
        console.warn(`[${req.method} ${req.originalUrl}] ${status}: ${err.message}`);
    }

    res.status(status).json(payload);
};
