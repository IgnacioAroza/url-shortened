import mongoose from 'mongoose';
import connectDB from '../../../infrastructure/database/mongoose';

jest.mock('mongoose');

describe('MongoDB Connection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    console.log = jest.fn();
    console.error = jest.fn();
    process.exit = jest.fn() as any;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should connect successfully to MongoDB', async () => {
    process.env.MONGODB_URI = 'mongodb://test:test@localhost:27017/test';
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(console.log).toHaveBeenCalledWith('MongoDB connect');
  });

  it('should throw error if MONGODB_URI is not defined', async () => {
    delete process.env.MONGODB_URI;

    await connectDB();

    expect(console.error).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle connection errors', async () => {
    process.env.MONGODB_URI = 'mongodb://test:test@localhost:27017/test';
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDB();

    expect(console.error).toHaveBeenCalledWith('MongoDB connection error:', error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});