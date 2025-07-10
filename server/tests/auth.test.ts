import { authenticateToken } from '../src/middleware/auth';

describe("Auth routes", () => {
  it("should return 401 if no token is provided", async () => {
    const req = { headers: {} } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Access token is missing" });
    expect(next).not.toHaveBeenCalled();
    
  });
});