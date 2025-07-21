// subcategories.test.js

const supertest = require('supertest')
const express = require('express')
const dbHandler = require('./dbHandler')
const subcategoriesRoute = require('./subcategories')

// Middleware-ek mockolása
jest.mock('./authenticateJWT', () => () => (req, res, next) => next())
jest.mock('./authorizeRole', () => () => (req, res, next) => next())

// DB mockolása
jest.mock('./dbHandler', () => ({
    subcategoryTable: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    }
}))

describe('/subcategories végpont tesztelése', () => {
    const app = express()
    app.use(express.json(), subcategoriesRoute)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    // GET /subcategories
    test('GET /subcategories – 200 OK, visszaadott lista', async () => {
        dbHandler.subcategoryTable.findAll.mockResolvedValue([{ name: 'Alkategória 1' }])
        const res = await supertest(app).get('/subcategories')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([{ name: 'Alkategória 1' }])
    })

    // POST /subcategories
    test('POST /subcategories – hiányzó mezők -> 400', async () => {
        const res = await supertest(app).post('/subcategories').send({})
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toMatch(/kitöltése kötelező/i)
    })

    test('POST /subcategories – már létező -> 409', async () => {
        dbHandler.subcategoryTable.findOne.mockResolvedValue({ id: 1 })
        const res = await supertest(app).post('/subcategories').send({
        newName: 'Alkategória 1',
        newCategoryId: 1
        })
        expect(res.statusCode).toBe(409)
        expect(res.body.message).toMatch(/már létezik/i)
    })

    test('POST /subcategories – sikeres létrehozás -> 201', async () => {
        dbHandler.subcategoryTable.findOne.mockResolvedValue(null)
        dbHandler.subcategoryTable.create.mockResolvedValue({})
        const res = await supertest(app).post('/subcategories').send({
        newName: 'Új Alkategória',
        newCategoryId: 1
        })
        expect(res.statusCode).toBe(201)
        expect(res.body.message).toMatch(/sikeresen rögzítve/i)
    })

    test('POST /subcategories – DB-hiba -> 500', async () => {
        dbHandler.subcategoryTable.findOne.mockResolvedValue(null)
        dbHandler.subcategoryTable.create.mockRejectedValue(new Error('DB error'))
        const res = await supertest(app).post('/subcategories').send({
        newName: 'Új Alkategória',
        newCategoryId: 1
        })
        expect(res.statusCode).toBe(500)
        expect(res.body.message).toMatch(/sikertelen volt/i)
    })
})
