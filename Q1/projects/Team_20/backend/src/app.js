import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import studentRouter from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js";

//routes declaration
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("joinClassroom", (classId) => {
    socket.join(classId);
    console.log(`User ${socket.id} joined room: ${classId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { server, io };
