import express from "express";
import { getAllUsers, createUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.post("/login", loginUser);

export default router;
