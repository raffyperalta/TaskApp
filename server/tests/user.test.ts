import request from 'supertest';
// Update the import path if your app file is located elsewhere, e.g. '../app' or '../src/server'
import app from '../src/index';
import prisma from '../src/config/prisma';

describe("User Routes", () => {
  
  afterAll(async () => {
    // Clean up: disconnect Prisma
    // await prisma.user.deleteMany();
    // await prisma.task.deleteMany();
    await prisma.$disconnect();
  });
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  // beforeEach(async () => {
  //   // Wipe all rows in all tables you want to clean
  //   await prisma.task.deleteMany();
  //   await prisma.user.deleteMany();
  //   // Add more as needed
  // })

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/account/register")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should login an existing user", async () => {
    // First, create a user
    await request(app)
      .post("/api/account/register")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/account/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });
      expect(res.status).toBe(200);
    });

  it("should return 401 for invalid login", async () => {
    await request(app)
      .post("/api/account/register")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/account/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword",
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });


  it("should modify user password", async () => {
    // First, create a user
    await request(app)
      .post("/api/account/register")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    const loginCreds = await request(app)
      .post("/api/account/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    const token = loginCreds.body.token;
    const id = loginCreds.body.user.id;
    const res = await request(app)
      .patch("/api/account/modifypassword/"+id)
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "password123",
        newPassword: "newpassword456",
      });
    
    expect(res.status).toBe(200);
  });
});