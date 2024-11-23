import { CreateUserCommand } from '../commands/CreateUser';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import bcrypt from 'bcryptjs';

export class CreateUserHandler {
    private nanoid: ((size?: number) => string) | null = null;

    constructor(private userRepository: UserRepository) {
        this.initNanoid();
    }

    private async initNanoid() {
        const nanoidModule = await import('nanoid');
        this.nanoid = nanoidModule.nanoid;
    }

    async handle(command: CreateUserCommand): Promise<string> {
        if (!this.nanoid) {
            await this.initNanoid();
        }

        if (!this.nanoid) {
            throw new Error('Failed to initialize nanoid');
        }

        const hashedPassword = await bcrypt.hash(command.password, 10);
        const user: User = {
            id: this.nanoid(),
            username: command.username,
            email: command.email,
            password: hashedPassword,
        };

        await this.userRepository.save(user);
        return user.id;
    }
}

