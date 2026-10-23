# SmartBank — Full-Stack Banking Web Application

SmartBank is a full-stack banking web application built as a portfolio project to demonstrate web development skills, REST API development, database integration, authentication, and banking-related workflows.

The application includes customer banking features and an administrative dashboard for managing banking operations.

## Features

### Customer Features
- **User Authentication** — Register and log in securely.
- **Customer Dashboard** — View account information and recent transactions.
- **Money Transfers** — Transfer money between accounts.
- **Payments** — Process payment transactions.
- **Transaction History** — Review previous transactions.
- **Loan Management** — Apply for loans and view submitted loan applications.

### Admin Features
- **Admin Dashboard** — Access administrative banking functions.
- **Customer Management** — Manage customer accounts.
- **Account Controls** — Freeze and unfreeze customer accounts.
- **Loan Management** — Review and process loan applications.
- **Transaction Management** — View and manage transaction records.
- **Audit Logs** — Review recorded administrative activities.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| API | REST API |
| Development Tools | Git, GitHub, npm |

## Project Structure

```text
SmartBank/
├── .gitignore
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    ├── package.json
    └── frontend/
        ├── public/
        ├── src/
        ├── package.json
        └── vite.config.js
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/jhgfddssa/SmartBank.git
cd SmartBank
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and configure the environment variables required by your backend application.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

**Important:** Use the exact variable names expected by your backend code. Never commit real database credentials, JWT secrets, or passwords to GitHub.

Start the backend server:

```bash
npm run dev
```

The backend is configured to run on port `5000` by default, subject to your environment configuration.

### 3. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd backend/frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal, usually:

`http://localhost:5173`

### 4. Connect the Frontend and Backend

Ensure that the frontend API configuration points to the correct backend URL and that the backend CORS configuration allows requests from the frontend origin.

## API Overview

The backend provides REST API endpoints for authentication, transactions, loans, and administrative operations.

| Feature | Endpoint |
|---|---|
| Register | `POST /api/auth/register` |
| Login | `POST /api/auth/login` |
| Money Transfer | `POST /api/transactions/transfer` |
| Payment | `POST /api/transactions/payment` |
| Transaction History | `GET /api/transactions/history` |
| Apply for a Loan | `POST /api/loans/apply` |
| View My Loans | `GET /api/loans/my-loans` |

Protected endpoints require authentication. Actual request bodies, response formats, and authorization requirements depend on the implementation.

## Security Notes

SmartBank is an educational portfolio project and is not intended for real-world banking or production financial transactions.

Security-related features include password hashing, JWT-based authentication, protected routes, role-based authorization, and account freeze controls.

Before production use, the application would require additional security reviews, comprehensive testing, transaction integrity controls, monitoring, and appropriate financial and regulatory compliance measures.

## Future Improvements

- Automated unit and integration testing
- Improved input validation and error handling
- Enhanced fraud detection and transaction controls
- Responsive UI and accessibility improvements
- Deployment with production-grade configuration
- Continuous integration and automated security checks

## Author

**Seam Piseth**

Computer Science Graduate | Aspiring Web Developer

GitHub: [jhgfddssa](https://github.com/jhgfddssa)

## License

No license has been specified yet. All rights are reserved by the author unless a license is added to this repository.
