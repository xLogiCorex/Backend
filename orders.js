const express = require('express')
const router = express.Router()
const { Order, OrderItem, productTable, stockMovementTable } = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

// Rendelés szám generálás
function generateOrderNumber() {
    return 'ORD-' + Date.now()
}

// Megrendelések listázása (admin: mind, sales: csak saját)
router.get('/orders', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    const where = req.user.role === 'sales' ? { userId: req.user.id } : {}
    res.status(200).json(await Order.findAll({where}))
})

// Megrendelés részletei (csak tulaj vagy admin)
router.get('/orders/:id', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    const order = await Order.findByPk(req.params.id, { include: [OrderItem] })

    if (!order) return res.status(404).json({ message: 'Rendelés nem található' })
        
    if (req.user.role !== 'admin' && order.userId !== req.user.id)
        return res.status(403).json({ message: 'Nincs jogosultság' })
    res.json(order)
})

// Megrendelés létrehozása
router.post('/orders', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    const { partnerId, items } = req.body

    if (!partnerId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Hiányzó partner vagy tételek' })
    }

    const t = await Order.sequelize.transaction()

    try {
        const orderNumber = generateOrderNumber()
        const order = await Order.create({ orderNumber, partnerId, userId: req.user.id, status: 'új' }, { transaction: t })

        for (const item of items) {
            const product = await productTable.findByPk(item.productId, { transaction: t })

            if (!product) {
                await t.rollback()
                return res.status(404).json({ message: `Termék nem található: ${item.productId}` })
            }
            if (product.availableStock < item.quantity) {
                await t.rollback()
                return res.status(400).json({ message: `Nincs elég készlet a termékhez: ${product.name}` })
            }

            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price || 0,
                totalPrice: (product.price || 0) * item.quantity
            }, { transaction: t })

            await stockMovementTable.create({
                productId: item.productId,
                type: 'out',
                quantity: item.quantity,
                userId: req.user.id,
                note: `Megrendelés ${orderNumber}`
            }, { transaction: t })

            await product.update({
                stockQuantity: product.stockQuantity - item.quantity,
                availableStock: product.availableStock - item.quantity
            }, { transaction: t })
        }

        await t.commit()
        res.status(201).json({ message: 'Megrendelés sikeresen létrehozva', orderId: order.id, orderNumber })
    } 
    catch (e) {
        await t.rollback()
        res.status(500).json({ message: 'Hiba történt', error: e.message })
    }
})

module.exports = router