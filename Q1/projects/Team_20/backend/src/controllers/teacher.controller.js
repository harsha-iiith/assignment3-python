
import { asyncHandler } from "../utils/asyncHandler.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js"
import { Class } from "../models/class.model.js"
import { Query } from "../models/query.model.js"

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const generateAccessAndRefreshTokens = async (TeacherId) => {
  try {
    const teacher = await Teacher.findById(TeacherId);
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    teacher.refreshToken = refreshToken;
    await teacher.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerTeacher = asyncHandler(async (req, res) => {
  const { email, Name, password } = req.body;
  console.log(email);
  if ([Name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedTeacher = await Teacher.findOne({ email });
  console.log(existedTeacher);
  if (existedTeacher) {
    throw new ApiError(409, "Teacher already exist");
  }

  const teacher = await Teacher.create({
    email,
    Name,
    password,
  });

  const createdTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );

  if (!createdTeacher) {
    throw new ApiError(
      500,
      "Something went wrong while registering the Teacher"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdTeacher, "Teacher Registered Successfully")
    );
});

const loginTeacher = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    throw new ApiError(404, "Teacher does not exist");
  }

  const isPasswordValid = await teacher.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    teacher._id
  );

  const loggedInTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );
  console.log(teacher);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          userRole: "teacher",
          user: loggedInTeacher,
          accessToken,
          refreshToken,
        },
        "Teacher logged in successfully"
      )
    );
});

const logoutTeacher=asyncHandler(async(req,res)=>{
  await Teacher.findByIdAndUpdate(req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"Teacher logged Out Successfully"))
})

const createClass = asyncHandler(async (req, res) => {
  if (req.userType != "Teacher") {
    throw new ApiError(401, "You are not authorized to create class");
  }
  const { title } = req.body;
  console.log(title);
  if ([title].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // const accessCode = Class.generateAccessCode();
  const classs = await Class.create({
    title,
    teacher: req.user._id,
  });

  const createdClass = await Class.findById(classs._id);

  if (!createdClass) {
    throw new ApiError(500, "Something went wrong while creating class");
  }
  const accessCode = createdClass.generateAccessCode();
  createdClass.accessCode = accessCode;
  await createdClass.save({ validateBeforeSave: false });

  // Emit websocket event to all students for new class creation
  const io = req.app.get("io");
  if (io) {
    io.emit("classCreated", createdClass);
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdClass, "Class Created Successfully"));
});

const answerQuery = asyncHandler(async (req, res) => {
  if (req.userType != "Teacher") {
    throw new ApiError(401, "You are not authorized to answer the query");
  }
  // Expecting statusValue to be 'Answered' or 'Unanswered'
  const { queryId, statusValue } = req.body;
  if (!queryId || !statusValue) {
    throw new ApiError(400, "Provide queryId and statusValue");
  }

  // Validate that the status value is one of the allowed enums
  if (statusValue !== "Answered" && statusValue !== "Unanswered") {
    throw new ApiError(400, "Invalid status value provided.");
  }

  // Populate the class field after update to get the class ID for the socket room
  const query = await Query.findByIdAndUpdate(
    queryId,
    {
      $set: {
        status: statusValue,
      },
    },
    {
      new: true,
    }
  ).populate("class"); // Populate class to get ID

  if (!query) {
    throw new ApiError(404, "Query does not exist");
  }

  const io = req.app.get("io");
  if (io) {
    // Emit to the specific classroom 'room'
    io.to(query.class._id.toString()).emit("queryUpdate", {
      classId: query.class._id.toString(),
      message: `Query status changed to ${statusValue}`,
    });
  }
  // ----------------------------------

  const message =
    statusValue === "Answered"
      ? "Query answered successfully"
      : "Query marked unanswered successfully";

  return res.status(200).json(new ApiResponse(200, query, message));
});

