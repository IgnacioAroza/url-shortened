import { UrlController } from '../../../http/controllers/UrlController';
import { UrlRespository } from '../../../domain/repositories/UrlRepository';
import { Request, Response } from 'express';
import { Url } from '../../../domain/entities/Url';

describe('UrlController', () => {
    let urlController: UrlController;
    let mockUrlRepository: jest.Mocked<UrlRespository>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
  
    beforeEach(() => {
      // Crear el mock del repositorio
      mockUrlRepository = {
        save: jest.fn(),
        findByShortCode: jest.fn(),
        findByUserId: jest.fn(),
        incrementClicks: jest.fn()
      } as jest.Mocked<UrlRespository>;
  
      // Crear el controlador
      urlController = new UrlController(mockUrlRepository);
  
      // Mock del request y response
      mockRequest = {
        body: {},
        params: {},
        user: { id: 'user123' }
      };
  
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
        redirect: jest.fn()
      };
    });
  
    describe('createShortUrl', () => {
      it('should create a short url successfully', async () => {
        // Arrange
        mockRequest.body = { url: 'https://example.com' };
        mockUrlRepository.save.mockResolvedValue();
  
        // Act
        await urlController.createShortUrl(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            shortCode: expect.any(String)
          })
        );
      });
  
      it('should return 401 if user is not authenticated', async () => {
        // Arrange
        mockRequest.user = undefined;
  
        // Act
        await urlController.createShortUrl(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Unauthenticated user'
        });
      });
  
      it('should return 400 if URL is not provided', async () => {
        // Arrange
        mockRequest.body = {};
  
        // Act
        await urlController.createShortUrl(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'URL is required'
        });
      });
    });
  
    describe('redirectToOriginalUrl', () => {
      it('should redirect to original url successfully', async () => {
        // Arrange
        const mockUrl: Url = {
          id: '1',
          originalUrl: 'https://example.com',
          shortCode: 'abc123',
          userId: 'user123',
          clicks: 0,
          createdAt: new Date()
        };
        mockRequest.params = { shortCode: 'abc123' };
        mockUrlRepository.findByShortCode.mockResolvedValue(mockUrl);
  
        // Act
        await urlController.redirectToOriginalUrl(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockUrlRepository.incrementClicks).toHaveBeenCalledWith('abc123');
        expect(mockResponse.redirect).toHaveBeenCalledWith(301, mockUrl.originalUrl);
      });
  
      it('should return 400 if short code is not provided', async () => {
        // Arrange
        mockRequest.params = {};
  
        // Act
        await urlController.redirectToOriginalUrl(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith('Invalid short code');
      });
  
      it('should return 404 if URL is not found', async () => {
        // Arrange
        mockRequest.params = { shortCode: 'nonexistent' };
        mockUrlRepository.findByShortCode.mockResolvedValue(null);
  
        // Act
        await urlController.redirectToOriginalUrl(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith('URL not found');
      });
    });
  
    describe('getUserUrls', () => {
      it('should return user urls successfully', async () => {
        // Arrange
        const mockUrls: Url[] = [
          {
            id: '1',
            originalUrl: 'https://example.com',
            shortCode: 'abc123',
            userId: 'user123',
            clicks: 0,
            createdAt: new Date()
          }
        ];
        mockUrlRepository.findByUserId.mockResolvedValue(mockUrls);
  
        // Act
        await urlController.getUserUrls(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockUrlRepository.findByUserId).toHaveBeenCalledWith('user123');
        expect(mockResponse.json).toHaveBeenCalledWith(mockUrls);
      });
  
      it('should return 401 if user is not authenticated', async () => {
        // Arrange
        mockRequest.user = undefined;
  
        // Act
        await urlController.getUserUrls(
          mockRequest as Request,
          mockResponse as Response
        );
  
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Unauthenticated user'
        });
      });
    });
});