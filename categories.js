const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')
const { logAction } = require('./log');

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

// Kategóriák lekérése
router.get('/categories', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.categoryTable.findAll())
})

// Kategória létrehozása
router.post('/categories', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let { newName } = req.body;

    if (!newName)
        return res.status(400).json({ message: 'Írd be a kategória nevét a mezőbe!' });

    const oneCategory = await dbHandler.categoryTable.findOne({
        where: { name: newName }
    })

    if (oneCategory)
        return res.status(409).json({ message: 'Ez a kategórianév már létezik!' })

    try {
        const newCategory = await dbHandler.categoryTable.create({ name: newName });

        await logAction({
            userId: req.user.id,
            action: 'CATEGORY_CREATED',
            targetType: 'Category',
            targetId: newCategory.id,
            payload: { name: newName },
            req
        });

        return res.status(201).json({ message: 'Kategória sikeresen rögzítve!' })
    }
    catch (error) {
        return res.status(500).json({ message: 'A kategória mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message })
    }
})

module.exports = router