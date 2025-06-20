// import User from '../models/user.js';
// import jwt from 'jsonwebtoken';
// //middleware to protect routes
// export const protectRoute=async (req,res,next)=>{
//     try{
//         const token =req.headers.token;
//         const decoded=jwt.verify(token,process.env.JWT_SECRET);
//         const user=await User.findById(decoded.userId).select("-password");
//         if(!user){
//             return res.json({success:false,message:"User not found"});
//         }
//         req.user=user;         
//         next();
//     }catch (error) {
//         res.json({success:false,message:error.message});
//         console.log(error.message);
//     }
// }

import User from '../models/User.js'; // Make sure this matches your User model file name exactly
import jwt from 'jsonwebtoken';

//middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        
        // Check if token exists
        if (!token) {
            return res.json({success: false, message: "No token provided"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }
        
        req.user = user;         
        next();
    } catch (error) {
        // Better error handling for JWT issues
        if (error.name === 'JsonWebTokenError') {
            return res.json({success: false, message: "Invalid token"});
        }
        if (error.name === 'TokenExpiredError') {
            return res.json({success: false, message: "Token expired"});
        }
        
        res.json({success: false, message: "Authentication failed"});
        console.log(error.message);
    }
}
