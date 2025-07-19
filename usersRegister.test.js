//cmd: npx jest users.register.test.js

// FONTOS: először beállítjuk a SECRET-et, hogy a JWT a tesztben is működjön.
// Ez még a require előtt kell, hogy a router jó értéket kapjon!
process.env.SECRET = "teszttitok";
const supertest = require('supertest');
const express = require('express');
const request = require('supertest'); // Ezzel tudunk HTTP kérést szimulálni a tesztben
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// A dbHandler-t mockoljuk, mert nem akarunk éles adatbázist használni teszt közben.
// Így el tudjuk dönteni, mit adjon vissza, mikor hívják!
jest.mock('./dbHandler');
const dbHandler = require('./dbHandler');

// A /login végponthoz tartozó kódot teszteljük.
const usersRegisterTest = require('./users');

describe('/register végpont tesztelése', () => {
    const app = express();
    app.use(express.json(), usersRegisterTest);

    const adminToken = jwt.sign({ id: 1, email: "admin@teszt.hu", role: "admin" }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: "user@teszt.hu", role: "sales" }, process.env.SECRET, { expiresIn: '1h' });
    // Ez minden egyes teszt előtt kitakarítja a mock-olt adatbázist,
    // így nem keverednek bele az előző tesztek visszaadott adatai
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Jogosultságok tesztelése
    test('nincs token -> 401/403', async () => {
        const res = await supertest(app).post('/register').send({});
        expect([401, 403]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/token|jogosultság|hitelesítés/i);
    })

    test('rossz token -> 401/403', async () => {
        const res = await supertest(app).post('/register').set('Authorization', 'Bearer nem jó').send({});
        expect([401, 403]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/token|érvénytelen|hitelesítés/i);
    })

    test('nem admin token -> 403', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${salesToken}`).send({});
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/jogosultság|admin/i);
    })

    // Mezők tesztelése
    test('hiányzik a név -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newEmail: 'a@b.hu', newPassword: 'pw123' }); // name hiányzik
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/mező/);
    });

    test('hiányzik az email -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztNév', newPassword: 'pw123' }); // email hiányzik
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/mező/);
    });

    test('hiányzik a jelszó -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztNév', newEmail: 'a@b.hu' }); // password hiányzik
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/mező/);
    });

    test('túl rövid név -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'ab', newEmail: 'a@b.hu', newPassword: 'pw123' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/karakter/);
    })
    test('túl rövid jelszó -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztNév', newEmail: 'a@b.hu', newPassword: 'pw' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/karakter/);
    })
    test('túl rövid email -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztNév', newEmail: 'a@b', newPassword: 'pw123' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/karakter/);
    })
    test('túl hosszú email -> 400', async () => {
        const longEmail = 'a'.repeat(129) + '@b.hu'; // 129 karakter hosszú email
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztNév', newEmail: longEmail, newPassword: 'pw123' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/hosszabb 128 karakternél/);
    })
    test('hibás email formátum -> 400', async () => {
        const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztNév', newEmail: 'ímél@+hu', newPassword: 'pw123' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/Hibás email formátum/);
    })
    test('már létező email -> 409', async () => {
        dbHandler.userTable.findOne.mockImplementation(({ where }) => {
            if (where.email) return Promise.resolve({ id: 'valami' }); // mintha találna usert
            return Promise.resolve(null);
        });
        const res = await supertest(app)
            .post('/register').set('Authorization', `Bearer ${adminToken}`)
            .send({ newName: 'tesztnev', newEmail: 'admin@teszt.hu', newPassword: 'pw123' });
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/regisztráció.*e-mail/i);
    });


    test('sikeres regisztráció -> 201', async () => {
        dbHandler.userTable.findOne.mockResolvedValue(null);
        dbHandler.userTable.create.mockResolvedValue({
            id: 42,
            name: 'sosevoltilyen',
            email: 'teszt@egyedi.hu',
            role: 'admin',
            isActive: true
        });
        const res = await supertest(app)
            .post('/register')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newName: 'sosevoltilyen',
                newEmail: 'teszt@egyedi.hu',
                newPassword: 'tesztpw123',
                newRole: 'ADMIN' + process.env.SECRET,
                newIsActive: true
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/sikeres/i);
    });


test('DB-hiba -> 500', async () => {
        dbHandler.userTable.findOne.mockResolvedValue(null);
        dbHandler.userTable.create.mockRejectedValue(new Error("DB off"));
        const res = await supertest(app)
            .post('/register')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newName: 'tesztuser',
                newEmail: 'teszt@valami.hu',
                newPassword: 'tesztpw123',
                newRole: 'ADMIN' + process.env.SECRET,
                newIsActive: true
            });
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toMatch(/hiba történt/i);
    });
});