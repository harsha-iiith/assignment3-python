import mongoose from "mongoose"
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema (
    {
        fname: { type: String, required: true, trim: true },
        lname: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        role: { 
            type: String, 
            enum: ["instructor", "student"], 
        },
        courses: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Course" 
            }
        ],
  },
);
 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
