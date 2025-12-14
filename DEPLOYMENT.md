# Deploying to Vercel

## Prerequisites
1. A [Vercel account](https://vercel.com/signup)
2. MongoDB Atlas account (for database)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Database
1. Create a free MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/database`)
3. Whitelist all IPs (0.0.0.0/0) in Network Access for Vercel serverless functions

## Step 2: Push to Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 3: Deploy on Vercel

### Using Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `MONGODB_URI`: mongodb://localhost:27017/sweet-shop
   - `JWT_SECRET`: sweet-shop-super-secret-jwt-key-change-in-production
   - `NODE_ENV`: `production`

6. Click **Deploy**

### Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and set environment variables when asked
```

## Step 4: Configure Environment Variables
In your Vercel project dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `MONGODB_URI` = `mongodb+srv://...`
   - `JWT_SECRET` = `your-super-secret-key`
   - `NODE_ENV` = `production`

## Step 5: Update Frontend API URL
After deployment, update your frontend to use the correct API URL:

In `frontend/src/services/api.ts`, the base URL should be:
- For Vercel: `/api` (relative path, since both frontend and backend are on same domain)
- Or use environment variable: `import.meta.env.VITE_API_URL`

## Step 6: Test Your Deployment
Visit your Vercel URL and test:
- Registration
- Login
- CRUD operations on sweets

## Common Issues

### CORS Errors
Make sure your backend CORS configuration allows your Vercel domain.

### MongoDB Connection Timeouts
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string is correct
- Ensure database user has proper permissions

### Build Failures
- Check that all dependencies are in `package.json`
- Verify build commands are correct
- Check Vercel build logs for specific errors

## Alternative: Split Deployment

If you prefer to keep backend separate:

### Frontend on Vercel
1. Deploy only the `frontend` folder
2. Set `VITE_API_URL` environment variable to your backend URL

### Backend on Railway/Render
1. Deploy backend to [Railway](https://railway.app) or [Render](https://render.com)
2. Update CORS to allow your Vercel frontend domain
3. Set environment variables on the backend platform

## Monitoring
- Check Vercel **Functions** tab for serverless function logs
- Use Vercel **Analytics** for performance monitoring
- Set up error tracking (optional): Sentry, LogRocket, etc.

## Custom Domain (Optional)
1. Go to your project **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
