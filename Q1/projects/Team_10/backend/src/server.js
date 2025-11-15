import express from "express";
import dotenv from "dotenv";
// import router from "./routes/routes.js";

import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';

import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config(); 

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());   
app.use(express.json());      
app.use(express.urlencoded({ extended: true }));

// Add a test route to check cookies
app.get('/test-cookies', (req, res) => {
  console.log('All cookies:', req.cookies);
  res.json({ 
    cookies: req.cookies,
    hasCookieParser: !!req.cookies 
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/lectures', lectureRoutes);


const PORT = process.env.PORT || 5001;


if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
      console.log("Cookie parser enabled");
    });
  });
}

export default app;