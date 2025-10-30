const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
}

exports.registerUser = async (req, res) => {
    console.log(req.body);
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message: "User already exists"});
        }  
        
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = generateToken(user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } 
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.getAllProfiles = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    }
    catch (error) {
        console.error("Get all profiles error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {name, profileImageUrl} = req.body;   
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }  
        user.name = name || user.name;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;

        await user.save();
        res.json({message: "Profile updated successfully" });
    }
    catch (error) {
        console.error("Get all profiles error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.json({message: "Profile deleted successfully" });
    }
    catch (error){
        console.error("Delete profile error:", error);
        res.status(500).json({message: "Server error"});
    }
}