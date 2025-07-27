// products.test.js - termékek kezelésének tesztelése

const express = require('express');
const request = require('supertest');
jest.mock('./dbHandler');
const dbHandler = require('./dbHandler');
const productsTest = require('./products');

describe('/products végpont tesztelése', () => {
    const app = express()
    app.use(express.json(), productsTest)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('helyes GET', async () => {
        dbHandler.productTable.findAll.mockResolvedValue([{ name: 'Genius NX-7005 Black' }])
        const res = await request(app).get('/products').send()
        expect(res.statusCode).toBe(200)
    })


})