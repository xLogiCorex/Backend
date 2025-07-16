const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

router.use("/",authenticateJWT)
router.use("/",authorizeRole)

router.get('/subcategories', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.subcategoryTable.findAll())
})

router.post('/subcategories', authenticateJWT(), authorizeRole(['admin']), async (req,res) => {
    let { newName, newCategoryId } = req.body;

    if (!newName || !newCategoryId) {
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
    }

    const oneSubCategory = await dbHandler.subcategoryTable.findOne({
        where:{name: newName,
            categoryId: newCategoryId
        }
    })
    if (oneSubCategory){
        return res.status(409).json({message: 'Ez az alkategórianév, ebben a főkategóriában már létezik!'})
    }

    try{
        await dbHandler.subcategoryTable.create({
            name: newName,
            categoryId: newCategoryId
        })
        return res.status(201).json({message: 'Alkategória sikeresen rögzítve!'})
    }
    catch(error)
    {
        return res.status(500).json({message: 'Az alkategória mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message})
    }
})

module.exports = router