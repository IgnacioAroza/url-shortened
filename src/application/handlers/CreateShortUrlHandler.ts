import { CreateShortUrlCommand } from '../commands/CreateShortUrl';
import { UrlRespository } from '../../domain/repositories/UrlRepository';
import { Url } from '../../domain/entities/Url';
import { cleanUrl } from '../../utils/urlUtils';
import crypto from 'crypto';

export class CreateShortUrlHandler {
    constructor(private urlRepository: UrlRespository) {}
    
    async handle(command: CreateShortUrlCommand): Promise<string> {
        if (!command.originalUrl) {
            throw new Error('Original URL is required');
        }
        
        const shortCode = this.generateShortCode();
        const cleanedUrl = cleanUrl(command.originalUrl);
        const url: Url = {
            id: crypto.randomUUID(),
            originalUrl: cleanedUrl,
            shortCode,
            userId: command.userId,
            clicks: 0,
            createdAt: new Date(),
        };

        await this.urlRepository.save(url);
        return shortCode;
    }

    private generateShortCode(): string {
        return crypto.randomBytes(4).toString('hex');
    }
}

