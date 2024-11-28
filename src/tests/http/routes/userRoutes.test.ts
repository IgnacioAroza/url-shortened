import express from 'express';
import request from 'supertest';
import { UserController } from '../../../http/controllers/UserController';
import { MongoUserRepository } from '../../../infrastructure/repositories/MongoUserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('fake.jwt.token')
}));

describe('User Routes', () => {
    let app: express.Application;
    let mockUserRepository: jest.Mocked<MongoUserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());

        mockUserRepository = {
            save: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
        } as unknown as jest.Mocked<MongoUserRepository>;

        const userController = new UserController(mockUserRepository);

        // Configurar las rutas directamente con el controlador mockeado
        app.post('/api/users/register', (req, res) => userController.register(req, res));
        app.post('/api/users/login', (req, res) => userController.login(req, res));
    });

    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const newUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            mockUserRepository.save.mockResolvedValueOnce();

            const response = await request(app)
                .post('/api/users/register')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('userId');
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: newUser.username,
                    email: newUser.email,
                    password: 'hashedPassword'
                })
            );
        });

        it('should handle registration errors', async () => {
            mockUserRepository.save.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/api/users/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/users/login', () => {
        it('should login an existing user', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedPassword'
            };

            mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
            (jwt.sign as jest.Mock).mockReturnValueOnce('fake.jwt.token');

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'fake.jwt.token');
        });

        it('should handle invalid credentials', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedPassword'
            };

            mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should handle non-existent user', async () => {
            mockUserRepository.findByEmail.mockResolvedValueOnce(null);

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should handle login errors', async () => {
            mockUserRepository.findByEmail.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });
});