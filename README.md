# SmartBank — Online Banking Web Application

SmartBank is a full-stack online banking demo application built to demonstrate web development skills, REST API integration, authentication, and database management.

## Live Demo

- **Frontend:** https://smart-bank-six-chi.vercel.app/
- **Backend API:** https://smartbank-5vmz.onrender.com

> SmartBank is a portfolio and educational project. It is not a real banking service. Do not use real banking credentials or sensitive financial information.

## Features

- User registration and login
- JWT-based authentication
- Account information and balance display
- Money transfers between accounts
- Payment transactions
- Transaction history
- Loan applications and loan status tracking
- Admin features for account management
- Account freeze and unfreeze functionality

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JSON Web Tokens (JWT)

### Database
- MongoDB
- MongoDB Atlas

### Deployment
- Vercel — Frontend
- Render — Backend

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jhgfddssa/SmartBank.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd SmartBank/backend
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Configure your environment variables in a `.env` file.

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the backend:

   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a second terminal.
2. Navigate to the frontend directory:

   ```bash
   cd SmartBank/backend/frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. Start the frontend:

   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/transactions/transfer` | Transfer money |
| POST | `/api/transactions/payment` | Process a payment |
| GET | `/api/transactions/history` | Retrieve transaction history |
| POST | `/api/loans/apply` | Apply for a loan |
| GET | `/api/loans/my-loans` | Retrieve the user's loans |

Protected endpoints require a valid authentication token. Admin endpoints require appropriate administrator permissions.

## Security

- Password hashing
- JWT-based authentication
- Protected routes and role-based authorization
- Account freeze checks
- Environment variables for sensitive configuration

## Project Purpose

This project was developed as a practical portfolio project to demonstrate full-stack development, API integration, database operations, authentication, and deployment.

## Disclaimer

SmartBank is a demonstration project for educational and portfolio purposes only. It is not intended for real financial transactions.
