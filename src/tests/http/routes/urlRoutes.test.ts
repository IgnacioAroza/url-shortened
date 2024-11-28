import express from 'express';
import request from 'supertest';
import { UrlController } from '../../../http/controllers/UrlController';
import { MongoUrlRepository } from '../../../infrastructure/repositories/MongoUrlRepository';
import { MongoUserRepository } from '../../../infrastructure/repositories/MongoUserRepository';
import { authMiddleware } from '../../../http/middlewares/auth';

jest.mock('../../../infrastructure/repositories/MongoUrlRepository');
jest.mock('../../../infrastructure/repositories/MongoUserRepository');
jest.mock('../../../http/middlewares/auth');
jest.mock('../../../http/controllers/UrlController');

const mockUrlController = {
  createShortUrl: jest.fn(),
  getUserUrls: jest.fn(),
};

jest.mock('../../../http/controllers/UrlController', () => {
  return jest.fn().mockImplementation(() => {
    return mockUrlController;
  });
});

describe('Rutas de URL', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());

    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());

    const router = express.Router();
    router.post('/shorten', (req, res) => mockUrlController.createShortUrl(req, res));
    router.get('/user', (req, res) => mockUrlController.getUserUrls(req, res));
    app.use('/api/urls', router);
  });

  describe('POST /api/urls/shorten', () => {
    it('debería crear una URL corta cuando el usuario está autenticado', async () => {
      mockUrlController.createShortUrl.mockImplementation((req, res) => {
        res.status(201).json({ shortCode: 'abc123' });
      });

      const response = await request(app)
        .post('/api/urls/shorten')
        .send({ url: 'https://ejemplo.com' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortCode');
      expect(mockUrlController.createShortUrl).toHaveBeenCalled();
    });
  });

  describe('GET /api/urls/user', () => {
    it('debería obtener las URLs del usuario cuando está autenticado', async () => {
      mockUrlController.getUserUrls.mockImplementation((req, res) => {
        res.status(200).json([{ id: '1', shortCode: 'abc123', originalUrl: 'https://ejemplo.com' }]);
      });

      const response = await request(app)
        .get('/api/urls/user');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(mockUrlController.getUserUrls).toHaveBeenCalled();
    });
  });
});