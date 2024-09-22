const User = require('../models/user.model.js');
const uploadOnCloudinary=require('../utils/cloudinary.js');
const getUsers = async (req, res) => {

  const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
  if (!users) return res.status(500).json({ message: "no user found" });
  return res.status(200).json(users);
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found");
    let cloudPath;
    const avatarpath = req?.file?.path;
    if (avatarpath) {
      cloudPath = await uploadOnCloudinary(avatarpath);
    }

    const updatedUserData = {
      ...req.body,
      avatar: cloudPath ? cloudPath.url : user.avatar // If cloudPath is available, use its URL, otherwise retain the existing avatar URL
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedUserData, { new: true });

    if (updatedUser) return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = { getUsers,updateUser };