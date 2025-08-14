const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')
const SECRET = process.env.SECRET
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
require('dotenv').config()

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

//router.use("/",authenticateJWT)
//router.use("/",authorizeRole)

router.get('/users', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    res.status(200).json(await dbHandler.userTable.findAll())
})

router.post('/register', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
    let { newName, newEmail, newPassword, newRole, newIsActive } = req.body;


    // input hibákat átrtam 401ről 400ra.
    if(!newName || !newPassword || !newEmail){
        return res.status(400).json({message: 'Minden mező kitöltése kötelező!'})
    }

    if(newName.length <= 3){
        return res.status(400).json({message: 'A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!'})
    }
    if (newName.length > 64) {
    return res.status(400).json({message: 'A felhasználónév nem lehet hosszabb 64 karakternél!'})
}

    if(newPassword.length <= 3){
        return res.status(400).json({message: 'A jelszónak legalább 3 karakter hosszúnak kell lennie!'})
    }
    if (newPassword.length > 128) {
    return res.status(400).json({message: 'A jelszó nem lehet hosszabb 128 karakternél!'})
}

    if(newEmail.length < 4){
        return res.status(400).json({message: 'Az emailnek legalább 4 karakter hosszúnak kell lennie!'})
    }
       if(newEmail.length > 128){
        return res.status(400).json({message: 'Az email nem lehet hosszabb 128 karakternél!'})
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail)) {
        return res.status(400).json({ message: 'Hibás email formátum!' })
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

    // Jelszó titkosítás
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try{
        await dbHandler.userTable.create({
            name: newName,
            password: hashedPassword,
            email: newEmail.toLowerCase(),
            role: newRole,
            isActive: newIsActive
        })
        return res.status(201).json({message: 'Sikeres regisztráció!'})
    }
    catch(error){
        return res.status(500).json({message: 'Hiba történt a regisztráció során. Kérjük, próbáld újra később!', error: error.message })
    }
})



router.post('/login', async (req,res) => {
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

module.exports = router