const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

//router.use("/",authenticateJWT)
//router.use("/",authorizeRole)

router.get('/partners', authenticateJWT(), authorizeRole(['sales', 'admin']), async (req, res) => {
    res.status(200).json(await dbHandler.partnerTable.findAll())
})

// ----------- Új partner rögzítése --------------
//
// Az alábbi tulajdonságokat kérjük csak be: 
//  newName, newTaxNumber, newAddress, newContactPerson, newEmail, newPhone
//
//  Ez mind kötelező adat.
//
//  Tettem bele e-mail és adószám ellenőrzést. Majd teszteljük!
//
// ----------------------------------------------

router.post('/partners', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let { newName, newTaxNumber, newAddress, newContactPerson, newEmail, newPhone, newIsActive } = req.body;

    if(!newName || !newTaxNumber || !newAddress || !newContactPerson || !newEmail || !newPhone ) {
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });  
    }
    if(newName.length <= 3) {
        return res.status(401).json({message: 'A cég nevének legalább 4 karakter hosszúnak kell lennie!'})
    }
    // adószám validálása - forrás ChatGPT
    const adoRegex = new RegExp('^\\d{8}-\\d{1}-\\d{2}$')

    if (!adoRegex.test(newTaxNumber)) {
        return res.status(400).json({ message: 'Hibás adószám formátum! (pl.: 12345678-1-12)' })
    }
    // email validálása - forrás ChatGPT
    const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
    if (!emailRegex.test(newEmail)) {
        return res.status(400).json({ message: 'Hibás email formátum!' })
    }
    const partnerTaxNumberCheck = await dbHandler.partnerTable.findOne({
        where:{taxNumber: newTaxNumber}
    })
    if (partnerTaxNumberCheck){
    return res.status(409).json({message: 'Ez a partner már létezik!'})
    }
    try{
        await dbHandler.partnerTable.create({
            name: newName,
            taxNumber: newTaxNumber,
            address: newAddress,
            contactPerson: newContactPerson,
            email: newEmail,
            phone: newPhone,
            isActive: newIsActive
        })
        return res.status(201).json({message: 'Partner sikeresen rögzítve!'})
    }
    catch(error)
    {
        return res.status(500).json({message: 'A partner mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message})
    } 
})

module.exports = router