const express = require('express')
const router = express.Router()
const { orderTable, orderItemTable, productTable, stockMovementTable, logTable, partnerTable, invoiceTable } = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');

// Rendelések lekérése
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

// Új rendelés létrehozása
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

        const newOrder = await orderTable.create({
            orderNumber: newOrderNumber,
            partnerId,
            userId: req.user.id,
            date: new Date(),
            status: 'new'
        });

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

// Rendelés státusz módosítása
router.put('/orders/:id/status', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    const orderId = req.params.id;
    const { newStatus } = req.body;

    const allowedStatuses = ['new', 'confirmed', 'processing', 'completed', 'cancelled', 'on_hold'];

    if (!allowedStatuses.includes(newStatus)) {
        return res.status(400).json({ message: 'Érvénytelen státusz.' });
    }

    try {
        const order = await orderTable.findByPk(orderId);
        if (!order) return res.status(404).json({ message: 'Rendelés nem található!' });

        const previousStatus = order.status;
        order.status = newStatus;

        if (newStatus === 'completed' && previousStatus !== 'completed') {
            await createInvoiceForOrder(order);
        }

        await order.save();

        try {
            await logTable.create({
                userId: req.user.id,
                action: 'ORDER_UPDATE',
                targetType: 'order',
                targetId: order.id,
                payload: {
                    status: newStatus,
                    previousStatus: previousStatus
                }
            });
        } catch (logError) {
            console.error("Naplózási hiba:", logError);
        }

        res.status(200).json({
            message: `Rendelés státusza sikeresen módosítva "${newStatus}"-re.`,
            order
        });

    } catch (error) {
        console.error("Státusz módosítás hiba:", error);
        res.status(500).json({
            message: 'Hiba történt a státusz módosítása során.',
            error: error.message
        });
    }
});

// Számla létrehozása rendeléshez
async function createInvoiceForOrder(order) {
    try {
        
        const existingInvoice = await invoiceTable.findOne({
            where: { orderId: order.id }
        });

        if (existingInvoice) {
            console.log(`⚠️ Ehhez a rendeléshez már tartozik számla: ${order.orderNumber}`);
            return existingInvoice;
        }

        const orderItems = await orderItemTable.findAll({
            where: { orderId: order.id }
        });

        // Összegek kiszámítása
        let totalNet = 0;
        const itemsWithDetails = [];

        for (const item of orderItems) {
            const product = await productTable.findByPk(item.productId);
            const itemTotal = item.quantity * item.unitPrice;

            totalNet += itemTotal;

            itemsWithDetails.push({
                productId: item.productId,
                productName: product ? product.name : 'Ismeretlen termék',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: itemTotal
            });
        }

        const totalVAT = Math.round(totalNet * 0.27);
        const totalGross = totalNet + totalVAT;

        // Számlaszám generálása: SZ-ÉÉÉÉ-00001
        const year = new Date().getFullYear();
        const lastInvoice = await invoiceTable.findOne({
            order: [['id', 'DESC']]
        });

        const nextNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[2]) + 1 : 1;
        const invoiceNumber = `SZ-${year}-${String(nextNumber).padStart(5, '0')}`;

        // Számla létrehozása
        const newInvoice = await invoiceTable.create({
            invoiceNumber,
            orderId: order.id,
            partnerId: order.partnerId,
            userId: order.userId,
            issueDate: new Date(),
            items: itemsWithDetails,
            totalNet,
            totalVAT,
            totalGross,
            note: `Számla a ${order.orderNumber} rendeléshez`
        });

        console.log(`✅ Számla létrehozva: ${invoiceNumber} a ${order.orderNumber} rendeléshez`);
        return newInvoice;

    } catch (error) {
        console.error('Hiba a számla létrehozásakor:', error);
        throw error;
    }
}

// Saját rendelések lekérése
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

// Rendelés részleteinek lekérése
router.get('/orders/:id', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await orderTable.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Rendelés nem található!' });
        }

        if (req.user.role === 'sales' && order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Nincs jogosultságod ehhez a rendeléshez!' });
        }

        const orderItems = await orderItemTable.findAll({
            where: { orderId }
        });

        const partner = await partnerTable.findByPk(order.partnerId, {
            attributes: ['name']
        });

        const itemsWithProducts = [];
        for (const item of orderItems) {
            const product = await productTable.findByPk(item.productId, {
                attributes: ['name', 'sku', 'unit']
            });

            itemsWithProducts.push({
                ...item.toJSON(),
                product: product || { name: 'Ismeretlen termék', sku: 'N/A', unit: 'db' }
            });
        }

        const response = {
            ...order.toJSON(),
            items: itemsWithProducts,
            partner: partner
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("GET /orders/:id hiba:", error);
        res.status(500).json({ message: "Szerverhiba", error: error.message });
    }
});

module.exports = router;