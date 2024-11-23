import { CreateShortUrlCommand } from '../commands/CreateShortUrl';
import { UrlRespository } from '../../domain/repositories/UrlRepository';
import { Url } from '../../domain/entities/Url';

export class CreateShortUrlHandler {
    private nanoid: ((size?: number) => string) | null = null;

    constructor(private urlRepository: UrlRespository) {
        this.initNanoid();
    }

    private async initNanoid() {
        const nanoidModule = await import('nanoid');
        this.nanoid = nanoidModule.nanoid;
    }
    
    async handle(command: CreateShortUrlCommand): Promise<string> {
        if (!this.nanoid) {
            await this.initNanoid();
        }

        if (!this.nanoid) {
            throw new Error('Failed to initialize nanoid');
        }

        const shortCode = this.nanoid(8); // Genera un código de 8 caracteres
        const url: Url = {
            id: this.nanoid(),
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

