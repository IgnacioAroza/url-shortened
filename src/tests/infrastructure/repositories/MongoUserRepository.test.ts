import { MongoUserRepository } from '../../../infrastructure/repositories/MongoUserRepository';
import mongoose from 'mongoose';
import { User } from '../../../domain/entities/User';

describe('MongoUserRepository', () => {
  let repository: MongoUserRepository;
  let mockModel: any;

  beforeEach(() => {
      mockModel = {
          create: jest.fn(),
          findOne: jest.fn(),
      };

      repository = new MongoUserRepository(mockModel);
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  describe('save', () => {
      it('should save a user successfully', async () => {
          const user: User = {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
              password: 'hashedpassword',
          };

          mockModel.create.mockResolvedValue(user);
          await repository.save(user);
          expect(mockModel.create).toHaveBeenCalledWith(user);
      });

      it('should handle save errors', async () => {
          const user: User = {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
              password: 'hashedpassword',
          };

          mockModel.create.mockRejectedValue(new Error('Database error'));
          await expect(repository.save(user)).rejects.toThrow('Database error');
      });
  });

  describe('findByEmail', () => {
      it('should find user by email', async () => {
          const mockUser: User = {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
              password: 'hashedpassword',
          };

          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(mockUser),
          });

          const result = await repository.findByEmail('test@example.com');
          expect(result).toEqual(mockUser);
      });

      it('should return null when user is not found', async () => {
          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(null),
          });

          const result = await repository.findByEmail('nonexistent@example.com');
          expect(result).toBeNull();
      });

      it('should handle findByEmail errors', async () => {
          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockRejectedValue(new Error('Database error')),
          });

          await expect(repository.findByEmail('test@example.com')).rejects.toThrow('Database error');
      });
  });

  describe('findById', () => {
      it('should find user by id', async () => {
          const mockUser: User = {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
              password: 'hashedpassword',
          };

          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(mockUser),
          });

          const result = await repository.findById('1');
          expect(result).toEqual(mockUser);
      });

      it('should return null when user is not found', async () => {
          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(null),
          });

          const result = await repository.findById('nonexistent');
          expect(result).toBeNull();
      });

      it('should handle findById errors', async () => {
          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockRejectedValue(new Error('Database error')),
          });

          await expect(repository.findById('1')).rejects.toThrow('Database error');
      });
  });
});