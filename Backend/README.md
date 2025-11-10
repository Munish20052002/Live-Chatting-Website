# My Node Backend (Express + MongoDB Atlas)

## Features
- Express server
- MongoDB (Mongoose) connected to MongoDB Atlas
- Authentication (register + login) with JWT
- Input validation using express-validator
- Password hashing with bcrypt
- Error handling middleware
- Basic folder structure: controllers, routes, models, middleware, config

## Requirements
- Node.js 18+ (or LTS)
- npm
- MongoDB Atlas account & connection string

## Setup
1. Clone the repo:

2. Install dependencies:

3. Copy and configure environment variables:
Edit `.env` and set:
- `MONGO_URI` — your Atlas connection string
- `JWT_SECRET` — a secure random string
- `PORT` — (optional) default 5000

4. Start in development:
Or start production:

5. API endpoints

### Register User
- **Endpoint:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Validation:**
  - Name: required, 2-50 characters
  - Email: required, valid email format
  - Password: required, minimum 6 characters
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "jwt_token_here"
    }
  }
  ```

### Login User
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Validation:**
  - Email: required, valid email format
  - Password: required
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "jwt_token_here"
    }
  }
  ```

### Get Current User
- **Endpoint:** `GET /api/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
  ```

## Useful tips
- Use Postman or Insomnia for testing.
- Add `nodemon` (already included as devDependency) for hot reloads.
- For production, consider using process managers (pm2), HTTPS, helmet, rate limiting, and better logging.

## Environment Variables
Create a `.env` file in the Backend directory with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_jwt_key
PORT=5000
NODE_ENV=development
```

## Extend
- Add role-based middleware to protect admin routes.
- Add refresh token flow.
- Add rate limiting for authentication endpoints.
- Add email verification.
- Add password reset functionality.
