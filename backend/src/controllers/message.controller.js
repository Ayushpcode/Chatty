import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/User.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getMessages = async(req, res) => {
  try {
    const {id: userToChartId} = req.params
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChartId },
            { senderId: userToChartId, receiverId: myId },
        ]
    });
    res.status(200).json(messages);

  } catch (error) {
    console.log(error.messages)
    res.status(500).json({ message: "Error fetching messages" });
  }
};


export const sendMessages = async (req, res)=>{
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMassage = new Message({
          senderId,
          receiverId,
          text,
          image: imageUrl,
        })
        await newMassage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage", newMassage);
        }

        res.status(201).json(newMassage);

    } catch (error) {
        console.log(error.message)
    res.status(500).json({ message: "Error sending message" });
    }
};