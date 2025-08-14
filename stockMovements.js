const express = require('express');
const router = express.Router();
const { stockMovementTable, productTable, userTable } = require('./dbHandler');

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

// Terméklista lekérése
router.get('/products', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.productTable.findAll())
})

// Készletmozgások listázása
router.get('/stock-movements', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    res.status(200).json(await dbHandler.stockMovementTable.findAll())
})

// Készletmozgás létrehozása
router.post('/stock-movements', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    try {
        const { productId, type, quantity, note } = req.body;
        const userId = req.user.id;

        if (!productId || !type || !quantity || !userId) {
            return res.status(400).json({ message: "Hiányzó mezők: productId, type, quantity, userId" });
        }

        if (!['in', 'out', 'internal'].includes(type)) {
            return res.status(400).json({ message: "Érvénytelen mozgástípus." });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: "A mennyiségnek pozitívnak kell lennie." });
        }

        const product = await productTable.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: "Termék nem található." });
        }

        if ((type === 'out' || type === 'internal') && product.stockQuantity < quantity) {
        return res.status(400).json({ message: "Nincs elegendő készlet a művelethez." });
        }

        // Készlet frissítése
        let newQuantity = product.stockQuantity;

        if (type === 'in') newQuantity += quantity;
        else if (type === 'out' || type === 'internal') newQuantity -= quantity;

        // Mozgás rögzítése
        const movement = await stockMovementTable.create({
        productId,
        type,
        quantity,
        userId,
        note
        });

        // Termék készlet frissítése
        await product.update({ 
            stockQuantity: newQuantity,
            availableStock: newQuantity,
            isActive: newQuantity > 0
        });

        res.status(201).json({ message: "Készletmozgás rögzítve.", movement });
    } 
    catch (error) {
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }

});
/*
// Saját készletmozgások listázása 
router.get('/stock-movements/my', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const userId = req.user.id;
        const myMovements = await stockMovementTable.findAll({ where: { userId }, order: [['date', 'DESC']] });
        res.status(200).json(myMovements);
    } 
    catch (error) {
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }
});*/

module.exports = router;