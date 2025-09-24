const supertest = require('supertest')
const express = require('express')
const dbHandler = require('../dbHandler')
const categoriesRoute = require('../categories')

// Middleware-ek mockolása
jest.mock('../authenticateJWT', () => () => (req, res, next) => {
  req.user = { id: 1 }; 
  next();
});
jest.mock('../authorizeRole', () => () => (req, res, next) => next())

// DB mockolása
jest.mock('../dbHandler', () => ({
  categoryTable: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  logTable: {
    create: jest.fn()
  }
}))

// /categories végpont tesztelése
describe('/categories végpont tesztelése', () => {
  const app = express()
  app.use(express.json(), categoriesRoute)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // GET /categories
  test('GET /categories – 200 OK, visszaadott lista', async () => {
    dbHandler.categoryTable.findAll.mockResolvedValue([{ name: 'Kategória 1' }])
    const res = await supertest(app).get('/categories')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ name: 'Kategória 1' }])
  })

  // POST /categories hiányzó mező
  test('POST /categories – hiányzó mező -> 400', async () => {
    const res = await supertest(app).post('/categories').send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/kategória nevét/i)
  })

  // POST /categories már létező kategória
  test('POST /categories – már létező kategória -> 409', async () => {
    dbHandler.categoryTable.findOne.mockResolvedValue({ id: 1 })
    const res = await supertest(app).post('/categories').send({ newName: 'Kategória 1' })
    expect(res.statusCode).toBe(409)
    expect(res.body.message).toMatch(/már létezik/i)
  })

  // POST /categories sikeres létrehozás
  test('POST /categories – sikeres létrehozás -> 201', async () => {
    dbHandler.categoryTable.findOne.mockResolvedValue(null)
    dbHandler.categoryTable.create.mockResolvedValue({ id: 1 })
    const res = await supertest(app).post('/categories').send({ newName: 'Új Kategória' })
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toMatch(/sikeresen rögzítve/i)
  })

  // POST /categories adatbázis hiba
  test('POST /categories – DB-hiba -> 500', async () => {
    dbHandler.categoryTable.findOne.mockResolvedValue(null)
    dbHandler.categoryTable.create.mockRejectedValue(new Error('DB error'))
    const res = await supertest(app).post('/categories').send({ newName: 'Új Kategória' })
    expect(res.statusCode).toBe(500)
    expect(res.body.message).toMatch(/sikertelen volt/i)
  })
})
