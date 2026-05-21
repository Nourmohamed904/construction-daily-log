const request = require('supertest');
const app = require('../src/index');
const pool = require('../src/db/db');

beforeAll(async () => {
  await pool.query('DELETE FROM daily_reports');
  await pool.query('DELETE FROM users');
}, 15000);

afterAll(async () => {
  await pool.query('DELETE FROM daily_reports');
  await pool.query('DELETE FROM users');
}, 15000);

describe('Auth Endpoints', () => {

  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        role: 'manager'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@test.com');
  });

  test('POST /api/auth/register - should fail if user already exists', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        role: 'manager'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  test('POST /api/auth/login - should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

});