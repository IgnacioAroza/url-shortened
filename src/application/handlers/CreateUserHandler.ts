import { CreateUserCommand } from '../commands/CreateUser';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class CreateUserHandler {
    constructor(private userRepository: UserRepository) {}

    async handle(command: CreateUserCommand): Promise<string> {
        const hashedPassword = await bcrypt.hash(command.password, 10);
        const user: User = {
            id: crypto.randomUUID(),
            username: command.username,
            email: command.email,
            password: hashedPassword,
        };

        await this.userRepository.save(user);
        return user.id;
    }
}

