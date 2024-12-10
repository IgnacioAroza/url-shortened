import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './infrastructure/database/mongoose';
import urlRoutes from './http/routes/urlRoutes';
import userRoutes from './http/routes/userRoutes'
import { UrlController } from './http/controllers/UrlController';
import { MongoUrlRepository } from './infrastructure/repositories/MongoUrlRepository';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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