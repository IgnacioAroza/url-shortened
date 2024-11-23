import { CreateShortUrlCommand } from '../commands/CreateShortUrl';
import { UrlRespository } from '../../domain/repositories/UrlRepository';
import { Url } from '../../domain/entities/Url';
import { nanoid } from 'nanoid';

export class CreateShortUrlHandler {
    constructor(private urlRepository: UrlRespository) {}
    
    async handle(command: CreateShortUrlCommand): Promise<string> {
        const shortCode = nanoid(8);
        const url: Url = {
            id: nanoid(),
            originalUrl: command.originalUrl,
            shortCode,
            userId: command.userId,
            clicks: 0,
            createdAt: new Date(),
        };

        await this.urlRepository.save(url);
        return shortCode;
    }
}