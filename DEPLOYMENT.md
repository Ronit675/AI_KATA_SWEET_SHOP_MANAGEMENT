# Vercel Deployment Guide

This guide will help you deploy the Sweet Shop Management System to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB database (MongoDB Atlas recommended for production)
3. Node.js 18+ installed locally (for testing)

## Environment Variables

Before deploying, you'll need to set up the following environment variables in Vercel:

1. **MONGODB_URI** - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/sweet-shop?retryWrites=true&w=majority`
   - For MongoDB Atlas: Get this from your cluster's "Connect" section

2. **JWT_SECRET** - A secret key for JWT token generation
   - Generate a strong random string (e.g., use `openssl rand -base64 32`)

3. **PORT** (optional) - Server port (Vercel will handle this automatically)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory:
   ```bash
   cd "/Users/ronitjain/Downloads/WEB/PROJECTS/AI KATA SWEET SHOP MANAGEMENT"
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts to link your project

6. Set environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

7. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click "Add New Project"

3. Import your Git repository (GitHub, GitLab, or Bitbucket)

4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of the project)
   - **Build Command**: `cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install && cd ../backend && npm install`

5. Add Environment Variables:
   - Go to Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string
   - Add `JWT_SECRET` with a secure random string

6. Click "Deploy"

## Project Structure

The deployment is configured as follows:

- **Frontend**: Built with Vite and served as static files from `frontend/dist`
- **Backend API**: Deployed as Vercel serverless functions in the `api/` directory
- **Routes**: 
  - `/api/*` routes are handled by the Express backend
  - All other routes serve the React frontend

## Post-Deployment

After deployment:

1. Your app will be available at `https://your-project.vercel.app`
2. The API will be accessible at `https://your-project.vercel.app/api/*`
3. Test the health endpoint: `https://your-project.vercel.app/api/health`

## Troubleshooting

### Database Connection Issues

- Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges
- Verify the `MONGODB_URI` environment variable is set correctly
- Check Vercel function logs for connection errors

### Build Errors

- Ensure all dependencies are listed in `package.json` files
- Check that Node.js version is 18+ in Vercel settings
- Review build logs in Vercel dashboard

### API Not Working

- Verify the `api/index.ts` file exists and exports the handler correctly
- Check that backend routes are prefixed with `/api` in `server.ts`
- Review serverless function logs in Vercel dashboard

## Local Testing

To test the Vercel setup locally:

```bash
npm install -g vercel
vercel dev
```

This will start a local server that mimics Vercel's environment.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

