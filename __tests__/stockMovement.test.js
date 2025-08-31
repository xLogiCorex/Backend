const supertest = require('supertest');
const express = require('express');
const dbHandler = require('../dbHandler');
const stockMovementsRouter = require('../stockMovements'); // Az általad megadott router fájl neve

// Middleware mockolás (auth, jogosultság)
jest.mock('../authenticateJWT', () => () => (req, res, next) => {
    req.user = { id: 1, role: 'admin' }; // Ez a minimum, ami minden logoláshoz szükséges
    next();
});
jest.mock('../authorizeRole', () => () => (req, res, next) => next());

// DB mockolása
jest.mock('../dbHandler', () => ({
    productTable: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn() // lehet, hogy nem globális, hanem instance metódus, lásd lentebb!
    },
    stockMovementTable: {
        findOne: jest.fn(),
        findAll: jest.fn(),  // ha listázod a mozgásokat!
        create: jest.fn()
    },
    logTable: {
        create: jest.fn()
    },
    sequelize: {
        transaction: jest.fn().mockImplementation(() => Promise.resolve({
            commit: jest.fn().mockResolvedValue(),
            rollback: jest.fn().mockResolvedValue()
        }))
    }
}));


describe('/stockMovements végpontok tesztelése', () => {
    const app = express();
    app.use(express.json());
    app.use(stockMovementsRouter);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /stockMovements/in', () => {
        test('Hiányzó productId vagy quantity -> 400', async () => {
            const res = await supertest(app).post('/stockMovements/in').send({productId:1});
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/hiányzó/i);
        });

        test('Pozitív mennyiség kell -> 400', async () => {
            const res = await supertest(app).post('/stockMovements/in').send({ productId: 1, quantity: -2 });
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/pozitív/i);
        });

        test('Nem létező termék -> 404', async () => {
            dbHandler.productTable.findByPk.mockResolvedValue(null);
            const res = await supertest(app).post('/stockMovements/in').send({ productId: 999, quantity: 10 });
            expect(res.status).toBe(404);
        });

        test('Sikeres bevételezés -> 201', async () => {
            dbHandler.productTable.findByPk.mockResolvedValue({
                availableStock: 5,
                stockQuantity: 5,
                update: jest.fn().mockResolvedValue()
            });
            dbHandler.stockMovementTable.findOne.mockResolvedValue({ id: 1 });
            dbHandler.stockMovementTable.create.mockResolvedValue({ id: 2 });
            dbHandler.logTable.create.mockResolvedValue({});
            const res = await supertest(app).post('/stockMovements/in').send({ productId: 1, quantity: 10, note: "Teszt" });
            expect(res.status).toBe(201);
            expect(res.body.message).toMatch(/rögzítve/i);
            expect(dbHandler.productTable.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(dbHandler.stockMovementTable.create).toHaveBeenCalled();
            expect(dbHandler.logTable.create).toHaveBeenCalled();
        });
    });

    describe('POST /stockMovements/out', () => {
        test('Nincs elég készlet -> 400', async () => {
            dbHandler.productTable.findByPk.mockResolvedValue({
                availableStock: 2,
                update: jest.fn().mockResolvedValue()
            });
            const res = await supertest(app).post('/stockMovements/out').send({ productId: 1, quantity: 3 });
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/nincs elegendő készlet/i);
        });

        test('Sikeres készletkivétel -> 201', async () => {
            dbHandler.productTable.findByPk.mockResolvedValue({
                availableStock: 5,
                stockQuantity: 5,
                update: jest.fn().mockResolvedValue()
            });
            dbHandler.stockMovementTable.findOne.mockResolvedValue({ id: 1 });
            dbHandler.stockMovementTable.create.mockResolvedValue({ id: 2 });
            dbHandler.logTable.create.mockResolvedValue({});
            const res = await supertest(app).post('/stockMovements/out').send({ productId: 1, quantity: 3, note: "Kivétel teszt" });
            expect(res.status).toBe(201);
            expect(res.body.message).toMatch(/rögzítve/i);
            expect(dbHandler.stockMovementTable.create).toHaveBeenCalled();
            expect(dbHandler.logTable.create).toHaveBeenCalled();
        });
    });

    describe('POST /stockMovements/transfer', () => {
        test('Nincs elég készlet áthelyezéshez -> 400', async () => {
            dbHandler.productTable.findByPk.mockResolvedValue({
                availableStock: 2,
                update: jest.fn().mockResolvedValue()
            });
            const res = await supertest(app).post('/stockMovements/transfer').send({ productId: 1, quantity: 3, transferReason: 'Raktárváltás' });
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/nincs elegendő készlet/i);
        });

        test('Sikeres áthelyezés -> 201', async () => {
            dbHandler.productTable.findByPk.mockResolvedValue({
                availableStock: 10,
                update: jest.fn().mockResolvedValue()  // update nem szükséges áthelyezéskor, de mockold, ha a kód hívja
            });
            dbHandler.stockMovementTable.findOne.mockResolvedValue({ id: 1 });
            dbHandler.stockMovementTable.create.mockResolvedValue({ id: 2 });
            dbHandler.logTable.create.mockResolvedValue({});
            const res = await supertest(app).post('/stockMovements/transfer').send({ productId: 1, quantity: 5, transferReason: 'Raktárváltás' });
            expect(res.status).toBe(201);
            expect(res.body.message).toMatch(/rögzítve/i);
            expect(dbHandler.stockMovementTable.create).toHaveBeenCalled();
            expect(dbHandler.logTable.create).toHaveBeenCalled();
        });
    });
});
