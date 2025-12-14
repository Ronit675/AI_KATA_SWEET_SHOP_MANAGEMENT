# Sweet Shop Management System

A full-stack Sweet Shop Management System built with Node.js/TypeScript, Express, MongoDB, and React. This project follows Test-Driven Development (TDD) principles and implements clean coding practices.

## Features

### Backend API
- **User Authentication**: JWT-based authentication with registration and login
- **Sweets Management**: Full CRUD operations for sweets
- **Inventory Management**: Purchase and restock functionality
- **Search & Filter**: Search sweets by name, category, or price range
- **Role-Based Access**: Admin and regular user roles with appropriate permissions
- **Comprehensive Testing**: Full test coverage with Jest

### Frontend Application
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **User Authentication**: Login and registration forms
- **Dashboard**: Display all available sweets with real-time updates
- **Search & Filter**: Advanced search functionality
- **Purchase System**: One-click purchase with stock validation
- **Admin Panel**: Full CRUD operations for admin users
- **Inventory Management**: Restock functionality for admins

## Tech Stack

### Backend
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Jest for testing
- Express Validator for input validation

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Vite for build tooling
- Modern CSS with responsive design

## Project Structure

```
AI KATA SWEET SHOP MANAGEMENT/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Test files
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   └── server.ts           # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

5. Run tests:
```bash
npm test
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected - Requires Authentication)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `POST /api/sweets` - Create a new sweet (Admin only)
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increases quantity)

## Testing

The backend includes comprehensive test suites following TDD principles:

- **Authentication Tests**: Registration, login, validation
- **Sweets Tests**: CRUD operations, search, purchase, restock
- **Authorization Tests**: Role-based access control

Run tests with:
```bash
cd backend
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

### Test Report (latest)
- Command: `npm run test:coverage`
- Date: 2025-12-14
- Result: 29 tests passed, 0 failed
- Coverage summary:
   - Statements: 82.69%
   - Branches: 43.93%
   - Functions: 73.68%
   - Lines: 82.64%

## Screenshots of the Running application
1. **Adding a new Sweet**: [Screenshots/Add new sweet.png](Screenshots/Add%20new%20sweet.png)
2. **Admin Dashboard**: [Screenshots/Admin Dashboard.png](Screenshots/Admin%20Dashboard.png)
3. **Login Page**: [Screenshots/Login Page.png](Screenshots/Login%20Page.png)
4. **Signup Page**: [Screenshots/Signup page.png](Screenshots/Signup%20page.png)
5. **Filter by name**: [Screenshots/Filter by name.png](Screenshots/Filter%20by%20name.png)
6. **Filter by category**: [Screenshots/Filter by category.png](Screenshots/Filter%20by%20category.png)
7. **Filter by Min Prize**: [Screenshots/Filter by Min Prize.png](Screenshots/Filter%20by%20Min%20Prize.png)
8. **Filter by Max Prize**: [Screenshots/Filter by Max Prize.png](Screenshots/Filter%20by%20Max%20Prize.png)
9. **No Sweet found by Category**: [Screenshots/No Sweet found by Category.png](Screenshots/No%20Sweet%20found%20by%20Category.png)
10. **Out of Stock**: [Screenshots/Out of Stock.png](Screenshots/Out%20of%20Stock.png)
11. **Edit sweet details**: [Screenshots/Edit sweet details.png](Screenshots/Edit%20sweet%20details.png)
12. **Delete Sweet**: [Screenshots/Delete Sweet.png](Screenshots/Delete%20Sweet.png)
13. **Restock Working**: [Screenshots/Restock Working.png](Screenshots/Restock%20Working.png)



## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Sweets**: View all available sweets on the dashboard
3. **Search**: Use the search bar to filter by name, category, or price
4. **Purchase**: Click "Purchase" on any sweet (disabled if out of stock)
5. **Admin Functions**: If logged in as admin:
   - Add new sweets
   - Edit existing sweets
   - Delete sweets
   - Restock inventory



## My AI Usage

In building and refining this Sweet Shop Management System, I actively leveraged multiple AI developer tools to accelerate implementation, improve test coverage, and resolve complex issues efficiently. This section details my AI-assisted development journey.

### AI Tools Used

I utilized the following AI tools throughout the project:
- **Cursor AI** (Primary IDE Assistant)
- **GitHub Copilot** (Code Completion & Suggestions)
- **ChatGPT** (Guidance)

### How I Used AI Tools

#### 1. **GitHub Copilot - Code Generation & Boilerplate**

**Test Scaffolding:**
- Generated Jest test file templates for authentication and sweets endpoints
- Created test cases for CRUD operations, including edge cases like empty arrays and invalid IDs
- Suggested test data factories and helper functions for consistent test setup

**Example:** Copilot helped generate the initial test structure for `auth.test.ts`, including registration, login, and validation test cases, which I expanded with specific assertions.

#### 2. **ChatGPT - Suggestions and doubts**

- Helped me to clear some doubts in the code and I asked for necessary changes that can be useful in application

**Example:** MongoDB connection string issues


#### 4. **Cursor AI - Integrated Development Assistance**

- Helped resolve TypeScript compilation errors and type mismatches
- Genetrated the architecture of the project.
- Helped in connection with database 
- Helped me in designing the basic frontend of the application.

## Development Notes

### TDD Approach
- Tests were written before implementation
- Red-Green-Refactor cycle followed
- High test coverage maintained

### Clean Code Practices
- SOLID principles applied
- Separation of concerns (controllers, services, models)
- Meaningful variable and function names
- Comprehensive error handling
- Input validation on all endpoints

### Security
- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization

## License

ISC
