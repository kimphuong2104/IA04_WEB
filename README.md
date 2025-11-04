# User Registration System

A full-stack application with NestJS backend and React frontend for user registration and login.

## Project Structure

- `backend/` - NestJS API server
- `frontend/` - React frontend application

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run start:dev
```

The server will be running at http://localhost:3000

## Frontend Setup

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

The frontend will be available at http://localhost:5173

## Environment Variables

### Backend (.env)
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://postgres:123456789@localhost:5432/ia03?schema=public"
BCRYPT_ROUNDS=10
```

## Features

- User registration with email validation
- Password hashing using bcrypt
- Form validation using React Hook Form
- Responsive UI with Chakra UI
- Error handling and user feedback
- React Query for API state management