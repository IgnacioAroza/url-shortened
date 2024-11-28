import { UserController } from '../../../http/controllers/UserController';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserController', () => {
    let userController: UserController;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUserRepository = {
          save: jest.fn(),
          findByEmail: jest.fn(),
          findById: jest.fn()
        } as jest.Mocked<UserRepository>;
    
        userController = new UserController(mockUserRepository);
    
        mockRequest = {
          body: {}
        };
    
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
      });
    
      describe('register', () => {
        it('should register a user successfully', async () => {
          mockRequest.body = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          };
    
          await userController.register(
            mockRequest as Request,
            mockResponse as Response
          );
    
          expect(mockResponse.status).toHaveBeenCalledWith(201);
          expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
              userId: expect.any(String)
            })
          );
        });
    
        it('should handle registration error', async () => {
          mockUserRepository.save.mockRejectedValue(new Error('Database error'));
    
          await userController.register(
            mockRequest as Request,
            mockResponse as Response
          );
    
          expect(mockResponse.status).toHaveBeenCalledWith(500);
          expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Error when registering the user'
          });
        });
      });
    
      describe('login', () => {
        it('should login user successfully', async () => {
          const mockUser = {
            id: '1',
            username: 'example',
            email: 'test@example.com',
            password: 'hashedPassword'
          };
    
          mockRequest.body = {
            email: 'test@example.com',
            password: 'password123'
          };
    
          mockUserRepository.findByEmail.mockResolvedValue(mockUser);
          (bcrypt.compare as jest.Mock).mockResolvedValue(true);
          (jwt.sign as jest.Mock).mockReturnValue('mockToken');
    
          await userController.login(
            mockRequest as Request,
            mockResponse as Response
          );
    
          expect(mockResponse.json).toHaveBeenCalledWith({
            token: 'mockToken'
          });
        });
    
        it('should return 401 for invalid email', async () => {
          mockRequest.body = {
            email: 'nonexistent@example.com',
            password: 'password123'
          };
    
          mockUserRepository.findByEmail.mockResolvedValue(null);
    
          await userController.login(
            mockRequest as Request,
            mockResponse as Response
          );
    
          expect(mockResponse.status).toHaveBeenCalledWith(401);
          expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid credentials'
          });
        });
    
        it('should return 401 for invalid password', async () => {
          const mockUser = {
            id: '1',
            username: 'example',
            email: 'test@example.com',
            password: 'hashedPassword'
          };
    
          mockRequest.body = {
            email: 'test@example.com',
            password: 'wrongpassword'
          };
    
          mockUserRepository.findByEmail.mockResolvedValue(mockUser);
          (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    
          await userController.login(
            mockRequest as Request,
            mockResponse as Response
          );
    
          expect(mockResponse.status).toHaveBeenCalledWith(401);
          expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid credentials'
          });
        });
    
        it('should handle login error', async () => {
          mockUserRepository.findByEmail.mockRejectedValue(new Error('Database error'));
    
          await userController.login(
            mockRequest as Request,
            mockResponse as Response
          );
    
          expect(mockResponse.status).toHaveBeenCalledWith(500);
          expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Error logging in'
          });
        });
      });
});