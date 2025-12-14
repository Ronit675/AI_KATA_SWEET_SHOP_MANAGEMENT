import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// In Vercel, /api prefix is already handled by routing, so we use relative paths
// For local development, we keep /api prefix
const apiPrefix = process.env.VERCEL ? '' : '/api';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/sweets`, sweetRoutes);

// Health check endpoint
app.get(`${apiPrefix}/health`, (req, res) => {
  res.json({ status: 'OK', message: 'Sweet Shop API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to database and start server
export const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server when not running tests and not on Vercel
// Vercel handles serverless functions, so we don't need to start a server
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export default app;

