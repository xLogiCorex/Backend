const supertest = require('supertest');
const express = require('express');
const dbHandler = require('../dbHandler');
const productsRoute = require('../products');

// Middleware-ek mockolása
jest.mock('../authenticateJWT', () => () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});
jest.mock('../authorizeRole', () => () => (req, res, next) => next());

// DB mockolása
jest.mock('../dbHandler', () => ({
  productTable: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  logTable: {
    create: jest.fn(),
  }
}));

describe('/products végpont tesztelése', () => {
  const app = express();
  app.use(express.json(), productsRoute);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /products
  test('GET /products – 200 OK, visszaadott lista', async () => {
    dbHandler.productTable.findAll.mockResolvedValue([{ name: 'Termék 1', sku: 'SKU1234' }]);
    const res = await supertest(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ name: 'Termék 1', sku: 'SKU1234' }]);
  });

  // POST /products – hiányzó kötelező mező
  test('POST /products – hiányzó mező -> 400', async () => {
    const res = await supertest(app).post('/products').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Kötelező mező/i);
  });

  // POST /products – túl rövid SKU
  test('POST /products – túl rövid SKU -> 400', async () => {
    const res = await supertest(app).post('/products').send({
      newSku: 'A12',
      newName: 'TesztTermék',
      newCategoryId: 1,
      newUnit: 'db',
      newPrice: 100
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/SKU-nak legalább 4 karakter/i);
  });

  // POST /products – túl rövid név
  test('POST /products – túl rövid név -> 400', async () => {
    const res = await supertest(app).post('/products').send({
      newSku: 'SKU1234',
      newName: 'Tes',
      newCategoryId: 1,
      newUnit: 'db',
      newPrice: 100
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/nevének minimum 4 karakter/i);
  });

  // POST /products – létező SKU -> 409
  test('POST /products – létező SKU -> 409', async () => {
    dbHandler.productTable.findOne.mockResolvedValueOnce({ id: 1 }); // SKU létezik
    const res = await supertest(app).post('/products').send({
      newSku: 'SKU1234',
      newName: 'TesztTermék',
      newCategoryId: 1,
      newUnit: 'db',
      newPrice: 100
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/SKU már létezik/i);
  });

  // POST /products – létező név -> 409
  test('POST /products – létező név -> 409', async () => {
    dbHandler.productTable.findOne.mockResolvedValueOnce(null); // SKU nincs
    dbHandler.productTable.findOne.mockResolvedValueOnce({ id: 1 }); // Név létezik
    const res = await supertest(app).post('/products').send({
      newSku: 'SKU1234',
      newName: 'TesztTermék',
      newCategoryId: 1,
      newUnit: 'db',
      newPrice: 100
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/név már létezik/i);
  });

  // POST /products – sikeres létrehozás
  test('POST /products – sikeres létrehozás -> 201', async () => {
    dbHandler.productTable.findOne.mockResolvedValueOnce(null); // SKU nincs
    dbHandler.productTable.findOne.mockResolvedValueOnce(null); // Név nincs
    dbHandler.productTable.create.mockResolvedValue({ id: 1 });
    const res = await supertest(app).post('/products').send({
      newSku: 'SKU1234',
      newName: 'TesztTermék',
      newCategoryId: 1,
      newUnit: 'db',
      newPrice: 100,
      newMinStockLevel: 0
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/sikeresen rögzítve/i);
  });

  // POST /products – adatbázis hiba
  test('POST /products – DB-hiba -> 500', async () => {
    dbHandler.productTable.findOne.mockResolvedValueOnce(null); // SKU nincs
    dbHandler.productTable.findOne.mockResolvedValueOnce(null); // Név nincs
    dbHandler.productTable.create.mockRejectedValue(new Error('DB error'));
    const res = await supertest(app).post('/products').send({
      newSku: 'SKU1234',
      newName: 'TesztTermék',
      newCategoryId: 1,
      newUnit: 'db',
      newPrice: 100,
      newMinStockLevel: 0
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/sikertelen volt/i);
  });
});
