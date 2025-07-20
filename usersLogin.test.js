// FONTOS: először beállítjuk a SECRET-et, hogy a JWT a tesztben is működjön.
// Ez még a require előtt kell, hogy a router jó értéket kapjon!
process.env.SECRET = "teszttitok";

const express = require('express');
const request = require('supertest'); // Ezzel tudunk HTTP kérést szimulálni a tesztben
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// A dbHandler-t mockoljuk, mert nem akarunk éles adatbázist használni teszt közben.
// Így el tudjuk dönteni, mit adjon vissza, mikor hívják!
jest.mock('./dbHandler');
const dbHandler = require('./dbHandler');

// A /login végponthoz tartozó kódot teszteljük.
const usersLoginTest = require('./users');

describe('/login végpont tesztelése', () => {
    // Létrehozunk egy mini express appot, amin csak ezt a routert teszteljük.
    const app = express();
    app.use(express.json(), usersLoginTest);

    // Ez minden egyes teszt előtt kitakarítja a mock-olt adatbázist,
    // így nem keverednek bele az előző tesztek visszaadott adatai
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('ha egyáltalán nem adunk meg adatot', async () => {
        // Üres POST requestet küldünk, se e-mail, se jelszó.
        const res = await request(app).post('/login').send({});
        // Elvárjuk, hogy vagy 400 vagy 401 hibát adjon vissza.
        expect([400, 401]).toContain(res.statusCode);
        // És mindig legyen egy message mező a válaszban, amit a felhasználó is láthatna.
        expect(res.body).toHaveProperty('message');
    });

    test('hibás email', async () => {
        // Itt azt mondjuk a mockolt DB-nek, hogy bármire NULL-t adjon vissza,
        // nincs ilyen user az adatbázisban.
        dbHandler.userTable.findOne.mockResolvedValue(null);
        const res = await request(app).post('/login').send({
            newEmail: "nemletezo@teszt.hu",
            newPassword: "valami"
        });
        // 401-es hibát kell kapnunk, mivel nincs ilyen user.
        expect(res.statusCode).toBe(401);

        /*
        A /nem található/i egy reguláris kifejezés (regex):
        / ... /  regex szintaxis
        nem található a keresett részlet
        i jelentése: "case-insensitive", nem számít a kis/nagybetű (pl. "Nem található", "NEM TALÁLHATÓ" is jó)
        */
        expect(res.body.message).toMatch(/nem található/i);
    });


    test('jó az email, de rossz a jelszó', async () => {
        // Előbb elkészítjük a helyes password hash-t:
        const hash = await bcrypt.hash('helyesjelszo', 10);
        // Majd visszaadunk egy usert ezzel a jelszóval (de mi szándékosan rosszat fogunk küldeni)
        dbHandler.userTable.findOne.mockResolvedValue({
            id: 5,
            email: "user@teszt.hu",
            password: hash,
            role: "user"
        });
        // Hibás jelszó
        const res = await request(app).post('/login').send({
            newEmail: "user@teszt.hu",
            newPassword: "rossz" // na ugye
        });
        // 401-et várunk, és legyen benne egy hibaüzenet.
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/helytelen/i);
    });

    test('sikeres login működjön', async () => {
        // Legeneráljuk azt a hash-t, amit a teszt felhasználó is ismer,
        // így tud jelszót egyeztetni a router.
        const hash = await bcrypt.hash('titok', 10);
        dbHandler.userTable.findOne.mockResolvedValue({
            id: 1,
            email: "igyvan@teszt.hu",
            password: hash,
            role: "admin"
        });
        // Most már helyes email/jelszó párost tesztelünk.
        const res = await request(app).post('/login').send({
            newEmail: "igyvan@teszt.hu",
            newPassword: "titok"
        });
        // Elvárt státusz: 200 Ok, mert minden stimmel.
        expect(res.statusCode).toBe(200);
        // A válaszból legyen kiolvasható token, role, message.
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('role', 'admin');
        expect(res.body).toHaveProperty('message');
    });

    test('ha hibát (pl. adatbázis lehalást) szimulálunk', async () => {
        // Most azt mondjuk a DB-nek, hogy dobjon hibát.
        dbHandler.userTable.findOne.mockRejectedValue(new Error("DB off"));
        const res = await request(app).post('/login').send({
            newEmail: "barki@pelda.hu",
            newPassword: "barmi"
        });
        // Hibák esetén 500-as státuszt és egy message + error mezőt várunk vissza.
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
    });


    //token ellenőrzése tesztelése
    
    test('a tokenben megfelelő user adatok legyenek', async () => {
        //mockoljuk a DB-t, hogy visszaadjon egy usert.
        const hash = await bcrypt.hash('titok', 10);
        dbHandler.userTable.findOne.mockResolvedValue({
            id: 1,
            email: "igyvan@teszt.hu",
            password: hash,
            role: "admin"
        });
        // sikeres bejelentkezést szimulálunk
        const res = await request(app).post('/login').send({
            newEmail: "igyvan@teszt.hu",
            newPassword: "titok"
        });
        // Token kibontása és ellenőrzése, hogy a várt adatok vannak-e benne.
        const decoded = jwt.decode(res.body.token);
        // Ellenőrizzük, hogy a token tartalmazza-e a várt adatokat.
        expect(decoded).toHaveProperty('id', 1);
        expect(decoded).toHaveProperty('email', "igyvan@teszt.hu");
        expect(decoded).toHaveProperty('role', "admin");
    });

    test('nincs Authorization header (nincs token)', async () => {
        const res = await request(app).get('/users');
        // Elvárás: 401 
        expect([401]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/token|jogosultság|hitelesítés/i);
    });

    test('rossz Bearer token (nem JWT)', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer eznemjwt');
        expect([401]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/token|érvénytelen|hitelesítés/i);
    });

     test('lejárt JWT token', async () => {
        // Lejárt token generálása (expiresIn: -10s, azaz 10 másodperccel ezelőtt járt le)
        const expiredToken = jwt.sign(
            { id: 1, email: 'admin@teszt.hu', role: 'admin' },
            process.env.SECRET,
            { expiresIn: -10 }
        );
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect([401]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/lejárt|expire|token/i);
    });

    test('manipulált token (mással aláírva)', async () => {
        // Másik "titkos" kulccsal készült token (nem lesz érvényes)
        const fakeToken = jwt.sign(
            { id: 1, email: 'admin@teszt.hu', role: 'admin' },
            'NEMEZATITKOS',
            { expiresIn: '1h' }
        );
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect([401]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/érvénytelen|hitelesítés|token/i);
    });

});