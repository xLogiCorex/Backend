// partner.test.js

const supertest = require('supertest')
const express = require('express')
const dbHandler = require('./dbHandler')
const partnersRoute = require('./partners')

// Middleware-ek mockolása
jest.mock('./authenticateJWT', () => () => (req, res, next) => next())
jest.mock('./authorizeRole', () => () => (req, res, next) => next())

// DB mockolása
jest.mock('./dbHandler', () => ({
    partnerTable: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    }
}))

describe('/partners végpont tesztelése', () => {
    const app = express()
    app.use(express.json(), partnersRoute)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    // GET /partners
    test('GET /partners – 200 OK, visszaadott lista', async () => {
        dbHandler.partnerTable.findAll.mockResolvedValue([{ name: 'Partner Kft.' }])
        const res = await supertest(app).get('/partners')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([{ name: 'Partner Kft.' }])
    })

    // POST /partners – Hibakezelés
    test('POST /partners – hiányzó mezők -> 400', async () => {
        const res = await supertest(app).post('/partners').send({})
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toMatch(/kitöltése kötelező/i)
    })

    test('POST /partners – túl rövid név -> 401', async () => {
        const res = await supertest(app).post('/partners').send({
        newName: 'Abc',
        newTaxNumber: '12345678-1-12',
        newAddress: 'Cím',
        newContactPerson: 'Név',
        newEmail: 'valami@valami.hu',
        newPhone: '123456789'
        })
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toMatch(/legalább 4 karakter/i)
    })

    test('POST /partners – hibás adószám -> 400', async () => {
        const res = await supertest(app).post('/partners').send({
        newName: 'Partner Kft',
        newTaxNumber: '12345678',
        newAddress: 'Cím',
        newContactPerson: 'Név',
        newEmail: 'email@cég.hu',
        newPhone: '123456789'
        })
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toMatch(/Hibás adószám/i)
    })

    test('POST /partners – hibás email -> 400', async () => {
        const res = await supertest(app).post('/partners').send({
        newName: 'Partner Kft',
        newTaxNumber: '12345678-1-12',
        newAddress: 'Cím',
        newContactPerson: 'Név',
        newEmail: 'nemjó',
        newPhone: '123456789'
        })
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toMatch(/Hibás email/i)
    })

    test('POST /partners – már létezik -> 409', async () => {
        dbHandler.partnerTable.findOne.mockResolvedValue({ id: 1 })
        const res = await supertest(app).post('/partners').send({
        newName: 'Partner Kft',
        newTaxNumber: '12345678-1-12',
        newAddress: 'Cím',
        newContactPerson: 'Név',
        newEmail: 'email@cég.hu',
        newPhone: '123456789'
        })
        expect(res.statusCode).toBe(409)
        expect(res.body.message).toMatch(/már létezik/i)
    })

    test('POST /partners – sikeres létrehozás -> 201', async () => {
        dbHandler.partnerTable.findOne.mockResolvedValue(null)
        dbHandler.partnerTable.create.mockResolvedValue({})
        const res = await supertest(app).post('/partners').send({
        newName: 'Partner Kft',
        newTaxNumber: '12345678-1-12',
        newAddress: 'Cím',
        newContactPerson: 'Név',
        newEmail: 'email@cég.hu',
        newPhone: '123456789'
        })
        expect(res.statusCode).toBe(201)
        expect(res.body.message).toMatch(/sikeresen rögzítve/i)
    })

    test('POST /partners – DB-hiba -> 500', async () => {
        dbHandler.partnerTable.findOne.mockResolvedValue(null)
        dbHandler.partnerTable.create.mockRejectedValue(new Error('DB error'))
        const res = await supertest(app).post('/partners').send({
        newName: 'Partner Kft',
        newTaxNumber: '12345678-1-12',
        newAddress: 'Cím',
        newContactPerson: 'Név',
        newEmail: 'email@cég.hu',
        newPhone: '123456789'
        })
        expect(res.statusCode).toBe(500)
        expect(res.body.message).toMatch(/sikertelen volt/i)
    })
})
