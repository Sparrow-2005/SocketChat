import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
//SignUp new User
export const signup = async (req, res) => {
    const {email,fullName,password,bio}=req.body;
    try {
        if(!fullName||!email||!password){
            return res.json({success:false,message:"Please fill all the fields"});
        }
        //Check if user already exists
        const user=await User.findOne({email});
        if(user){
            return res.json({success:false,message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //Create new user
        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        })
        const token=generateToken(newUser._id);
        //res.json({success:true,userData:newUser,token,message:"Account created successfully"});
        const userWithoutPassword = await User.findById(newUser._id).select("-password");
        res.json({success:true,userData:userWithoutPassword,token,message:"Account created successfully"});
    } catch (error) {
        res.json({success:false,message:error.message});
        console.log(error.message); 
    }
}
//Controller to login user
export const login = async (req, res) => {

    try {
        const {email,password}=req.body;
        const userData=await User.findOne({email});
        if(!userData){
            return res.json({success:false,message:"User not found"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token=generateToken(userData._id);
        //res.json({success:true,userData,token,message:"Login successful"});
        const userWithoutPassword = await User.findById(userData._id).select("-password");
        res.json({success:true,userData:userWithoutPassword,token,message:"Login successful"});
    } catch (error) {
        res.json({success:false,message:error.message});
        console.log(error.message); 
    }
}

//Controller to check if user is authenticated
export const checkAuth=(req, res) => {
    res.json({success:true,user:req.user});
}

//Controller to get user profile
 export const updateProfile = async (req, res) => {
    try {
        const {profilePic,fullName,bio}=req.body;
        const userId=req.user._id;
        let updateUser;
        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true}); // Added assignment
        }else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updateUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true}).select("-password");
        }
        res.json({success:true,user:updateUser});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
 }