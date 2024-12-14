import bcrypt from "bcrypt"
import User from "../models/User.model.js";
import { generateToken } from "../lib/utiles.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res)=>{
    const { name, email, password } = req.body;
    try {
      if(!name || !email || !password){
        return res.status(400).json({ message: "Please fill in all fields" });
      }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters !"});
        }
        const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exixt" });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password,salt);

      const newUser = new User({
        name,
        email,
        password: hash,
      });

      if (newUser) {

        generateToken(newUser._id,res)
        await newUser.save();
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilepic: newUser.profilePic
      });
        
      }else{
        return res.status(400).json({ message: "Failed to create new user" });
      }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res)=>{
  const { email, password } = req.body;
    try {
      const user = await User.findOne({email}) 
      
      if(!user){
        return res.status(404).json({message: "User not found" })
      }
      const ispasswordCorrect = await bcrypt.compare(password, user.password);
      if(!ispasswordCorrect){
        return res.status(400).json({message: "Invalid credentials" })
        }

        generateToken(user._id,res)

        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profilepic: user.profilePic,
        })


    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
      
    }
};

export const logout = (req, res)=>{
   try {
    res.cookie("jwt","",{mexAge: 0});
    res.status(200).json({message: "Logged out successfully" })
   } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
   }
};


export const updateProfile = async (req, res)=>{
try {
  const {profilePic} = req.body
  const userId = req.user._id;

  console.log("updateProfile api called");
  
  if(!profilePic){
    return res.status(400).json({message: "Please add a profile picture" })
  }
  
  console.log("profile pic is goes for uploading");


  const uploadResponse = await cloudinary.uploader.upload(profilePic);

  console.log("profile pic updated");
  

  const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {
    new: true
    })
    res.status(200).json(updatedUser)
  
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}

};

export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    
    const { _id, name, email, profilePic, createdAt, updatedAt } = req.user;
    res.status(200).json({ _id, name, email, profilePic, createdAt, updatedAt });
  } catch (error) {
    console.error("Internal issue:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

