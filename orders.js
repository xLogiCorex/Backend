const express = require('express')
const router = express.Router()
const { Order, OrderItem, productTable, stockMovementTable } = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

router.get('/orders', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const where = {};

        if (req.user.role === 'sales') {
            where.user = req.user.id;  // sales csak a saját rendelések
        }

        const orders = await dbHandler.orderTable.findAll({
            where,
            order: [['date', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }
});



router.post('/orders', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    let { newOrder, newPartner, newUser, newDate, newStatus } = req.body;

    if (!newOrder || !newPartner || !newUser)
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });

    const oneOrder = await dbHandler.orderTable.findOne({
        where: { orderNumber: newOrder }
    })

    if (oneOrder)
        return res.status(409).json({ message: 'Ez a rendelés már létezik!' })

    try {
        await dbHandler.orderTable.create({
            orderNumber: newOrder,
            partner: newPartner,
            user: newUser,
            date: newDate,
            status: newStatus
        })
        return res.status(201).json({ message: 'Rendelés sikeresen rögzítve!' })
    }
    catch (error) {
        return res.status(500).json({ message: 'A rendelés mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message })
    }
})

router.put('/orders/:id/status', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    const orderId = req.params.id;
    const { newStatus } = req.body;

    if (newStatus !== 'completed' && newStatus !== 'cancelled')
        return res.status(400).json({ message: 'Csak a "completed" vagy "cancelled" státusz adható meg.' });

    try {
        const order = await dbHandler.orderTable.findByPk(orderId);
        if (!order)
            return res.status(404).json({ message: 'Rendelés nem található!' });

        if (order.invoiceId)
            return res.status(400).json({ message: 'Ehhez a rendeléshez már készült számla.' });

        if (order.status !== 'new')
            return res.status(400).json({ message: 'Csak "new" státuszú rendelés állítható át.' });

        order.status = newStatus;
        await order.save();

        if (newStatus === 'completed') {
            const orderItems = await dbHandler.orderItemTable.findAll({
                where: { orderId: order.id }
            });

            // --- Optimalizált terméknév lekérés ---
            // 1. Gyűjtsük össze az összes termék ID-jét
            const productIds = [];
            for (const item of orderItems) {
                if (!productIds.includes(item.productId)) {
                    productIds.push(item.productId);
                }
            }
            // 2. Egyszer lekérjük az összes szükséges terméket
            const products = await dbHandler.productTable.findAll({
                where: { id: productIds }
            });
            // 3. Készítsünk szótárat a termékek nevével, ID alapján
            const productMap = {};
            for (const product of products) {
                productMap[product.id] = product.name;
            }
            // 4. Feltöltjük a tételek listáját a terméknevekkel
            let items = [];
            let totalNet = 0;
            for (const item of orderItems) {
                const productName = productMap[item.productId] || 'Ismeretlen termék';
                const productTotal = item.quantity * item.unitPrice;
                totalNet += productTotal;
                items.push({
                    productName: productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: productTotal.toFixed(2)
                });
            }
            // --- Számlaszám és összesítés ---
            const VAT_RATE = 0.27;
            const totalVAT = totalNet * VAT_RATE;
            const totalGross = totalNet + totalVAT;

            const year = new Date().getFullYear();
            const lastInvoice = await dbHandler.invoiceTable.findOne({
                order: [['id', 'DESC']]
            });
            const newInvoiceNumber = `SZ-${year}-${String((lastInvoice ? lastInvoice.id : 0) + 1).padStart(5, '0')}`;

            // --- Számla létrehozása ---
            const newInvoice = await dbHandler.invoiceTable.create({
                invoiceNumber: newInvoiceNumber,
                orderId: order.id,
                partnerId: order.partnerId,
                userId: order.userId,
                issueDate: new Date(),
                items: items,
                totalNet: totalNet.toFixed(2),
                totalVAT: totalVAT.toFixed(2),
                totalGross: totalGross.toFixed(2),
                note: null
            });

            // --- Rendelés frissítése az invoiceId-val ---
            order.invoiceId = newInvoice.id;
            await order.save();
        }

        res.status(200).json({ message: `Rendelés státusza sikeresen "${newStatus}"-re módosítva.` });
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt a státusz módosítása során.', error: error.message });
    }
});

module.exports = router;