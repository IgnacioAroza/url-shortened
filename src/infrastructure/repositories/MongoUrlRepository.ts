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
        try {
            await UrlModel.create(url);
        } catch (error) {
            console.error('Error saving URL:', error);
            throw error;
        }
    }

    async findByShortCode(shortCode: string): Promise<Url | null> {
        console.log(`Searching for shortCode: ${shortCode}`);
        try {
            const result = await UrlModel.findOne({ shortCode }).lean().exec();
            console.log(`Result for ${shortCode}:`, result);
            return result;
        } catch (error) {
            console.error(`Error finding shortCode ${shortCode}:`, error);
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Url[]> {
        try {
            return await UrlModel.find({ userId }).lean().exec();
        } catch (error) {
            console.error(`Error finding URLs for user ${userId}:`, error);
            throw error;
        }
    }

    async incrementClicks(shortCode: string): Promise<void> {
        try {
            await UrlModel.updateOne({ shortCode }, { $inc: { clicks: 1 } }).exec();
        } catch (error) {
            console.error(`Error incrementing clicks for ${shortCode}:`, error);
            throw error;
        }
    }
}