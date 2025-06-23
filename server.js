const express = require('express');
const JWT = require('jsonwebtoken');
const dbHandler = require('./dbHandler');
const cors = require('cors');
require('dotenv').config()
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const app = express().use(express.json(),cors())
const bcrypt = require('bcrypt')

dbHandler.userTable.sync({ alter: true })
dbHandler.productTable.sync({ alter: true })
dbHandler.categoryTable.sync({ alter: true })
dbHandler.subcategoryTable.sync({ alter: true })
dbHandler.partnerTable.sync({ alter: true })
dbHandler.stockMovementTable.sync({ alter: true })
dbHandler.orderTable.sync({ alter: true })
dbHandler.orderItemTable.sync({ alter: true })
dbHandler.invoiceTable.sync({ alter: true })
dbHandler.logTable.sync({ alter: true })


app.get('/users', async (req, res) => {
    res.status(200).json(await dbHandler.userTable.findAll())
})

app.get('/products', async (req, res) => {
    res.status(200).json(await dbHandler.productTable.findAll())
})

app.post('/orders', async (req,res) => {
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

app.post('/login', async (req,res) => {
    try{
        let { newEmail, newPassword } = req.body;

        const userLogin = await dbHandler.userTable.findOne({
            where:{email: newEmail}
        })

        if(!userLogin){
            return res.status(401).json({message: 'A megadott e-mail-cím nem található!'})
        }

        const passwordMatch = await bcrypt.compare(newPassword, userLogin.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'A megadott jelszó helytelen.' });
        }

        const token = JWT.sign(
            {id: userLogin.id, email: userLogin.email, role: userLogin.role}, SECRET, { expiresIn: '1h' } 
        )

        return res.status(200).json({token, message: 'Sikeres bejelentkezés!'})

    }
    catch(error){
        return res.status(500).json({message: 'Váratlan hiba történt a bejelentkezés során. Kérjük, próbáld meg később újra!', error: error.message})
    }
})


app.listen(PORT, () => {console.log(`A szerver a  ${PORT} porton fut.`);});