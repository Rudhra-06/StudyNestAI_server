# StudyNestAI Backend Server

AI-Powered Student Life Management System - Backend API

## 🚀 Features

- **Authentication**: JWT-based authentication with role-based access control
- **Study Bot Module**: Track study sessions, streaks, credits, and burnout detection
- **Hostel Companion**: Complaint management, expense tracking, notices, feedback
- **Emergency Alerts**: Real-time emergency notifications using Socket.io
- **Role-Based Access**: Student, Faculty, Warden, Admin roles

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io
- bcryptjs

## 🛠️ Installation

```bash
npm install
```

## ⚙️ Environment Variables

Create `.env` file:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/StudyNestAI
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🚀 Run Server

```bash
npm run dev
```

Server runs on: `http://localhost:5001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Study Module
- `POST /api/study/start` - Start study session
- `PUT /api/study/end/:sessionId` - End study session
- `GET /api/study/streak` - Get study streak
- `GET /api/study/burnout` - Detect burnout risk

### Hostel Module
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints
- `PUT /api/complaints/:id` - Update complaint status
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get expenses
- `POST /api/notices` - Create notice
- `GET /api/notices` - Get notices
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback

### Emergency
- `POST /api/emergency` - Trigger emergency alert
- `GET /api/emergency` - Get emergency logs
- `PUT /api/emergency/:id/acknowledge` - Acknowledge emergency

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 👥 User Roles

- `student` - Access study and hostel features
- `faculty` - View student analytics
- `warden` - Manage complaints and emergencies
- `admin` - Full system access

## 📁 Project Structure

```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── studyController.js
│   ├── complaintController.js
│   ├── expenseController.js
│   ├── noticeController.js
│   ├── feedbackController.js
│   └── emergencyController.js
├── models/
│   ├── User.js
│   ├── StudySession.js
│   ├── Complaint.js
│   ├── Expense.js
│   ├── Notice.js
│   ├── Feedback.js
│   └── EmergencyLog.js
├── routes/
│   ├── authRoutes.js
│   ├── studyRoutes.js
│   ├── complaintRoutes.js
│   ├── expenseRoutes.js
│   ├── noticeRoutes.js
│   ├── feedbackRoutes.js
│   └── emergencyRoutes.js
├── middleware/
│   └── authMiddleware.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 🌐 Frontend Repository

Connect this backend with the frontend client for full functionality.

## 📝 License

MIT
