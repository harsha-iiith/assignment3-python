const Class = require("../models/Lectures");

exports.createClass = async (req, res) => {
  const { title, code } = req.body;
  try {
    const cls = await Class.create({ 
      title, 
      code, 
      instructor: req.user._id,
      students: [req.user._id] // Add instructor as first "student" for display purposes
    });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinClass = async (req, res) => {
  const { code } = req.body;
  try {
    const cls = await Class.findOne({ code });
    if (!cls) return res.status(404).json({ message: "Class not found" });

    if (!cls.students.includes(req.user._id)) {
      cls.students.push(req.user._id);
      await cls.save();
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
