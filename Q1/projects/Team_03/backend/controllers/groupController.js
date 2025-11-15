const Groups = require("../models/groupModel");
const Users = require('../models/userModel');
const mongoose = require("mongoose");

const createGroup = async (req, res) => {
    const { groupname } = req.body;
    const username = req.user.username;
    const id = req.user.id;

    // console.log(username, id);
    if (!groupname || !username || !username.trim() || !groupname.trim()) {
        return res.status(401).json({ message: 'both fields are required' });
    }
    let data
    try {
        data = await Groups.findOne({
            groupName: groupname
        });
    } catch (err) {
        console.log("mongodb operation failed" + err.message);
        return res.status(401).json({ message: 'server error' });
    }
    if (data) {
        return res.status(401).json({ message: 'group Name already exists' });
    }
    let accesscode;
    while (1) {
        accesscode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const val = await Groups.findOne({ accessCode: accesscode });
        if (!val) break;
    }
    try {
        const newGroup = await Groups.create({
            groupName: groupname,
            faculty: username,
            facultyId: id,
            accessCode: accesscode
        });
        await Users.findOneAndUpdate(
            { username: username },
            { $push: { created_classes: newGroup._id } }
        );
        return res.status(200).json({ message: 'Group created', group: newGroup });
    } catch (err) {
        console.log("mongodb operation failed" + err.message);
        return res.status(401).json({ message: 'server error' });
    }
}

