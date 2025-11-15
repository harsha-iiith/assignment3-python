import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/class.model.js"
import { Query } from "../models/query.model.js"

export const options = {
  httpOnly: true,
  secure: true,
};

export const generateAccessAndRefreshTokens = async (StudentId) => {
  try {
    const student = await Student.findById(StudentId);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};


const registerStudent = asyncHandler(async (req, res) => {
  const { email, Name, Roll_Number, password } = req.body;
  console.log(email, Name, Roll_Number, password);
  if (
    [Name, email, Roll_Number, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("jdfk");
  const existedStudent = await Student.findOne({
    $or: [{ Roll_Number }, { email }],
  });
  console.log("jdfk");
  console.log(existedStudent);
  if (existedStudent) {
    throw new ApiError(409, "Student already exist");
  }

  const student = await Student.create({
    Name,
    email,
    Roll_Number,
    password,
  });
  console.log(student);
  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while registering the student"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdStudent, "Student Registered Successfully")
    );
});

const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  console.log(email, password);
  const student = await Student.findOne({ email });
  if (!student) {
    throw new ApiError(404, "Student does not exist");
  }

  const isPasswordValid = await student.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    student._id
  );

  const loggedInStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );
  console.log(student);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          userRole: "student",
          user: loggedInStudent,
          accessToken,
          refreshToken,
        },
        "Student logged in successfully"
      )
    );
});

const logoutStudent=asyncHandler(async(req,res)=>{
  await Student.findByIdAndUpdate(req.user._id,
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
  .json(new ApiResponse(200,{},"Student logged Out Successfully"))
})

const createQuery=asyncHandler(async(req,res)=>{
  const {queryText,classId}=req.body;
  if(
      [queryText,classId].some((field)=>!field||field.trim()==="")
    ){
      throw new ApiError(400,"All fields are required")
    }
  // Check if class exists and is active
  const classInstance = await Class.findById(classId);
  if (!classInstance) {
    throw new ApiError(404, "Class does not exist");
  }
  if (classInstance.status !== 'active') {
    throw new ApiError(400, "Class is not active");
  }
  const query=await Query.create({
    class:classId,
    queryText,
    student:req.user._id
  })
  const createdQuery=await Query.findById(query._id).populate("student", "Name email")
  if(!createdQuery){
    throw new ApiError(500,"Something went wrong while creating query")
  }
  // --- SOCKET.IO IMPLEMENTATION ---
  const io = req.app.get('io');
  if (io) {
      io.to(createdQuery.class.toString()).emit('queryUpdate', { 
          classId: createdQuery.class.toString(),
          message: "New query posted"
      });
  }
  return res.status(201).json(
    new ApiResponse(200,createdQuery,"Query created Successfully")
  )
})



const getCreatedQueries = asyncHandler(async(req, res) => {
  const { classId } = req.query; 

  // Only allow if student has joined the class (activeClass matches classId)
  if (classId && req.user.userRole === 'student') {
    if (!req.user.activeClass || req.user.activeClass.toString() !== classId) {
      throw new ApiError(403, "You have not joined this class. Please enter the access code to join.");
    }
  }

  const filter = { student: req.user._id };
  if (classId) {
    filter.class = classId;
  }
  const queries = await Query.find(filter)
    .populate("student", "Name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, queries, "Your queries fetched successfully"));
})

const getAllActiveClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find({
    status: "active",
  })
    .select("-accessCode")
    .populate("teacher", "Name email")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, classes, "All active classes fetched successfully")
    );
});

const joinClass = asyncHandler(async (req, res) => {
  const { classId, accessCode } = req.body;

  if (!classId || !accessCode) {
    throw new ApiError(400, "Class ID and Access Code are required");
  }

  // Renamed from 'classs' to 'classInstance' for safety
  const classInstance = await Class.findById(classId);

  if (!classInstance) {
    throw new ApiError(404, "Class does not exist");
  }

  if (classInstance.status === "notActive") {
    throw new ApiError(400, "Class has ended");
  }

  if (classInstance.accessCode !== accessCode) {
    throw new ApiError(401, "AccessCode is not correct");
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        activeClass: classId,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!updatedStudent) {
    throw new ApiError(500, "Failed to update student's active class status.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { student: updatedStudent },
        "Access granted and active class set successfully"
      )
    );
});


export {
  registerStudent,
  loginStudent,
  logoutStudent,
  createQuery,
  getCreatedQueries,
  getAllActiveClasses,
  joinClass
};
