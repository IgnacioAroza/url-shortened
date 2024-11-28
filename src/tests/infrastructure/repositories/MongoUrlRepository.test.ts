import { MongoUrlRepository } from '../../../infrastructure/repositories/MongoUrlRepository';
import mongoose from 'mongoose';
import { Url } from '../../../domain/entities/Url';

describe('MongoUrlRepository', () => {
  let repository: MongoUrlRepository;
  let mockModel: any;

  beforeEach(() => {
      mockModel = {
          create: jest.fn(),
          findOne: jest.fn(),
          find: jest.fn(),
          updateOne: jest.fn(),
      };

      repository = new MongoUrlRepository(mockModel);
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  describe('save', () => {
      it('debería guardar una URL correctamente', async () => {
          const url: Url = {
              id: '1',
              originalUrl: 'https://ejemplo.com',
              shortCode: 'abc123',
              userId: 'user1',
              clicks: 0,
              createdAt: new Date(),
          };

          mockModel.create.mockResolvedValue(url);
          await repository.save(url);
          expect(mockModel.create).toHaveBeenCalledWith(url);
      });

      it('debería manejar errores al guardar', async () => {
          const url: Url = {
              id: '1',
              originalUrl: 'https://ejemplo.com',
              shortCode: 'abc123',
              userId: 'user1',
              clicks: 0,
              createdAt: new Date(),
          };

          const error = new Error('Database error');
          mockModel.create.mockRejectedValue(error);
          await expect(repository.save(url)).rejects.toThrow('Database error');
      });
  });

  describe('findByShortCode', () => {
      it('debería encontrar una URL por su código corto', async () => {
          const mockUrl: Url = {
              id: '1',
              originalUrl: 'https://ejemplo.com',
              shortCode: 'abc123',
              userId: 'user1',
              clicks: 0,
              createdAt: new Date(),
          };

          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(mockUrl),
          });

          const result = await repository.findByShortCode('abc123');
          expect(result).toEqual(mockUrl);
      });

      it('debería manejar errores al buscar por código corto', async () => {
          mockModel.findOne.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockRejectedValue(new Error('Database error')),
          });

          await expect(repository.findByShortCode('abc123')).rejects.toThrow('Database error');
      });
  });

  describe('findByUserId', () => {
      it('debería encontrar las URLs de un usuario', async () => {
          const mockUrls: Url[] = [{
              id: '1',
              originalUrl: 'https://ejemplo.com',
              shortCode: 'abc123',
              userId: 'user1',
              clicks: 0,
              createdAt: new Date(),
          }];

          mockModel.find.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(mockUrls),
          });

          const result = await repository.findByUserId('user1');
          expect(result).toEqual(mockUrls);
      });

      it('debería manejar errores al buscar por userId', async () => {
          mockModel.find.mockReturnValue({
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockRejectedValue(new Error('Database error')),
          });

          await expect(repository.findByUserId('user1')).rejects.toThrow('Database error');
      });
  });

  describe('incrementClicks', () => {
      it('debería incrementar el contador de clics de una URL', async () => {
          mockModel.updateOne.mockReturnValue({
              exec: jest.fn().mockResolvedValue({ nModified: 1 }),
          });

          await repository.incrementClicks('abc123');
          expect(mockModel.updateOne).toHaveBeenCalledWith(
              { shortCode: 'abc123' },
              { $inc: { clicks: 1 } }
          );
      });

      it('debería manejar errores al incrementar clics', async () => {
          mockModel.updateOne.mockReturnValue({
              exec: jest.fn().mockRejectedValue(new Error('Database error')),
          });

          await expect(repository.incrementClicks('abc123')).rejects.toThrow('Database error');
      });
  });
});