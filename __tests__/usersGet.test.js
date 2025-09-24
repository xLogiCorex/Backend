process.env.SECRET = "teszttitok";

const supertest = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
jest.mock('../dbHandler');
const dbHandler = require('../dbHandler');


const usersGetTest = require('../users');
describe('/users végpont tesztelése', () => {

    const app = express();
    app.use(express.json(), usersGetTest);

    const adminToken = jwt.sign({ id: 1, email: "admin@teszt.hu", role: "admin" }, process.env.SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 2, email: "user@teszt.hu", role: "sales" }, process.env.SECRET, { expiresIn: '1h' });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // GET users nincs token
    test('nincs token -> 401 vagy 403', async () => {
        const res = await supertest(app).get('/users');
        expect([401, 403]).toContain(res.statusCode);
    });

    // GET users rossz token
    test('rossz token -> 401/403', async () => {
        const res = await supertest(app).get('/users').set('Authorization', 'Bearer nemjó');
        expect([401, 403]).toContain(res.statusCode);
    });

    // GET users nem admin token
    test('nem admin token -> 403', async () => {
        const res = await supertest(app).get('/users').set('Authorization', `Bearer ${salesToken}`);
        expect(res.statusCode).toBe(403);
    });

    // GET users admin token
    test('admin token -> 200 és helyes body', async () => {
        dbHandler.userTable.findAll.mockResolvedValue([
            { id: 1, name: 'admin' },
            { id: 2, name: 'sales' }
        ]);
        const res = await supertest(app).get('/users').set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('name');
    });

    // PUT /users/:id/status érvénytelen isActive típus
    test('PUT /users/:id/status - érvénytelen isActive típus -> 400', async () => {
        const res = await supertest(app).put('/users/1/status').set('Authorization', `Bearer ${adminToken}`).send({ isActive: 'nemboolean' });
        expect(res.statusCode).toBe(400);
    });

    // PUT /users/:id/status nem létező user
    test('PUT /users/:id/status - nem létező user -> 404', async () => {
        dbHandler.userTable.findByPk.mockResolvedValue(null);
        const res = await supertest(app).put('/users/999/status').set('Authorization', `Bearer ${adminToken}`).send({ isActive: true });
        expect(res.statusCode).toBe(404);
    });

    // PUT /users/:id/status sikeres státusz váltás
    test('PUT /users/:id/status - sikeres státuszváltás -> 200', async () => {
        const mockUser = { id: 1, isActive: true, save: jest.fn().mockResolvedValue(true) };
        dbHandler.userTable.findByPk.mockResolvedValue(mockUser);

        const res = await supertest(app).put('/users/1/status').set('Authorization', `Bearer ${adminToken}`).send({ isActive: false });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/inaktiválva/i);
        expect(mockUser.isActive).toBe(false);
        expect(mockUser.save).toHaveBeenCalled();
    });
});