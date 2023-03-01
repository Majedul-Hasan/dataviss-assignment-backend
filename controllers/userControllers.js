import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";




const registerUserCtrl = asyncHandler(async (req, res) => {
  const { firstName, middleName, lastName, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User with this email already exists. Please login");
  }
  const user = await User.create({
    firstName,
    middleName,
    lastName,
    email,
    password,
    createdAt: Date.now(),
    isOnline: true
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      middleName: user?.middleName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("invalid user data");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) =>{
  const {email, password } = req.body 
  const user = await User.findOne({ email });
  if (user && (await user.authenticate(password))) {
    await User.findByIdAndUpdate(user._id, {
      lastSeenAt: Date.now(),
      isOnline: true
    }, {new: true})
    user.hashed_password = undefined
    user.salt = undefined
    user.isOnline = true

    res.json({     
      token: generateToken(user._id),
      user
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
})

// sign out ctrl
const signoutUserCtrl =asyncHandler(async (req, res) =>{
  const user  = await User.findById(req.auth.id);
  // console.log(user);
  if (user){
    await User.findByIdAndUpdate(user._id, {
      lastSeenAt: Date.now(),
      isOnline: false
    })
    res.json({
      message: 'Signout success!'
 })
  }
   

})



export {
    registerUserCtrl,
    loginUserCtrl,
    signoutUserCtrl
}