import User from '../models/userModel.js';

export const signup = async (req, res, next) => {

    const { name, email, passwordHash, role } = req.body;
    try {
        const user = await User.create({ name, email, passwordHash, role });
        const token = user.getSignedJwtToken();
        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    try {
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = user.getSignedJwtToken();
        const role = user.role;
        const userId = user._id;
        const name = user.name;
        res.status(200).json({ success: true, token, role, userId, name });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = (req, res, next) => {
    res.status(200).json({ success: true, message: 'User logged out successfully' });
};