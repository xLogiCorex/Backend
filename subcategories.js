const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')
const { logAction } = require('./log');

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

// Alkategóriák listázása
router.get('/subcategories', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.subcategoryTable.findAll())
})

// Alkategóriák létrehozása
router.post('/subcategories', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let { newName, newCategoryId } = req.body;

    if (!newName || !newCategoryId)
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });

    const oneSubCategory = await dbHandler.subcategoryTable.findOne({
        where: {
            name: newName,
            categoryId: newCategoryId
        }
    })
    if (oneSubCategory)
        return res.status(409).json({ message: 'Ez az alkategórianév, ebben a főkategóriában már létezik!' })

    try {
        const newSubCategory = await dbHandler.subcategoryTable.create({
            name: newName,
            categoryId: newCategoryId
        })

        await logAction({
            userId: req.user.id,
            action: 'SUBCATEGORY_CREATED',
            targetType: 'Subcategory',
            targetId: newSubCategory.id,
            payload: { name: newName, categoryId: newCategoryId },
            req
        });

        return res.status(201).json({ message: 'Alkategória sikeresen rögzítve!' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Az alkategória mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message })
    }
})

module.exports = router