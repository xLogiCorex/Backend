const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

router.use("/",authenticateJWT)
router.use("/",authorizeRole)

router.get('/products', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.productTable.findAll())
})

// ----------- Új termék rögzítése --------------
//
// Az alábbi tulajdonságokat kérjük csak be: 
//  newSku, newName, newCategory, newSubCategory, newUnit, newPrice, newMinStockLevel 
//
//  Készlet mennyiséget bevételezésnél fogjuk megadni. Az egy másik put lesz.
// ----------------------------------------------

router.post('/products', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let {  newSku, newName, newCategoryId, newSubcategoryId, newUnit, newPrice, newStockQuantity, newMinStockLevel, newIsActive } = req.body;

    if(!newSku || !newName || !newCategoryId || !newUnit || !newPrice ) {
        return res.status(400).json({ message: 'Kötelező mező kitöltése szükséges!' });     // jelölni kell frontenden a kötelző mezőket pl. *-gal
    }
    if(newSku.length <= 3){
        return res.status(400).json({message: 'A termék SKU-nak legalább 4 karakter hosszúnak kell lennie!'})
    }
    if(newName.length <= 3){
        return res.status(400).json({message: 'A termék nevének minimum 4 karakter hosszúnak kell lennie!'})
    }
    const productSkuCheck = await dbHandler.productTable.findOne({
        where:{sku: newSku}
    })
    if (productSkuCheck){
    return res.status(409).json({message: 'Ez a termék SKU már létezik!'})
    }
    const productNameCheck = await dbHandler.productTable.findOne({
        where:{name: newName}
    })
    if (productNameCheck){
    return res.status(409).json({message: 'Ez a termék név már létezik!'})
    }

    try{
        await dbHandler.productTable.create({
            sku: newSku,
            name: newName,
            categoryId: newCategoryId,
            subcategoryId: newSubcategoryId || null,
            unit: newUnit,
            price: newPrice,
            stockQuantity: newStockQuantity || 0,
            minStockLevel: newMinStockLevel || 0,
            isActive: newIsActive
        })
        return res.status(201).json({message: 'Termék sikeresen rögzítve!'})
    }
    catch(error)
    {
        return res.status(500).json({message: 'A termék mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message})
    }

})

module.exports = router