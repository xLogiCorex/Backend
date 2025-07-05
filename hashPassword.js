//Sima szöveget bycrypt hash-elésére szolgáló script
// A script végigmegy az adatbázisban lévő felhasználókon, és ha a jelszó még nincs hash-elve, akkor hash-eli azt.
// A hash-eléshez bcrypt könyvtárat használunk, és a jelszavakat 10 körös sózással titkosítjuk.
// Sózás: minden jelszóhoz egy véletlenszerűen generált karakterláncot (ún. "sót") adunk hozzá, mielőtt azt hash-eljük (titkosítjuk) és eltároljuk az adatbázisban.


const bcrypt = require('bcrypt');
const dbHandler = require('./dbHandler');
const saltRounds = 10;

async function hashPlainPasswords() {
  const users = await dbHandler.userTable.findAll();

  for (const user of users) {
    const password = user.password;

    // Ellenőrizzük, hogy a jelszó már hash-elve van-e (bcrypt hash mindig $2...-val kezdődik)
    if (!password.startsWith('$2')) {
      console.log(`Felhasználó: ${user.email} - jelszó hash-elése...`);
      const hashed = await bcrypt.hash(password, saltRounds);
      user.password = hashed;
      await user.save();
      console.log(`Hash-elve: ${user.email}`);
    } else {
      console.log(`Felhasználó: ${user.email} - már hash-elve`);
    }
  }

  console.log('Minden jelszó feldolgozva.');
  process.exit(0);
}

hashPlainPasswords().catch(err => {
  console.error('Hiba:', err);
  process.exit(1);
});