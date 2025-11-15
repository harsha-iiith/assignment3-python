const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: String,
  code: { type: String, unique: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Class", ClassSchema);
