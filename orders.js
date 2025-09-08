const express = require('express');
const router = express.Router();
const { orderTable, orderItemTable, productTable, invoiceTable } = require('./dbHandler');

const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');

// --- RENDELÉSEK LEKÉRÉSE ---
router.get('/orders', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const where = req.user.role === 'sales' ? { userId: req.user.id } : {};
        const orders = await orderTable.findAll({ where, order: [['date', 'DESC']] });
        res.status(200).json(orders);
    } catch (error) {
        console.error("GET /orders hiba:", error);
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }
});

// --- ÚJ RENDELÉS LÉTREHOZÁSA ---
    router.post('/orders', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const { partnerId, items } = req.body;

        if (!partnerId) {
        return res.status(400).json({ message: 'Partner megadása kötelező!' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'A rendeléshez legalább egy tétel szükséges!' });
        }

        // Új orderNumber generálása
        const year = new Date().getFullYear();
        const lastOrder = await orderTable.findOne({ order: [['id', 'DESC']] });
        const newOrderNumber = `ORD-${year}-${String((lastOrder ? lastOrder.id : 0) + 1).padStart(5, '0')}`;

        // Rendelés mentése
        const newOrder = await orderTable.create({
        orderNumber: newOrderNumber,
        partnerId,
        userId: req.user.id,
        date: new Date(),
        status: 'new'
        });

        // Tételek mentése
        let totalNet = 0;
        for (const item of items) {
        const { productId, quantity } = item;
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Érvénytelen rendelési tétel!' });
        }

        const product = await productTable.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: `A(z) ${productId} ID-jú termék nem található!` });
        }

        const unitPrice = product.price;
        const totalPrice = unitPrice * quantity;
        totalNet += totalPrice;

        await orderItemTable.create({
            orderId: newOrder.id,
            productId,
            quantity,
            unitPrice,
            totalPrice
        });
        }

        return res.status(201).json({ message: 'Rendelés sikeresen rögzítve!', orderId: newOrder.id });
    } catch (error) {
        console.error("POST /orders hiba:", error);
        return res.status(500).json({ message: 'A rendelés mentése sikertelen volt.', error: error.message });
    }
});

// --- RENDELÉS STÁTUSZ MÓDOSÍTÁSA + SZÁMLA KÉSZÍTÉS ---
    router.put('/orders/:id/status', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    const orderId = req.params.id;
    const { newStatus } = req.body;

    if (newStatus !== 'completed' && newStatus !== 'cancelled') {
        return res.status(400).json({ message: 'Csak "completed" vagy "cancelled" státusz adható meg.' });
    }

    try {
        const order = await orderTable.findByPk(orderId);
        if (!order) return res.status(404).json({ message: 'Rendelés nem található!' });

        if (order.invoiceId) return res.status(400).json({ message: 'Ehhez a rendeléshez már készült számla.' });

        if (order.status !== 'new') return res.status(400).json({ message: 'Csak "new" státuszú rendelés állítható át.' });

        if (req.user.role === 'sales' && order.userId !== req.user.id) {
        return res.status(403).json({ message: 'Csak a saját rendelésedet módosíthatod!' });
        }

        order.status = newStatus;
        await order.save();

        // Ha completed -> számla készítés
        if (newStatus === 'completed') {
        const orderItems = await orderItemTable.findAll({ where: { orderId: order.id } });

        let totalNet = 0;
        let invoiceItems = [];
        for (const item of orderItems) {
            const product = await productTable.findByPk(item.productId);
            const productName = product ? product.name : 'Ismeretlen termék';
            const productTotal = item.quantity * item.unitPrice;
            totalNet += productTotal;
            invoiceItems.push({
            productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: productTotal.toFixed(2)
            });
        }

        const VAT_RATE = 0.27;
        const totalVAT = totalNet * VAT_RATE;
        const totalGross = totalNet + totalVAT;

        const year = new Date().getFullYear();
        const lastInvoice = await invoiceTable.findOne({ order: [['id', 'DESC']] });
        const newInvoiceNumber = `SZ-${year}-${String((lastInvoice ? lastInvoice.id : 0) + 1).padStart(5, '0')}`;

        const newInvoice = await invoiceTable.create({
            invoiceNumber: newInvoiceNumber,
            orderId: order.id,
            partnerId: order.partnerId,
            userId: order.userId,
            issueDate: new Date(),
            items: invoiceItems,
            totalNet: totalNet.toFixed(2),
            totalVAT: totalVAT.toFixed(2),
            totalGross: totalGross.toFixed(2),
            note: null
        });

        order.invoiceId = newInvoice.id;
        await order.save();
        }

        res.status(200).json({ message: `Rendelés státusza sikeresen "${newStatus}"-re módosítva.` });
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt a státusz módosítása során.', error: error.message });
    }
});

// --- SAJÁT RENDELÉSEK LEKÉRÉSE ---
router.get('/orders/my', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const where = req.user.role === 'sales' ? { userId: req.user.id } : {};
        const orders = await orderTable.findAll({ where, order: [['date', 'DESC']] });

        if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Nincsenek saját rendeléseid.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("GET /orders/my hiba:", error);
        res.status(500).json({ message: 'Hiba a saját rendelések lekérésekor.', error: error.message });
    }
});

module.exports = router;
