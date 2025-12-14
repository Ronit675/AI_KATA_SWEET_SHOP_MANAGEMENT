import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/server';
import { connectDatabase } from '../backend/src/config/database';

// Connect to database on cold start
let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      isConnected = false;
      throw error;
    }
  }
};

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Connect to database if not already connected
    await connectDB();
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

