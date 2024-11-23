import express from 'express';
import { UrlController } from '../controllers/UrlController';
import { authMiddleware } from '../middlewares/auth';
import { MongoUrlRepository } from '../../infrastructure/repositories/MongoUrlRepository';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';

const router = express.Router();
const urlRepository = new MongoUrlRepository();
const userRepository = new MongoUserRepository();
const urlController = new UrlController(urlRepository);

router.post('/shorten', authMiddleware(userRepository), (req, res) => urlController.createShortUrl(req, res));
router.get('/user', authMiddleware(userRepository), (req, res) => urlController.getUserUrls(req, res));

export default router;