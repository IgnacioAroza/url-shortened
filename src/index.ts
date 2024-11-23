import express from 'express';
import dotenv from 'dotenv';
import connectDB from './infrastructure/database/mongoose';
import urlRoutes from './http/routes/urlRoutes';
import userRoutes from './http/routes/userRoutes'
import { UrlController } from './http/controllers/UrlController';
import { MongoUrlRepository } from './infrastructure/repositories/MongoUrlRepository';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

const urlRepository = new MongoUrlRepository();
const urlController = new UrlController(urlRepository);

app.use('/api/urls', urlRoutes);
app.use('/api/users', userRoutes);
app.use('/:shortCode', (req, res) => urlController.redirectToOriginalUrl(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});