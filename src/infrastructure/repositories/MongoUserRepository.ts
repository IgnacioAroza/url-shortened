import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<User>({
    id: String,
    username: String,
    email: String,
    password: String,
});

const UserModel = mongoose.model<User>('User', userSchema);

export class MongoUserRepository implements UserRepository {
    private model: mongoose.Model<User>;

    constructor(model = UserModel) {
        this.model = model;
    }

    async save(user: User): Promise<void> {
        try {
            await this.model.create(user);
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.model.findOne({ email }).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            return await this.model.findOne({ id }).lean().exec();
        } catch (error) {
            throw error;
        }
    }
}