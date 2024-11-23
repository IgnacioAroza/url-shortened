import { Request, Response } from 'express';
import { CreateUserHandler } from '../../application/handlers/CreateUserHandler';
import { UserRepository } from '../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserController {
    constructor(private userRepository: UserRepository) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;
            const handler = new CreateUserHandler(this.userRepository);
            const userId= await handler.handle({ username, email, password });

            res.status(201).json({ userId });
        } catch (error) {
            res.status(500).json({ error: 'Error when registering the user' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
                expiresIn: '1d',
            });

            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    }
}