import request from 'supertest';
// Update the import path if your app file is located elsewhere, e.g. '../app' or '../src/server'
import app from '../src/index';
import prisma from '../src/config/prisma';
import { after } from 'node:test';

describe("Task Routes", () => {  
  afterAll(async () => {
    // Clean up: disconnect Prisma
    await prisma.$disconnect();
  });

  let token: string;

  beforeAll(async () => {
  // 1. Clean up
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // 2. Register new user
  const registerRes = await request(app)
    .post('/api/account/register')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });
  console.log('Register response:', registerRes.body);
  expect(registerRes.status).toBe(201);

  // 3. Login new user
  const loginRes = await request(app)
    .post('/api/account/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });

  expect(loginRes.status).toBe(200);
  token = loginRes.body.token;

  // 4. Fetch the new user ID
  const user = registerRes.body;
  expect(user).not.toBeNull();
});

  it("should create task", async () => {
    const auth = 'Bearer ' + token;
    const res = await request(app)
      .post("/api/tasks/create")
      .set('Authorization', auth)
      .send({
        title: "Test Task",
        description: "This is a test task",
      })
      expect(res.status).toBe(201);
      


  });
  
});