const joinGroup = async (req, res) => {
    const username = req.user.username;
    const { accesscode } = req.body;

    if (!username || !accesscode || !accesscode.trim()) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const group = await Groups.findOne({ accessCode: accesscode });
        if (!group) {
            return res.status(404).json({ message: 'Group code does not exist' });
        }

        await Users.findOneAndUpdate(
            { username },
            { $addToSet: { joined_classes: group._id } }
        );

        return res.status(200).json({ message: 'Joined successfully', groupid: group._id });
    } catch (err) {
        console.error("MongoDB operation failed:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllGroups = async (req, res) => {
    try {
        const groups = await Groups.find({});
        if (!groups || groups.length === 0) {
            return res.status(200).json({ groups: [] });
        }
        const sanitizedGroups = groups.map(group => ({
            id: group._id,
            groupName: group.groupName,
            faculty: group.faculty,
            //   accessCode: group.accessCode,
            createdAt: group.createdAt,
            //   questions: group.questions
        }));

        return res.status(200).json({ groups: sanitizedGroups });
    } catch (err) {
        console.error("Error fetching all groups:", err.message);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

const userGroups = async (req, res) => {
    try {
        const user = req.user;
        // console.log(user.username);
        const data = await Users.findOne({
            username: user.username
        });
        if (!data) {
            return res.status(401).json({ message: 'username doesnot exists' });
        }
        res.status(200).json({
            created_classes: data.created_classes,
            joined_classes: data.joined_classes
        });
    } catch (err) {
        return res.status(401).json({ message: 'server error' });
    }
}

const getQuestion = async (req, res) => {
    try {
        const { groupid } = req.params;
        const data = await Groups.findOne({
            _id: groupid
        });
        if (!data) {
            return res.status(401).json({ message: 'invalid group id' });
        }
        const user = await Users.findOne({ username: req.user.username });
        const isMember = user.created_classes.includes(data._id) || user.joined_classes.includes(data._id);
        if (!isMember) {
            return res.status(403).json({ message: 'You are not part of this group' });
        }
        res.status(200).json({
            groupName: data.groupName,
            faculty: data.faculty,
            facultyid: data.facultyId,
            accessCode: data.accessCode,
            questions: data.questions
        });
    } catch (err) {
        return res.status(401).json({ message: 'server error' });
    }
}

const postQuestion = async (req,res) => {
    try{
        const {groupid} = req.params;
        console.log(groupid);
        const data = await Groups.findOne({
            _id: groupid
        });
        if (!data) {
            return res.status(401).json({ message: 'invalid group id' });
        }
        const {question} = req.body;
        const author = req.user.username

        console.log(question,author);

        if(!question || !author || !question.trim() || !author.trim()){
            return res.status(401).json({ message: 'both fields are required' });
        }
        const user = await Users.findOne({ username: author });
        // const isMember = user.created_classes.includes(data.groupName) || user.joined_classes.includes(data.groupName);
        // if (!isMember) {
        //     return res.status(403).json({ message: 'You are not part of this group' });
        // }
        const newQuestion = {
            _id: new mongoose.Types.ObjectId(),
            author : author.trim(),
            questionText : question.trim(),
            questionTimestamp : Date.now(),
            status : "unanswered",
            important : "no"
        }
        await Groups.findOneAndUpdate(
            { _id: groupid },
            { $push: { questions: newQuestion } }
        );
        res.status(200).json({
            message: "Question added successfully",
            questionid : newQuestion._id, 
            author : newQuestion.author,
            questionText : newQuestion.questionText,
            questionTimestamp : newQuestion.questionTimestamp,
            status : newQuestion.status,
            important : newQuestion.important
        });
    } catch (err) {
        return res.status(401).json({ message: 'server error' });
    }
}

// const updateQuestion = async (req,res) => {
//     try{
//         const {groupid,questionid} = req.params;
//         // console.log(groupid, questionid);
//         const data = await Groups.findOne({
//             _id : groupid
//         });
//         // console.log(data);
//         if(!data){
//             return res.status(401).json({ message: 'invalid group id' });
//         }
//         const {status} = req.body;
//         console.log(status, questionid);
//         if(!status){
//             return res.status(401).json({ message: 'field are required' });
//         }
//         const user = await Users.findOne({ username: req.user.username });
//         // const isMember = user.created_classes.includes(data.groupName) || user.joined_classes.includes(data.groupName);
//         // if (!isMember) {
//         //     return res.status(403).json({ message: 'You are not part of this group' });
//         // }
//         console.log(user);
//         const updatefield = {"questions.$.status": status};
//         if (status == "answered") {
//             // updatefield["questions.$.answerText"] = answer;
//             updatefield["questions.$.answerTimestamp"] = new Date();
//             updatefield["questions.$.status"] = status; 
//         }
//         console.log(",,,,");
//         const update = await Groups.findOneAndUpdate(
//             { _id: groupid, "questions._id": questionid }, //  "faculty": req.user.username
//             { $set: updatefield },
//             { new: true }
//         );
//         console.log(".....");
//         if (!update) {
//             return res.status(404).json({ message: "Question not found" });
//         } else {
//             return res.status(201).json({ message: "Question updated successfully" });
//         }
//     }catch(err){
//         return res.status(401).json({ message: 'server error' });
//     }
// }

const updateQuestion = async (req, res) => {
  try {
    const { groupid, questionid } = req.params;

    // check group existence
    const group = await Groups.findById(groupid);
    if (!group) {
      return res.status(404).json({ message: "Invalid group id" });
    }

    const { status, important } = req.body; // allow both fields

    if (!status && !important) {
      return res.status(400).json({ message: "At least one field (status or important) is required" });
    }

    // check if user exists
    const user = await Users.findOne({ username: req.user.username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // build update fields dynamically
    const updatefield = {};
    if (status) {
      updatefield["questions.$.status"] = status;

      if (status === "answered") {
        updatefield["questions.$.answerTimestamp"] = new Date();
      }
    }

    if (important) {
      updatefield["questions.$.important"] = important;
    }

    // update
    const updatedGroup = await Groups.findOneAndUpdate(
      { _id: groupid, "questions._id": questionid },
      { $set: updatefield },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const deleteQuestion = async (req, res) => {
    try {
        const { groupid, questionid } = req.params;
        const data = await Groups.findOne({
            _id: groupid
        });
        if (!data) {
            return res.status(401).json({ message: 'invalid group id' });
        }
        if (data.faculty !== req.user.username) {
            return res.status(403).json({ message: 'Only faculty can delete questions' });
        }
        const update = await Groups.findByIdAndUpdate(
            groupid,
            { $pull: { questions: { _id: questionid } } },
            { new: true }
        );
        if (!update) {
            return res.status(404).json({ message: "Question not found" });
        }
        else return res.status(201).json({ message: "Question deleted succesfully" });
    } catch (err) {
        return res.status(401).json({ message: 'server error' });
    }
}

const fetchBasedOnStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const groups = await Groups.find(
            { status: status }
        );
        res.status(201).json({
            groups: groups
        })
    } catch (err) {
        return res.status(401).json({ message: 'server error' });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { groupid } = req.params;
        const data = await Groups.findOne({
            _id: groupid
        });
        if (!data) {
            return res.status(401).json({ message: 'invalid group id' });
        }
        if (data.faculty !== req.user.username) {
            return res.status(403).json({ message: 'Only faculty can change the status' });
        }
        const update = await Groups.findOneAndUpdate(
            { _id: groupid },
            { status: status },
            { new: true }
        );
        res.status(201).json({
            message: "status changed successfully"
        })
    } catch (err) {
        return res.status(401).json({ message: 'server error' });
    }
}

const getUserRole = async (req, res) => {
    try {
        const group = await Groups.findById(req.params.classId);
        if (!group) return res.status(404).json({ message: "Class not found" });

        const userId = req.user.id;
        const user = await Users.findById(userId);
        let role = "student";

        console.log(userId);
        console.log(user);
        if (group.facultyId.toString() === userId) role = "instructor";
        else if (user.created_classes.includes(req.params.classId)) role = "instructor";

        res.json({ role });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const getClassesDetails = async (classIdArray) => {
    if (!classIdArray || classIdArray.length === 0) return [];

    // Find all groups whose IDs are in the provided array
    const classes = await Groups.find({
        _id: { $in: classIdArray }
    }).select('groupName'); // Only fetch the groupName field

    // Map the results to the structure expected by the frontend
    return classes.map(cls => ({
        // Ensure no variable names change:
        name: cls.groupName || 'Unknown Class'
    }));
};

module.exports = { createGroup, joinGroup, userGroups, getQuestion, postQuestion, updateQuestion, deleteQuestion, getAllGroups, getUserRole, fetchBasedOnStatus, changeStatus, getClassesDetails};
