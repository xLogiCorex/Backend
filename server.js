const express = require('express')
const JWT = require('jsonwebtoken')
const dbHandler = require('./dbHandler')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const app = express().use(express.json(),cors())
const bcrypt = require('bcrypt')
const axios = require('axios')

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


app.get('/users', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    res.status(200).json(await dbHandler.userTable.findAll())
})

app.get('/products', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.productTable.findAll())
})

app.get('/categories', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.categoryTable.findAll())
})

app.get('/subcategories', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
    res.status(200).json(await dbHandler.subcategoryTable.findAll())
})

app.get('/partners', authenticateJWT(), authorizeRole(['sales', 'admin']), async (req, res) => {
    res.status(200).json(await dbHandler.partnerTable.findAll())
})

// ----------- Új termék rögzítése --------------
//
// Az alábbi tulajdonságokat kérjük csak be: 
//  newSku, newName, newCategory, newSubCategory, newUnit, newPrice, newMinStockLevel 
//
//  Készlet mennyiséget bevételezésnél fogjuk megadni. Az egy másik put lesz.
// ----------------------------------------------

app.post('/products', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
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

app.post('/partners', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let { newName, newTaxNumber, newAddress, newContactPerson, newEmail, newPhone } = req.body;

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
            phone: newPhone
        })
        return res.status(201).json({message: 'Partner sikeresen rögzítve!'})
    }
    catch(error)
    {
        return res.status(500).json({message: 'A partner mentése sikertelen volt. Kérjük, próbáld újra!', error: error.message})
    }
    
})

app.post('/orders', authenticateJWT(), authorizeRole(['admin', 'sales', 'user']), async (req,res) => {
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

app.post('/register', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let { newName, newEmail, newPassword, newRole } = req.body;

    if(!newName || !newPassword || !newEmail){
        return res.status(400).json({message: 'Minden mező kitöltése kötelező!'})
    }

    if(newPassword.length <= 3){
        return res.status(401).json({message: 'A jelszónak legalább 3 karakter hosszúnak kell lennie!'})
    }

    if(newName.length <= 3){
        return res.status(401).json({message: 'A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!'})
    }

    const emailCheck = await dbHandler.userTable.findOne({
        where:{email: newEmail} 
    })

    if(emailCheck){
        return res.status(409).json({message: 'Már van regisztráció ezzel az e-mail-címmel!'})
    }

    const usernameCheck = await dbHandler.userTable.findOne({
        where:{name: newName} 
    })

    if(usernameCheck){
        return res.status(409).json({message: 'Már van regisztráció ezzel a felhasználónévvel!'})
    }

    if(newRole == 'ADMIN' + SECRET){
        newRole = 'admin'
    }
    else if(newRole == 'SALES'){
        newRole = 'sales'
    }
    else{
        newRole = 'user'
    }

    // Jelszó titkosítás
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try{
        await dbHandler.userTable.create({
            name: newName,
            password: hashedPassword,
            email: newEmail,
            role: newRole,
        })
        return res.status(201).json({message: 'Sikeres regisztráció!'})
    }
    catch(error){
        return res.status(500).json({message: 'Hiba történt a regisztráció során. Kérjük, próbáld újra később!', error: error.message })
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

        return res.status(200).json({token, role:userLogin.role, message: 'Sikeres bejelentkezés!'})

    }
    catch(error){
        return res.status(500).json({message: 'Váratlan hiba történt a bejelentkezés során. Kérjük, próbáld meg később újra!', error: error.message})
    }
})

function authenticateJWT(){
    return (req,res,next) => {
        const authHeader = req.headers.authorization
        if(!authHeader){
            return res.status(401).json({message:'Hiányzó token!'})
        }

        const tokenParts = authHeader.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
            return res.status(401).json({ message: 'Hibás token formátum' });
        }

        try {
            const decodedToken = JWT.verify(tokenParts[1], SECRET)
            req.email = decodedToken.email;
            req.role = decodedToken.role; 
            next()
        } 
        catch (error) {
            return res.status(403).json({message:'Érvénytelen token!', error: error.message}) 
        }
    }
}

function authorizeRole(roles = []) {
    return (req, res, next) => {
        if (!req.role) {
            return res.status(403).json({ message: "Hiányzik a szerep a kérésből" });
        }
        
        if (!roles.includes(req.role)) {
            return res.status(403).json({ message: "Nincs jogosultságod" });
        }
        next();
    };
}

app.listen(PORT, () => {console.log(`A szerver a  ${PORT} porton fut.`);});