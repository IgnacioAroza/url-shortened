import { UrlRespository } from '../../domain/repositories/UrlRepository';
import { Url } from '../../domain/entities/Url';
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema<Url>({
    id: String,
    originalUrl: String,
    shortCode: String,
    userId: String,
    clicks: Number,
    createdAt: Date,
});

const UrlModel = mongoose.model<Url>('Url', urlSchema);

export class MongoUrlRepository implements UrlRespository {
    async save(url: Url): Promise<void> {
        await UrlModel.create(url);
    }

    async findByShortCode(shortCode: string): Promise<Url | null> {
        return UrlModel.findOne({ shortCode }).lean();
    }

    async findByUserId(userId: string): Promise<Url[]> {
        return UrlModel.find({ userId }).lean();
    }

    async incrementClicks(shortCode: string): Promise<void> {
        await UrlModel.updateOne({ shortCode }, { $inc: { clicks: 1 } });
    }
}