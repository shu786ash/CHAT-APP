const User = require('../models/user.model.js');
const uploadOnCloudinary=require('../utils/cloudinary.js');
const generateToken = async (id) => {
  try {
    const user = await User.findOne(id);
    const accessToken = await user.generateAcessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validityBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return "error while generating tokens";
  }
}

const registerUser = async (req, res) => {
  let { userName, fullName, email, password } = req.body;
  if ([userName, fullName, email, password].some((field) => field.trim() === "")) {
    return res.status(400).json({
      message: "All fields required"
    })
  }
  const existedUser = await User.findOne({
    $or: [{ userName, email }]
  });

  if (existedUser) {
    return res.status(409).json({
      message: "User Already Exists"
    })
  }
  const avatarpath=req.file.path;
  const cloudPath=await uploadOnCloudinary(avatarpath);
  const user = await User.create({
    userName,
    fullName,
    email,
    password,
    avatar:cloudPath.url
  })

  if (!user) {
    return res.status(500).json({
      message: "cant create user"
    })
  }

  return res.status(200).json({
    message: "user created succesfully",
    user
  })

}

const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (email === null || password === null) {
    return res.status(400).json({
      message: "user details required"
    })
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "user not found" });
  const validpass = await user.isPasswordCorrect(password);
  if (!validpass) return res.status(409).json({ message: "incorrect password" });
  const { accessToken, refreshToken } = await generateToken(user._id);
  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
    message: "user loggedIn successfully",
    user
  })
}

const logoutUser = async (req, res) => {

  await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        refreshToken: null,
      }
    },
    {
      new: true
    }
  );
  const options = {
    httpOnly: true,
    secure: true
  }
  res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
    message: "user loggedout successfully",
    user: await User.findById(req.user._id)
  });
}


module.exports = { registerUser, loginUser, logoutUser };