import Classroom from '../models/classroomModel.js';
import crypto from 'crypto';

export const createClassroom = async (req, res) => {
  const { name } = req.body;
  const joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();

  const classroom = new Classroom({
    name,
    teacher: req.user._id,
    joinCode,
  });
  const createdClassroom = await classroom.save();
  res.status(201).json(createdClassroom);
};

export const joinClassroom = async (req, res) => {
  const { joinCode } = req.body;
  const classroom = await Classroom.findOne({ joinCode });

  if (classroom) {
    if (classroom.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this class' });
    }
    classroom.students.push(req.user._id);
    await classroom.save();
    res.json(classroom);
  } else {
    res.status(404).json({ message: 'Class with this code not found' });
  }
};

export const getMyClasses = async (req, res) => {
  if (req.user.role === 'teacher') {
    const classes = await Classroom.find({ teacher: req.user._id });
    res.json(classes);
  } else {
    const classes = await Classroom.find({ students: req.user._id });
    res.json(classes);
  }
};