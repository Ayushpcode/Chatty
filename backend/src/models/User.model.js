import mongoose from "mongoose";

const userSchmea = new mongoose.Schema({
  email: {
    type: String,
    requires: true,
    unique: true,
  },
  name: {
    type: String,
    requires: true,
  },
  password: {
    type: String,
    requires: true,
    minlength: 6,
  },

  profilePic: {
    type: String,
    default: "",
  },
},
{timestamps: true}
);

const User = mongoose.model("User", userSchmea);
export default User;

