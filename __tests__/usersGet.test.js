process.env.SECRET = "teszttitok";
const supertest = require('supertest');

const express = require('express');
const jwt = require('jsonwebtoken');
// A dbHandler-t mockoljuk, mert nem akarunk éles adatbázist használni teszt közben.
// Így el tudjuk dönteni, mit adjon vissza, mikor hívják!
jest.mock('../dbHandler');
const dbHandler = require('../dbHandler');

// A /users végponthoz tartozó kódot teszteljük.
const usersGetTest = require('../users');
describe('/users végpont tesztelése', () => {
    // Létrehozunk egy mini express appot, amin csak ezt a routert teszteljük.
    const app = express();
    app.use(express.json(), usersGetTest);
    // Felhasználói tokenek, amiket a tesztekben használunk.
    // Ezeket a tokeneket úgy generáljuk, hogy a SECRET környezeti változó már be legyen állítva.
    const adminToken = jwt.sign({ id: 1, email: "admin@teszt.hu", role: "admin" }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: "user@teszt.hu", role: "sales" }, process.env.SECRET, { expiresIn: '1h' });
    // Ez minden egyes teszt előtt kitakarítja a mock-olt adatbázist,
    // így nem keverednek bele az előző tesztek visszaadott adatai
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('nincs token -> 401 vagy 403', async () => {
        const res = await supertest(app).get('/users');
        expect([401, 403]).toContain(res.statusCode);
    });
    test('rossz token -> 401/403', async () => {
        const res = await supertest(app).get('/users').set('Authorization', 'Bearer nemjó');
        expect([401, 403]).toContain(res.statusCode);
    });
    test('nem admin token -> 403', async () => {
        const res = await supertest(app).get('/users').set('Authorization', `Bearer ${salesToken}`);
        expect(res.statusCode).toBe(403);
    });
    test('admin token -> 200 és helyes body', async () => {
        dbHandler.userTable.findAll.mockResolvedValue([
            { id: 1, name: 'admin' },
            { id: 2, name: 'sales' }
        ]);
        const res = await supertest(app).get('/users').set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('name');
    });
});