process.env.SECRET = 'teszttitok';
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => {
    return {
      pipe: jest.fn(),
      fontSize: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
  });
});
const express = require('express');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../dbHandler');
const dbHandler = require('../dbHandler');
const invoicesRouter = require('../invoices');

describe('/invoices endpoint tesztek', () => {
    const app = express();
    app.use(express.json());
    app.use(invoicesRouter);

    const adminToken = jwt.sign({ id: 1, email: 'admin@api.hu', role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: 'sales@api.hu', role: 'sales' }, process.env.SECRET, { expiresIn: '1h' });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /invoices – sales token → 200 és csak saját számlák', async () => {
        const salesUserId = 2; // például sales user id
        dbHandler.invoiceTable.findAll.mockImplementation(({ where }) => {
            expect(where).toEqual({ userId: salesUserId }); // ellenőrizzük, hogy szűr-e user-re
            return Promise.resolve([{ id: 10, invoiceNumber: 'SZ-2025-00010', user: salesUserId }]);
        });

        const res = await supertest(app) .get('/invoices').set('Authorization', `Bearer ${salesToken}`); // sales token, amelynek userId=2
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.every(inv => inv.user === salesUserId)).toBe(true);
        expect(res.body[0]).toHaveProperty('invoiceNumber');
    });

    //
    test('GET /invoices – admin token → 200 és tömb', async () => {
        dbHandler.invoiceTable.findAll.mockResolvedValue([{ id: 1, invoiceNumber: 'SZ-2025-00001' }]);

        const res = await supertest(app) .get('/invoices') .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('invoiceNumber');
    });

    // Nincs token: GET /invoices
    test('GET /invoices – token nélkül → 401', async () => {
        const res = await supertest(app).get('/invoices');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });
});
