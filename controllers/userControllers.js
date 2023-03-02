import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import shortId from "shortid";





const registerUserCtrl = asyncHandler(async (req, res) => {
  const { firstName, middleName, lastName, email, password, confirmPassword} = req.body;
  if(confirmPassword !== password){
     res.status(400)
    throw new Error("password should match");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User with this email already exists. Please login");
   
  }
  let username = shortId.generate();
  const user = await User.create({
    firstName,
    username,
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
// all user ctrl
const fetchAllUserCtrl =asyncHandler(async (req, res) =>{
  try {
    const loggedInUser = await User.findById(req.auth.id)
    // console.log(loggedInUser);
    if(loggedInUser.isAdmin){
      const users = await User.find().select('-hashed_password -salt');
      res.json(users);    

    } else{
      const users = await User.find({isAdmin: false})
      .select('-hashed_password -salt')
      res.json(users); 
    }
  } catch (error) {
    res.status(500);
    throw new Error("something went wrong");
  }
   

})
// update user ctrl
const updateUserCtrl = asyncHandler(async (req, res) =>{
  // console.log(Object.keys(req.body) );
  const bodyKeys = Object.keys(req.body)
  if (bodyKeys.includes('password')){
    res.status(500);
    throw new Error("you can not update your password");
  }
  const user = await User.findById( req.auth.id)
  if (user){
    (user.firstName = req.body.firstName || user.firstName),
    (user.middleName = req.body.middleName || user.middleName);
    (user.lastName = req.body.lastName || user.lastName),
    (user.email = req.body.email || user.email);
    (user.Department = req.body.Department || user.Department);  
    (user.updatedAt = Date.now());  


    const updatedUser = await user.save(); 
    updatedUser.hashed_password = undefined
    updatedUser.salt = undefined
   
    res.status(201).json(updatedUser)
  }else {
    res.status(404);
    throw new Error("User not found");
  }
})

// all user ctrl
const fetchAnUserCtrl =asyncHandler(async (req, res) =>{
  const {id} = req.params
  try {
    const loggedInUser = await User.findById(req.auth.id)
    const user = await User.findById(id).select('-hashed_password -salt');
    // console.log(loggedInUser);
    if(!loggedInUser.isAdmin && user.isAdmin){
      res.status(500);
      throw new Error("admin only"); 
    } else{      
      res.json(user); 
    }
  } catch (error) {
    res.status(500);
    throw new Error("something went wrong");
  }
   

})





export {
    registerUserCtrl,
    loginUserCtrl,
    signoutUserCtrl,
    fetchAllUserCtrl,
    updateUserCtrl,
    fetchAnUserCtrl
}