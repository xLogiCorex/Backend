process.env.SECRET = 'teszttitok';

const express = require('express');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
jest.mock('../dbHandler');
const dbHandler = require('../dbHandler');
const ordersRoute = require('../orders');

describe('/orders endpoint tesztek', () => {
    const app = express();
    app.use(express.json());
    app.use(ordersRoute);

    // Test tokenek
    const adminToken = jwt.sign({ id: 1, email: "admin@api.hu", role: "admin" }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: "sales@api.hu", role: "sales" }, process.env.SECRET, { expiresIn: '1h' });


    beforeEach(() => {
        jest.clearAllMocks();
    });

    // GET /orders nincs token
    test('GET /orders – nincs token → 401/403', async () => {
        const res = await supertest(app).get('/orders');
        expect([401, 403]).toContain(res.statusCode);
    });

    // GET /orders sales token
    test('GET /orders – sales token → 200 és tömb', async () => {
        dbHandler.partnerTable.findAll.mockResolvedValue([{ id: 1, company: "Cég", orderNumber: "A123" }]);
        const res = await supertest(app).get('/orders').set('Authorization', `Bearer ${salesToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // GET /orders admin token
    test('GET /orders – admin token → 200 és tömb', async () => {
        dbHandler.partnerTable.findAll.mockResolvedValue([{ id: 1, company: "Cég2", orderNumber: "B456" }]);
        const res = await supertest(app).get('/orders').set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // GET /orders hiányzó Authorization header
    test('GET /orders – hiányzó Authorization header → 401', async () => {
        const res = await supertest(app).get('/orders');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });

    // GET /orders rossz formátumú Authorization header (nem Bearer)
    test('GET /orders – rossz formátumú Authorization header (nem Bearer) → 401', async () => {
        const res = await supertest(app)
            .get('/orders')
            .set('Authorization', 'WrongFormat token');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });

    // GET /orders hibás Bearer token (nem JWT)
    test('GET /orders – hibás Bearer token (nem JWT) → 401', async () => {
        const res = await supertest(app)
            .get('/orders')
            .set('Authorization', 'Bearer eznemjwt');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/érvénytelen|hibás|token/i);
    });

    // GET /orders érvénytelen JTW token
    test('GET /orders – manipulált vagy érvénytelen JWT token → 401', async () => {
        const fakeToken = jwt.sign({ id: 1, email: "admin@api.hu", role: "admin" }, 'rosszsecret', { expiresIn: '1h' });
        const res = await supertest(app)
            .get('/orders')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/érvénytelen|hibás|token/i);
    });

    // GET /orders lejárt JTW token
    test('GET /orders – lejárt JWT token → 401', async () => {
        const expiredToken = jwt.sign({ id: 1, email: "admin@api.hu", role: "admin" }, process.env.SECRET, { expiresIn: '1ms' });
        await new Promise(r => setTimeout(r, 10));
        const res = await supertest(app)
            .get('/orders')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/lejárt|expire|token/i);
    });

    // POST /orders nincs token
    test('POST /orders – nincs token → 401/403', async () => {
        const res = await supertest(app).post('/orders').send({});
        expect([401, 403]).toContain(res.statusCode);
    });

    // POST /orders hiányzó mezők
    test('POST /orders – hiányzik a kötelező mező → 400', async () => {
        const res = await supertest(app)
            .post('/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newOrder: 'ORD-42', newUser: 'user-uuid' }); // newPartner kimarad
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/mező/);
    });

    // POST /orders duplikált orderszám
    test('POST /orders – duplikált orderszám → 409', async () => {
        dbHandler.orderTable.findOne.mockResolvedValue({ id: 888, orderNumber: 'ORD-42' });
        const res = await supertest(app)
            .post('/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newOrder: 'ORD-42',
                newPartner: 2,
                newUser: 'user-uuid',
                newDate: '2024-07-19',
                newStatus: 'new'
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toMatch(/rendelés.*létezik/i);
    });

    // POST /orders sales token
    test('POST /orders – sales token, sikeres → 201', async () => {
        dbHandler.orderTable.findOne.mockResolvedValue(null);
        dbHandler.orderTable.create.mockResolvedValue({
            orderNumber: 'ORD-678',
            partner: 2,
            user: 'user-uuid',
            date: '2024-07-20',
            status: 'new'
        });
        const res = await supertest(app)
            .post('/orders')
            .set('Authorization', `Bearer ${salesToken}`)
            .send({
                newOrder: 'ORD-678',
                newPartner: 2,
                newUser: 'user-uuid',
                newDate: '2024-07-20',
                newStatus: 'fulfilled'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/sikeresen/i);
    });

    // POST /orders admin token
    test('POST /orders – admin token, adatbázishiba → 500', async () => {
        dbHandler.orderTable.findOne.mockResolvedValue(null);
        dbHandler.orderTable.create.mockRejectedValue(new Error("DB lehalt"));
        const res = await supertest(app)
            .post('/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                newOrder: 'ORD-900',
                newPartner: 3,
                newUser: 'user-uuid',
                newDate: '2024-07-22',
                newStatus: 'fulfilled'
            });
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toMatch(/sikertelen|hiba/i);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // PUT /orders/:id/status nincs token
    test('PUT /orders/:id/status – nincs token → 401/403', async () => {
        const res = await supertest(app)
            .put('/orders/1/status')
            .send({ newStatus: 'completed' });
        expect([401, 403]).toContain(res.statusCode);
    });

    // PUT /orders/:id/status érvénytelen státusz
    test('PUT /orders/:id/status – érvénytelen státusz megadása → 400', async () => {
        const res = await supertest(app)
            .put('/orders/1/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newStatus: 'invalid' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/completed|cancelled|csak/i);
    });

    // PUT /orders/:id/status nem létező rendelés
    test('PUT /orders/:id/status – nem létező rendelés → 404', async () => {
        dbHandler.orderTable.findByPk.mockResolvedValue(null);
        const res = await supertest(app)
            .put('/orders/999/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newStatus: 'completed' });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/nem található/i);
    });

    // PUT /orders/:id/status sikeres frissítés
    test('PUT /orders/:id/status – sikeres frissítés completed státusszal → 200', async () => {
        const orderMock = {
            id: 1,
            invoiceId: null,
            partnerId: 1,
            userId: 1,
            status: 'new',
            save: jest.fn().mockImplementation(function () {
                this.status = 'completed';
                return Promise.resolve();
            }),
        };
        dbHandler.orderTable.findByPk.mockResolvedValue(orderMock);

        dbHandler.orderItemTable.findAll.mockResolvedValue([
            { productId: 1, quantity: 2, unitPrice: 100 }
        ]);
        dbHandler.productTable.findAll.mockResolvedValue([
            { id: 1, name: "TesztTermék" }
        ]);
        dbHandler.invoiceTable.findOne.mockResolvedValue(null);
        dbHandler.invoiceTable.create.mockResolvedValue({
            id: 123,
            invoiceNumber: "SZ-2025-00001"
        });

        const res = await supertest(app)
            .put('/orders/1/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newStatus: 'completed' });

        expect(orderMock.status).toBe('completed');
        expect(orderMock.save).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/sikeresen|módosítva/i);
    });

    // PUT /orders/:id/status adatbázishiba save közben
    test('PUT /orders/:id/status – adatbázishiba save közben → 500', async () => {
        const orderMock = {
            id: 1,
            invoiceId: null,
            status: 'new',
            save: jest.fn().mockRejectedValue(new Error('DB hiba a mentéskor')),
        };
        dbHandler.orderTable.findByPk.mockResolvedValue(orderMock);

        const res = await supertest(app)
            .put('/orders/1/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newStatus: 'completed' });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toMatch(/hiba/i);
    });

    // PUT /orders/:id/status nem new státuszú rendelés frissítése
    test('PUT /orders/:id/status – nem new státuszú rendelés frissítése → 400', async () => {
        const orderMock = {
            id: 1,
            invoiceId: null,
            status: 'completed',
            save: jest.fn(),
        };
        dbHandler.orderTable.findByPk.mockResolvedValue(orderMock);

        const res = await supertest(app)
            .put('/orders/1/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newStatus: 'cancelled' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/csak "new" státuszú rendelés/i);
        expect(orderMock.save).not.toHaveBeenCalled();
    });

    // PUT /orders/:id/status rendeléshez már készült számla
    test('PUT /orders/:id/status – rendeléshez már készült számla → 400', async () => {
        const orderMock = {
            id: 1,
            invoiceId: 123,
            status: 'new',
            save: jest.fn(),
        };
        dbHandler.orderTable.findByPk.mockResolvedValue(orderMock);

        const res = await supertest(app)
            .put('/orders/1/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newStatus: 'completed' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/már készült számla/i);
        expect(orderMock.save).not.toHaveBeenCalled();
    });
});