const impQuery = asyncHandler(async (req, res) => {
  if (req.userType !== "Teacher") {
    throw new ApiError(401, "You are not authorized to mark the query.");
  }

  const { queryId, isImportant } = req.body;

  if (!queryId || isImportant === undefined) {
    throw new ApiError(
      400,
      "Provide queryId and the isImportant state (true/false)."
    );
  }

  // Populate the class field after update to get the class ID for the socket room
  const query = await Query.findByIdAndUpdate(
    queryId,
    {
      $set: {
        isImportant: isImportant,
      },
    },
    {
      new: true,
    }
  ).populate("class"); // Populate class to get ID

  if (!query) {
    throw new ApiError(404, "Query does not exist");
  }

  // --- SOCKET.IO IMPLEMENTATION ---
  const io = req.app.get("io");
  if (io) {
    // Emit to the specific classroom 'room'
    io.to(query.class._id.toString()).emit("queryUpdate", {
      classId: query.class._id.toString(),
      message: `Query importance toggled`,
    });
  }
  // ----------------------------------

  const message = isImportant
    ? "Query marked important successfully"
    : "Query marked unimportant successfully";

  return res.status(200).json(new ApiResponse(200, query, message));
});

const getAllClassQueries = asyncHandler(async (req, res) => {
  if (req.userType !== "Teacher") {
    throw new ApiError(401, "You are not authorized to view queries");
  }

  const { classId } = req.query;

  if (!classId) {
    throw new ApiError(400, "Class ID is required to fetch queries");
  }

  const classs = await Class.findOne({ _id: classId, teacher: req.user._id });
  if (!classs) {
    throw new ApiError(
      403,
      "Class not found or you are not the instructor for this class"
    );
  }

  const queries = await Query.find({ class: classId })
    .populate("student", "Name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, queries, "Class queries fetched successfully"));
});
const getAllCreatedEvents = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, [], "Events fetched successfully (Placeholder)")
    );
});
const getTeacherClasses = asyncHandler(async (req, res) => {
  // 1. Authorization check
  if (req.userType !== "Teacher") {
    throw new ApiError(
      403,
      "Access denied. Only teachers can view their classes."
    );
  }

  // 2. Database query: Find all classes where the teacher field matches the current user's ID
  const classes = await Class.find({ teacher: req.user._id }).sort({
    createdAt: -1,
  }); // Sort by newest first

  // 3. Return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, classes, "Teacher's classes fetched successfully")
    );
});

const endClass = asyncHandler(async (req, res) => {
  if (req.userType !== "Teacher") {
    throw new ApiError(401, "You are not authorized to end this class");
  }
  const { classId } = req.body;
  if (!classId) {
    throw new ApiError(400, "Class ID is required");
  }
  // Only allow the teacher who owns the class to end it
  const classDoc = await Class.findOne({ _id: classId, teacher: req.user._id });
  if (!classDoc) {
    throw new ApiError(
      403,
      "Class not found or you are not the instructor for this class"
    );
  }
  classDoc.status = "notActive";
  await classDoc.save();

  // Remove activeClass from all students who have this class as activeClass
  await Student.updateMany(
    { activeClass: classId },
    { $unset: { activeClass: "" } }
  );

  // Emit a 'classEnded' event to the classroom room so all students are notified
  const io = req.app.get("io");
  if (io) {
    io.to(classId.toString()).emit("classEnded", {
      classId: classId.toString(),
      message: "This class has ended.",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, classDoc, "Class ended successfully"));
});

// Delete a query by queryId (teacher only, no socket)
const deleteQuery = asyncHandler(async (req, res) => {
  if (req.userType !== 'Teacher') {
    throw new ApiError(403, 'Only teachers can delete queries');
  }
  const { queryId } = req.params;
  if (!queryId) {
    throw new ApiError(400, 'Query ID is required');
  }
  const query = await Query.findById(queryId);
  if (!query) {
    throw new ApiError(404, 'Query not found');
  }
  await Query.findByIdAndDelete(queryId);
  return res.status(200).json(new ApiResponse(200, {}, 'Query deleted successfully'));
});

export {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  createClass,
  answerQuery,
  impQuery,
  getAllClassQueries,
  getAllCreatedEvents,
  getTeacherClasses,
  endClass,
  deleteQuery
};
