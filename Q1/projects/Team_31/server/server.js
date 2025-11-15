require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const http = require('http');
const { Server } = require("socket.io");

// Connect to Database
connectDB();

const app = express();

// HTTP server from the Express app
const server = http.createServer(app);

//Initialize Socket.IO and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/api', (req, res) => {
    res.json({ message: "Hello from the VidyaVichar server!" });
});

// listener for new client connections
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Listen for when a client disconnects
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Define Routes
app.use('/api/questions', require('./routes/questions')(io));


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
