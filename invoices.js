const express = require('express');
const router = express.Router();
const dbHandler = require('./dbHandler');

const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');

router.get('/invoices', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'sales') {
            where.user = req.user.id;  // sales csak saját számlái
        }
        const invoices = await dbHandler.invoiceTable.findAll({
            where,
            order: [['issueDate', 'DESC']]
        });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }
});

module.exports = router;
