const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

//router.use("/",authenticateJWT)
//router.use("/",authorizeRole)

router.get('/orders', authenticateJWT(), authorizeRole(['sales', 'admin']), async (req, res) => {
    res.status(200).json(await dbHandler.partnerTable.findAll())
})

router.post('/orders', authenticateJWT(), authorizeRole(['admin', 'sales', 'user']), async (req,res) => {
    let { newOrder, newPartner, newUser, newDate, newStatus } = req.body;

    if (!newOrder || !newPartner || !newUser){
    return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
    }

    const oneOrder = await dbHandler.orderTable.findOne({
        where:{orderNumber: newOrder}
    })

    if (oneOrder){
        return res.status(409).json({message: 'Ez a rendelés már létezik!'})
    }

    try{
        await dbHandler.orderTable.create({
            orderNumber: newOrder,
            partner: newPartner,
            user: newUser,
            date: newDate,
            status: newStatus
        })
        return res.status(201).json({message: 'Rendelés sikeresen rögzítve!'})
    }
    catch(error)
    {
        return res.status(500).json({message: 'A rendelés mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message})
    }
})

module.exports = router