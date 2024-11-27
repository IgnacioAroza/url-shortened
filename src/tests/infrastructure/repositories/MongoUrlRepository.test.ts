import { MongoUrlRepository } from '../../../infrastructure/repositories/MongoUrlRepository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('MongoUrlRepository', () => {
    let mongoServer: MongoMemoryServer;
    let repository: MongoUrlRepository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(() => {
        repository = new MongoUrlRepository();
      });

    it('slould save URL successfully', async () => {
        const url = {
            id: '123',
            originalUrl: 'https://example.com',
            shortCode: 'abc123',
            userId: 'user123',
            clicks: 0,
            createdAt: new Date(),
        };

        await repository.save(url);
        const found = await repository.findByShortCode('abc123');

        expect(found).toBeTruthy();
        expect(found?.originalUrl).toBe('https://example.com');
    });

    it('should increment clicks', async () => {
        const url = {
            id: '123',
            originalUrl: 'https://example.com',
            shortCode: 'abc123',
            userId: 'user123',
            clicks: 0,
            createdAt: new Date(),
        };

        await repository.save(url);
        await repository.incrementClicks('abc123');

        const found = await repository.findByShortCode('abc123');
        expect(found?.clicks).toBe(1);
    })
})