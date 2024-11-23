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
    async save(user: User): Promise<void> {
        await UserModel.create(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({ email }).lean();
    }

    async findById(id: string): Promise<User | null> {
        return UserModel.findOne({ id }).lean();
    }
}