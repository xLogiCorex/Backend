process.env.SECRET = "teszttitok";

const express = require('express');
const request = require('supertest'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
jest.mock('../dbHandler');
jest.mock('../log', () => ({
    logAction: jest.fn(() => Promise.resolve())
}));
const dbHandler = require('../dbHandler');
const usersLoginTest = require('../users');

describe('/login végpont tesztelése', () => {
    const app = express();
    app.use(express.json(), usersLoginTest);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // POST /login nincs adat
    test('ha egyáltalán nem adunk meg adatot', async () => {
        const res = await request(app).post('/login').send({});
        expect([400, 401]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
    });

    // POST /login hibás email
    test('hibás email', async () => {
        dbHandler.userTable.findOne.mockResolvedValue(null);
        const res = await request(app).post('/login').send({
            newEmail: "nemletezo@teszt.hu",
            newPassword: "valami"
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/nem található/i);
    });

    // POST /login jó email. rossz jelszó
    test('jó az email, de rossz a jelszó', async () => {
        const hash = await bcrypt.hash('helyesjelszo', 10);
        dbHandler.userTable.findOne.mockResolvedValue({
            id: 5,
            email: "user@teszt.hu",
            password: hash,
            role: "user"
        });
        const res = await request(app).post('/login').send({
            newEmail: "user@teszt.hu",
            newPassword: "rossz" 
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/helytelen/i);
    });

    // POST /login sikeres belépés
    test('sikeres login működjön', async () => {
        const hash = await bcrypt.hash('titok', 10);
        dbHandler.userTable.findOne.mockResolvedValue({
            id: 1,
            email: "igyvan@teszt.hu",
            password: hash,
            role: "admin"
        });
        const res = await request(app).post('/login').send({
            newEmail: "igyvan@teszt.hu",
            newPassword: "titok"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('role', 'admin');
        expect(res.body).toHaveProperty('message');
    });

    // POST /login adatbázis hiba
    test('ha hibát (pl. adatbázis lehalást) szimulálunk', async () => {
        dbHandler.userTable.findOne.mockRejectedValue(new Error("DB off"));
        const res = await request(app).post('/login').send({
            newEmail: "barki@pelda.hu",
            newPassword: "barmi"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
    });

    // POST /login token adatok
    test('a tokenben megfelelő user adatok legyenek', async () => {
        const hash = await bcrypt.hash('titok', 10);
        dbHandler.userTable.findOne.mockResolvedValue({
            id: 1,
            email: "igyvan@teszt.hu",
            password: hash,
            role: "admin"
        });
        const res = await request(app).post('/login').send({
            newEmail: "igyvan@teszt.hu",
            newPassword: "titok"
        });
        const decoded = jwt.decode(res.body.token);
        expect(decoded).toHaveProperty('id', 1);
        expect(decoded).toHaveProperty('email', "igyvan@teszt.hu");
        expect(decoded).toHaveProperty('role', "admin");
    });

    // GET /users nincs Authorization header
    test('nincs Authorization header (nincs token)', async () => {
        const res = await request(app).get('/users');
        expect([401]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/token|jogosultság|hitelesítés/i);
    });

    // GET /users rossz Bearer token (nem JWT)
    test('rossz Bearer token (nem JWT)', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer eznemjwt');
        expect([403]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/token|érvénytelen|hitelesítés/i);
    });

    // GET /users lejárt JWT token
    test('lejárt JWT token', async () => {
        const expiredToken = jwt.sign(
            { id: 1, email: 'admin@teszt.hu', role: 'admin' },
            process.env.SECRET,
            { expiresIn: -10 }
        );
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect([403]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/lejárt|expire|token/i);
    });

    // GET /users manipulált token
    test('manipulált token (mással aláírva)', async () => {
        const fakeToken = jwt.sign(
            { id: 1, email: 'admin@teszt.hu', role: 'admin' },
            'NEMEZATITKOS',
            { expiresIn: '1h' }
        );
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect([403]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(/érvénytelen|hitelesítés|token/i);
    });
});