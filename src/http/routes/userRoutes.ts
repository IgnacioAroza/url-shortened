import express from 'express';
import { UserController } from '../controllers/UserController';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';

const router = express.Router();
const userRepository = new MongoUserRepository();
const userController = new UserController(userRepository);

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));

export default router;