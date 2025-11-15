const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const { getClassesDetails } = require('./groupController'); 

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await Users.create({ username, email, password });

    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax", // for localhost; use "None" + secure:true in production
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Users.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Controller Function for /profile endpoint
const getProfileDetails = async (req, res) => {
  try {
    // Fetch user, including the created_classes and joined_classes arrays of IDs
    const user = await Users.findById(req.user.id).select("-password created_classes joined_classes");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch details for created classes (Teacher role)
    const createdClassesDetails = await getClassesDetails(user.created_classes);
    const createdClasses = createdClassesDetails.map(cls => ({
        name: cls.name,
        role: 'Teacher'
    }));

    // Fetch details for joined classes (Student role)
    const joinedClassesDetails = await getClassesDetails(user.joined_classes);
    const joinedClasses = joinedClassesDetails.map(cls => ({
        name: cls.name,
        role: 'Student'
    }));
    
    // Construct the final profile object
    const profileData = {
      name: user.username, 
      email: user.email,
      createdClasses,
      joinedClasses,
    };

    // Send the structured data back to the frontend
    res.status(200).json(profileData);

  } catch (err) {
    console.error("Error fetching profile details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { registerUser, loginUser, getProfileDetails };