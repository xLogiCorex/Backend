process.env.SECRET = 'teszttitok';

const supertest = require('supertest')
const express = require('express')
const dbHandler = require('../dbHandler')
const invoicesRoute = require('../invoices')


// PDF kit mockolása
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

// DB mockolása
jest.mock('../dbHandler');
const dbHandler = require('../dbHandler');
const invoicesRouter = require('../invoices');

describe('/invoices endpoint tesztek', () => {
    const app = express();
    app.use(express.json());
    app.use(invoicesRoute);

    const adminToken = jwt.sign({ id: 1, email: 'admin@api.hu', role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: 'sales@api.hu', role: 'sales' }, process.env.SECRET, { expiresIn: '1h' });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // GET /invoices sales token
    test('GET /invoices – sales token → 200 és csak saját számlák', async () => {
        const salesUserId = 2; 
        dbHandler.invoiceTable.findAll.mockImplementation(({ where }) => {
            expect(where).toEqual({ userId: salesUserId }); 
            return Promise.resolve([{ id: 10, invoiceNumber: 'SZ-2025-00010', user: salesUserId }]);
        });

        const res = await supertest(app) .get('/invoices').set('Authorization', `Bearer ${salesToken}`); 
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.every(inv => inv.user === salesUserId)).toBe(true);
        expect(res.body[0]).toHaveProperty('invoiceNumber');
    });

    // GET /invoices admin token
    test('GET /invoices – admin token → 200 és tömb', async () => {
        dbHandler.invoiceTable.findAll.mockResolvedValue([{ id: 1, invoiceNumber: 'SZ-2025-00001' }]);

        const res = await supertest(app) .get('/invoices') .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('invoiceNumber');
    });

    // GET /invoices nincs token
    test('GET /invoices – token nélkül → 401', async () => {
        const res = await supertest(app).get('/invoices');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });
});
