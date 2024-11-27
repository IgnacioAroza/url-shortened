import { Request, Response } from 'express';
import { CreateShortUrlHandler } from '../../application/handlers/CreateShortUrlHandler';
import { UrlRespository } from '../../domain/repositories/UrlRepository';

export class UrlController {
    constructor(private urlRepository: UrlRespository) {}

    async createShortUrl(req: Request, res: Response): Promise<void> {
        try {
            const { url } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: 'Unauthenticated user' });
                return;
            }

            if (!url) {
                res.status(400).json({ error: 'URL is required' });
                return;
            }

            const handler = new CreateShortUrlHandler(this.urlRepository);
            const shortCode = await handler.handle({ originalUrl: url, userId });

            res.status(201).json({ shortCode });
        } catch (error) {
            console.error('Error creating short URL:', error);
            res.status(500).json({ error: 'Error creating short URL' });
        }
    }

    async redirectToOriginalUrl(req: Request, res: Response): Promise<void> {
        try {
            const { shortCode } = req.params;
            
            if (!shortCode) {
                res.status(400).send('Invalid short code');
                return;
            }

            const url = await this.urlRepository.findByShortCode(shortCode);

            if (!url) {
                res.status(404).send('URL not found');
                return;
            }

            await this.urlRepository.incrementClicks(shortCode);

            res.redirect(301, url.originalUrl);
        } catch (error) {
            console.error('Error redirecting:', error);
            res.status(500).send('Error redirecting');
        }
    }

    async getUserUrls(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: 'Unauthenticated user' });
                return;
            }

            const urls = await this.urlRepository.findByUserId(userId);
            res.json(urls);
        } catch (error) {
            console.error('Error getting user URLs:', error);
            res.status(500).json({ error: 'Error getting user URLs' });
        }
    }
}