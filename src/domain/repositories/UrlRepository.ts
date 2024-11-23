import { Url } from '../entities/Url';

export interface UrlRespository {
    save(url: Url): Promise<void>;
    findByShortCode(shortCode: string): Promise<Url | null>;
    findByUserId(userId: string): Promise<Url[]>;
    incrementClicks(shortCode: string): Promise<void>;
}