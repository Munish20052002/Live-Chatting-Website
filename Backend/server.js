require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

// Middleware
app.use(helmet());
// CORS configuration - explicitly handle preflight and allowed origins
const allowedOriginsEnv = process.env.FRONTEND_URL;
const allowedOrigins = allowedOriginsEnv ? allowedOriginsEnv.split(',') : undefined;

const corsOptions = {
	origin: function (origin, callback) {
		// Allow non-browser requests (no Origin) and allow all in dev when no FRONTEND_URL set
		if (!origin || !allowedOrigins) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
	methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
	allowedHeaders: ['Content-Type','Authorization'],
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Socket.IO setup
const io = new Server(server, {
	cors: {
		origin: (origin, callback) => {
			// Allow dev tools and no-origin (native/curl), or restrict to FRONTEND_URL if provided
			if (!origin || !allowedOrigins) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			return callback(new Error('Not allowed by CORS (socket)'));
		},
		credentials: true,
		methods: ['GET', 'POST']
	}
});

// Track connected users by socket id
const socketIdToName = new Map();

io.on('connection', (socket) => {
	// Optional: derive user from JWT if provided
	const auth = socket.handshake.auth || {};
	const token = auth.token;
	let nameFromToken = null;
	if (token && process.env.JWT_SECRET) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// Name is not in token payload by default, client will send name via joinChat
			// Keep decoded id if needed in future
		} catch {}
	}

	// Client announces they joined with a name
	socket.on('joinChat', (name) => {
		const safeName = typeof name === 'string' && name.trim() ? name.trim() : (nameFromToken || 'Guest');
		socketIdToName.set(socket.id, safeName);
		// Broadcast to others
		socket.broadcast.emit('userJoined', { name: safeName });
		// Optionally, acknowledge to the sender (not required by current UI)
	});

	// Relay messages to everyone else
	socket.on('sendMessage', (msg) => {
		// Expect msg = { text, sender, time }
		// Basic shape guard
		if (!msg || typeof msg.text !== 'string') return;
		socket.broadcast.emit('receiveMessage', msg);
	});

	// Handle disconnect
	socket.on('disconnect', () => {
		const name = socketIdToName.get(socket.id);
		if (name) {
			socket.broadcast.emit('userLeft', `${name} left the chat :wave:`);
			socketIdToName.delete(socket.id);
		}
	});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));