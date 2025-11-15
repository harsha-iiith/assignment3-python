import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./db.js";
import router from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
import Lecture from "./models/Lectures.js";
import Question from "./models/Question.js";


dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use("/api", router);
app.use("/auth", userRouter);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinLecture", async (lectureId) => {
    // const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    // rooms.forEach((room) => {
    //   socket.leave(room);
    // });

    socket.join(lectureId);
    console.log(`Client ${socket.id} joined lecture ${lectureId}`);

    // socket.to(lectureId).emit("getLectureQuestions", []);

    const ques = await Lecture.findById(lectureId).populate({
      path: "questions",
    });
    console.log(ques);
    socket.to(lectureId).emit("getLectureQuestions", ques);
  });

  socket.on("createQuestion", async ({ lectureId, quesObj }) => {
    try {
      // const output = await submitCode(roomId);
        console.log(lectureId);
        
      const ques = new Question(quesObj);
      await ques.save();
      const lecture = await Lecture.findById(lectureId);
      console.log(ques);
      
      lecture.questions.push(ques._id);
      await lecture.save();  

      socket.nsp.in(lectureId).emit("getUpdatedQuestion", ques);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("updateQuestion", async ({ lectureId, quesObj }) => {
    try {
      // const output = await submitCode(roomId);
      const ques = await Question.findById(quesObj._id);
      ques.status = quesObj.status;
      await ques.save();
      socket.nsp.in(lectureId).emit("getUpdatedQuestion", ques);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("deleteQuestion", async ({ lectureId, quesId }) => {
    try {
      const ques = await Question.findByIdAndDelete(quesId);
      socket.nsp.in(lectureId).emit("getDeletedQuestion", { quesId: quesId });
    } catch (error) {}
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("leaveRoom", (lectureId) => {
    socket.leave(lectureId);
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
