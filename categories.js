const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

router.use("/",authenticateJWT)
router.use("/",authorizeRole)

router.get('/categories', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.categoryTable.findAll())
})

router.post('/categories', authenticateJWT(), authorizeRole(['admin']), async (req,res) => {
    let { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ message: 'Írd be a kategória nevét a mezőbe!' });
    }

    const oneCategory = await dbHandler.categoryTable.findOne({
        where:{name: newName}
    })

    if (oneCategory){
        return res.status(409).json({message: 'Ez a kategórianév már létezik!'})
    }

    try{
        await dbHandler.categoryTable.create({
            name: newName
        })
        return res.status(201).json({message: 'Kategória sikeresen rögzítve!'})
    }
    catch(error)
    {
        return res.status(500).json({message: 'A kategória mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message})
    }
})

module.exports = router