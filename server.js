const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/study', require('./routes/studyRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/productivity', require('./routes/productivityRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/warden', require('./routes/wardenRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'StudyNestAI API is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
