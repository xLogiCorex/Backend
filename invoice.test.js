process.env.SECRET = 'teszttitok';

const express = require('express');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
jest.mock('./dbHandler');
const dbHandler = require('./dbHandler');
const invoicesRouter = require('./invoices');

describe('/invoices endpoint tesztek', () => {
    const app = express();
    app.use(express.json());
    app.use(invoicesRouter);

    const adminToken = jwt.sign({ id: 1, email: 'admin@api.hu', role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: 'sales@api.hu', role: 'sales' }, process.env.SECRET, { expiresIn: '1h' });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Admin: GET /invoices - összes számla lekérése (admin token)
    test('GET /invoices – admin token → 200 és tömb', async () => {
        dbHandler.invoiceTable.findAll.mockResolvedValue([{ id: 1, invoiceNumber: 'SZ-2025-00001' }]);
        const res = await supertest(app).get('/invoices').set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('invoiceNumber');
    });

    // Sales: GET /invoices/my - csak saját számlák (sales token)
    test('GET /invoices/my – sales token → 200 és saját számlák', async () => {
        dbHandler.invoiceTable.findAll.mockResolvedValue([{ id: 2, invoiceNumber: 'SZ-2025-00002', userId: 2 }]);
        const res = await supertest(app).get('/invoices/my').set('Authorization', `Bearer ${salesToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('invoiceNumber');
        expect(res.body[0].userId).toBe(2);
    });

    // Nincs token: GET /invoices
    test('GET /invoices – token nélkül → 401', async () => {
        const res = await supertest(app).get('/invoices');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });

    // Nincs token: GET /invoices/my
    test('GET /invoices/my – token nélkül → 401', async () => {
        const res = await supertest(app).get('/invoices/my');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });

    // Jogosultsági hiba: sales token GET /invoices (admin végpont)
    test('GET /invoices – sales token → 403', async () => {
        const res = await supertest(app).get('/invoices').set('Authorization', `Bearer ${salesToken}`);
        expect(res.statusCode).toBe(403);
    });

    // Jogosultsági hiba: admin token GET /invoices/my (sales végpont)
    test('GET /invoices/my – admin token → 403 vagy 401', async () => {
        const res = await supertest(app).get('/invoices/my').set('Authorization', `Bearer ${adminToken}`);
        expect([401, 403]).toContain(res.statusCode);
    });
});
