import { CreateShortUrlHandler } from '../../../application/handlers/CreateShortUrlHandler';
import { UrlRespository } from '../../../domain/repositories/UrlRepository';

describe('CreateShortUrlHandler', () => {
    let mockUrlRepository: jest.Mocked<UrlRespository>;
    let handler: CreateShortUrlHandler;
  
    beforeEach(() => {
      mockUrlRepository = {
        save: jest.fn(),
        findByShortCode: jest.fn(),
        findByUserId: jest.fn(),
        incrementClicks: jest.fn(),
      };
      handler = new CreateShortUrlHandler(mockUrlRepository);
    });
  
    it('should create short URL successfully', async () => {
      const command = {
        originalUrl: 'https://example.com',
        userId: 'user123',
      };
  
      const shortCode = await handler.handle(command);
  
      expect(shortCode).toBeTruthy();
      expect(mockUrlRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUrlRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        originalUrl: expect.stringMatching(/^https:\/\/example\.com\/?$/),
        userId: 'user123',
        shortCode: expect.any(String),
      }));
    });
  
    it('should throw error for empty URL', async () => {
      const command = {
        originalUrl: '',
        userId: 'user123',
      };
  
      await expect(handler.handle(command)).rejects.toThrow('Original URL is required');
    });
  });