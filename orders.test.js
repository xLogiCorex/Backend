process.env.SECRET = 'teszttitok';

const express = require('express');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
jest.mock('./dbHandler');
const dbHandler = require('./dbHandler');
const ordersRouter = require('./orders'); // a te routered neve lehet más, írd be helyesen!

describe('/orders endpoint tesztek', () => {
    const app = express();
    app.use(express.json());
    app.use(ordersRouter);

    // Test tokenek
    const adminToken = jwt.sign({id: 1, email: "admin@api.hu", role: "admin"}, process.env.SECRET, {expiresIn: '1h'});
    const salesToken = jwt.sign({id: 2, email: "sales@api.hu", role: "sales"}, process.env.SECRET, {expiresIn: '1h'});


    beforeEach(() => {
        jest.clearAllMocks();
    });



    test('GET /orders – nincs token → 401/403', async () => {
        const res = await supertest(app).get('/orders');
        expect([401,403]).toContain(res.statusCode);
    });

 

    test('GET /orders – sales token → 200 és tömb', async () => {
        dbHandler.partnerTable.findAll.mockResolvedValue([{id: 1, company: "Cég", orderNumber: "A123"}]);
        const res = await supertest(app).get('/orders').set('Authorization', `Bearer ${salesToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /orders – admin token → 200 és tömb', async () => {
        dbHandler.partnerTable.findAll.mockResolvedValue([{id: 1, company: "Cég2", orderNumber: "B456"}]);
        const res = await supertest(app).get('/orders').set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });


    test('POST /orders – nincs token → 401/403', async () => {
        const res = await supertest(app).post('/orders').send({});
        expect([401,403]).toContain(res.statusCode);
    });

    test('POST /orders – hiányzik kötelező mező → 400', async () => {
        const res = await supertest(app)
            .post('/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ newOrder: 'ORD-42', newUser: 'user-uuid' }); // newPartner kimarad
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/mező/);
    });

    test('POST /orders – duplikált orderszám → 409', async () => {
        dbHandler.orderTable.findOne.mockResolvedValue({id: 888, orderNumber: 'ORD-42'});
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
});
