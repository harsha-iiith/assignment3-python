const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createSession, endSession, getMySessions, getActiveSession } = require("../controllers/sessionController");

router.post("/", auth, createSession);
router.patch("/:sessionId/end", auth, endSession);
router.get("/", auth, getMySessions);
router.get("/active/:courseName", auth, getActiveSession);

module.exports = router;
