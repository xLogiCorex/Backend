const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')


router.get('/invoices', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    res.status(200).json(await dbHandler.invoiceTable.findAll())
})

router.get('/invoices/my', authenticateJWT(), authorizeRole(['sales']), async (req, res) => {
    try {
        const userId = req.user.id;
        const myInvoices = await dbHandler.invoiceTable.findAll({
            where: { user: userId },
            order: [['issueDate', 'DESC']]
        });
        res.status(200).json(myInvoices);
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }
});
module.exports = router;
