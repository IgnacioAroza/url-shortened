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
    private model: mongoose.Model<Url>;

    constructor(model = UrlModel) {
        this.model = model;
    }

    async save(url: Url): Promise<void> {
        try {
            await this.model.create(url);
        } catch (error) {
            throw error;
        }
    }

    async findByShortCode(shortCode: string): Promise<Url | null> {
        try {
            return await this.model.findOne({ shortCode }).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Url[]> {
        try {
            return await this.model.find({ userId }).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async incrementClicks(shortCode: string): Promise<void> {
        try {
            await this.model.updateOne({ shortCode }, { $inc: { clicks: 1 } }).exec();
        } catch (error) {
            throw error;
        }
    }
}