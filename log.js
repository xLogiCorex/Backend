const dbHandler = require('./dbHandler');

async function logAction({ userId, action, targetType, targetId, payload, req }) {
    await dbHandler.logTable.create({
        userId,
        action,
        targetType,
        targetId,
        payload: {
            ...payload,
            createdAt: new Date(),
            ip: req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip,
            userAgent: req.headers['user-agent']
        }
    });
}

module.exports = { logAction };