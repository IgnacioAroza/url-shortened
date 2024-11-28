import { authMiddleware } from '../../../http/middlewares/auth';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let middleware: ReturnType<typeof authMiddleware>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn()
    } as jest.Mocked<UserRepository>;

    mockRequest = {
      header: jest.fn()
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    nextFunction = jest.fn();

    middleware = authMiddleware(mockUserRepository);
  });

  it('should authenticate valid token', async () => {
    const token = 'valid.jwt.token';
    const mockUser: User = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      };
    
    (mockRequest.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.id });
    mockUserRepository.findById.mockResolvedValue(mockUser);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockRequest.user).toEqual({ id: mockUser.id });
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 when no token is provided', async () => {
    (mockRequest.header as jest.Mock).mockReturnValue(undefined);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Please authenticate yourself'
    });
  });

  it('should return 401 when token is invalid', async () => {
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer invalid.token');
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Please authenticate yourself'
    });
  });

  it('should return 401 when user is not found', async () => {
    const token = 'valid.jwt.token';
    (mockRequest.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'nonexistent' });
    mockUserRepository.findById.mockResolvedValue(null);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Please authenticate yourself'
    });
  });
});