const express = require('express')
const router = express.Router()
const dbHandler = require('./dbHandler')
const { logAction } = require('./log');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const SECRET = process.env.SECRET

const authenticateJWT = require('./authenticateJWT')
const authorizeRole = require('./authorizeRole')

router.get('/users', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
  res.status(200).json(await dbHandler.userTable.findAll())
})

router.post('/register', authenticateJWT(), authorizeRole(['admin']), async (req, res) => {
  let { newName, newEmail, newPassword, newRole, newIsActive } = req.body;


  // input hibákat átrtam 401ről 400ra.
  if (!newName || !newPassword || !newEmail)
    return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' })

  if (newName.length <= 3)
    return res.status(400).json({ message: 'A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!' })

  if (newName.length > 64)
    return res.status(400).json({ message: 'A felhasználónév nem lehet hosszabb 64 karakternél!' })

  if (newPassword.length <= 3)
    return res.status(400).json({ message: 'A jelszónak legalább 3 karakter hosszúnak kell lennie!' })

  if (newPassword.length > 128)
    return res.status(400).json({ message: 'A jelszó nem lehet hosszabb 128 karakternél!' })

  if (newEmail.length < 4)
    return res.status(400).json({ message: 'Az emailnek legalább 4 karakter hosszúnak kell lennie!' })

  if (newEmail.length > 128)
    return res.status(400).json({ message: 'Az email nem lehet hosszabb 128 karakternél!' })

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(newEmail))
    return res.status(400).json({ message: 'Hibás email formátum!' })

  const emailCheck = await dbHandler.userTable.findOne({
    where: { email: newEmail }
  })

  if (emailCheck)
    return res.status(409).json({ message: 'Már van regisztráció ezzel az e-mail-címmel!' })

  const usernameCheck = await dbHandler.userTable.findOne({
    where: { name: newName }
  })

  if (usernameCheck)
    return res.status(409).json({ message: 'Már van regisztráció ezzel a felhasználónévvel!' })

  if (newRole == 'admin' + SECRET)
    newRole = 'admin'

  else if (newRole == 'sales' + SECRET)
    newRole = 'sales'


  // Jelszó titkosítás
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const newUser = await dbHandler.userTable.create({
      name: newName,
      password: hashedPassword,
      email: newEmail.toLowerCase(),
      role: newRole,
      isActive: newIsActive
    })
    await logAction({
      userId: req.user.id,
      action: 'USER_REGISTER',
      targetType: 'User',
      targetId: newUser.id,
      payload: {
        name: newName,
        email: newEmail.toLowerCase(),
        role: newRole,
        byUserId: req.user.id
      },
      req
    });
    return res.status(201).json({ message: 'Sikeres regisztráció!' })
  }

  catch (error) {
    return res.status(500).json({ message: 'Hiba történt a regisztráció során. Kérjük, próbáld újra később!', error: error.message })


  }
})


router.post('/login', async (req, res) => {
  let { newEmail, newPassword } = req.body;

  try {
    const userLogin = await dbHandler.userTable.findOne({
      where: { email: newEmail }
    });

    if (!userLogin) {
      // Hibás email, logoljuk
      await dbHandler.logTable.create({
        userId: null,
        action: 'LOGIN_FAIL',
        targetType: 'User',
        targetId: null,
        payload: {
          email: newEmail,
          reason: 'Ismeretlen felhasználó',
          ip: req.ip,
          userAgent: req.headers['user-agent']
        }
      });
      return res.status(401).json({ message: 'A megadott e-mail-cím nem található!' });
    }

    const passwordMatch = await bcrypt.compare(newPassword, userLogin.password);

    if (!passwordMatch) {
      // Hibás jelszó, logoljuk
      await dbHandler.logTable.create({
        userId: userLogin.id,
        action: 'LOGIN_FAIL',
        targetType: 'User',
        targetId: userLogin.id,
        payload: {
          email: newEmail,
          reason: 'Hibás jelszó',
          ip: req.ip,
          userAgent: req.headers['user-agent']
        }
      });
      return res.status(401).json({ message: 'A megadott jelszó helytelen.' });
    }

    // Sikeres bejelentkezés logolása
    await logAction({
      userId: userLogin.id,
      action: 'LOGIN_SUCCESS',
      targetType: 'User',
      targetId: userLogin.id,
      payload: { email: newEmail }
    });

    const token = JWT.sign(
      { id: userLogin.id, email: userLogin.email, role: userLogin.role },
      SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token, role: userLogin.role, message: 'Sikeres bejelentkezés!' });
  } catch (error) {
    // Váratlan hiba esetén logolhatod, vagy csak visszaadsz hibát
    return res.status(500).json({ message: 'Váratlan hiba történt a bejelentkezés során. Kérjük, próbáld meg később újra!', error: error.message });
  }
});

module.exports = router