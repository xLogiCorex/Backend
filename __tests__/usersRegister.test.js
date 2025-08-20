process.env.SECRET = "teszttitok";

const supertest = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const dbHandler = require('../dbHandler');
const usersRouter = require('../users'); // a router fájlod neve

jest.mock('../dbHandler');

describe('/register végpont tesztelése', () => {
  const app = express();
  app.use(express.json());
  app.use(usersRouter);

  const adminToken = jwt.sign({ id: 1, email: "admin@teszt.hu", role: "admin" }, process.env.SECRET, { expiresIn: '1h' });
  const salesToken = jwt.sign({ id: 2, email: "user@teszt.hu", role: "sales" }, process.env.SECRET, { expiresIn: '1h' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('nincs token -> 401/403', async () => {
    const res = await supertest(app).post('/register').send({});
    expect([401, 403]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/token|jogosultság|hitelesítés/i);
  });

  test('rossz token -> 401/403', async () => {
    const res = await supertest(app).post('/register').set('Authorization', 'Bearer nemjó').send({});
    expect([401, 403]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/token|érvénytelen|hitelesítés/i);
  });

  test('nem admin token -> 403', async () => {
    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${salesToken}`).send({});
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/jogosultság|admin/i);
  });

  test('hiányzó mezők -> 400', async () => {
    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`).send({ newEmail: 'a@b.hu', newPassword: 'pw123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/mező/);
  });

  test('túl rövid név -> 400', async () => {
    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`).send({ newName: 'ab', newEmail: 'a@b.hu', newPassword: 'pw123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/karakter/);
  });

  test('hibás email formátum -> 400', async () => {
    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
      .send({ newName: 'TesztNév', newEmail: 'invalid-email', newPassword: 'pw123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email formátum/i);
  });

  test('már létező email -> 409', async () => {
    dbHandler.userTable.findOne.mockImplementation(({ where }) => {
      if (where.email) return Promise.resolve({ id: 'valami' });
      return Promise.resolve(null);
    });

    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
      .send({ newName: 'tesztnev', newEmail: 'admin@teszt.hu', newPassword: 'pw123' });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/regisztráció.*e-mail/i);
  });

  test('sikeres regisztráció -> 201', async () => {
    dbHandler.userTable.findOne.mockResolvedValue(null);
    dbHandler.userTable.create.mockResolvedValue({
      id: 42,
      name: 'sosevoltilyen',
      email: 'teszt@egyedi.hu',
      role: 'admin',
      isActive: true
    });

    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
      .send({
        newName: 'sosevoltilyen',
        newEmail: 'teszt@egyedi.hu',
        newPassword: 'tesztpw123',
        newRole: 'admin' + process.env.SECRET,
        newIsActive: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/sikeres/i);
  });

  test('DB hiba esetén -> 500', async () => {
    dbHandler.userTable.findOne.mockResolvedValue(null);
    dbHandler.userTable.create.mockRejectedValue(new Error("DB hiba"));

    const res = await supertest(app).post('/register').set('Authorization', `Bearer ${adminToken}`)
      .send({
        newName: 'tesztuser',
        newEmail: 'teszt@valami.hu',
        newPassword: 'tesztpw123',
        newRole: 'admin' + process.env.SECRET,
        newIsActive: true
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/hiba történt/i);
  });
});
