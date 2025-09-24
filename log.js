const express = require('express');
const router = express.Router();
const dbHandler = require('./dbHandler');
const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');


// Tevékenységek naplózása. Biztosítja a teljes nyomon követhetőséget a rendszerben.
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

// Naplók lekérése
router.get('/logs', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
  try {
    const logs = await dbHandler.logTable.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a naplók lekérésekor.', error: error.message });
  }
});

module.exports = { logAction, router };