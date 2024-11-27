import { CreateUserHandler } from '../../../application/handlers/CreateUserHandler';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('CreateUserHandler', () => {
    let mockUserRepository: jest.Mocked<UserRepository>;
    let handler: CreateUserHandler;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
        };
        handler = new CreateUserHandler(mockUserRepository);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    });

    it('should create user successfully', async () => {
        const command = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        };
    
        const userId = await handler.handle(command);
    
        expect(userId).toBeTruthy();
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword',
        }));
      });
});