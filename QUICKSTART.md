# Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed (v18+)
- ✅ MongoDB running (local or Atlas)

## Step 1: Start MongoDB

### Option A: Local MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services
```

### Option B: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Option C: MongoDB Atlas
Use your Atlas connection string in the `.env` file

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend should be running at `http://localhost:3000`

## Step 3: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend should be running at `http://localhost:5173`

## Step 4: Test the Application

1. Open `http://localhost:5173` in your browser
2. Register a new user (choose "Admin" role for full access)
3. Login with your credentials
4. Start managing sweets!

## Running Tests

Backend tests:
```bash
cd backend
npm test
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env` file
- For Atlas, ensure IP whitelist includes your IP

### Port Already in Use
- Change PORT in backend `.env`
- Update proxy in `frontend/vite.config.ts`

### CORS Issues
- Backend CORS is configured for localhost:5173
- Adjust if using different ports

