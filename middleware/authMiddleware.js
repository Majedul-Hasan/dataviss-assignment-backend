import User from "../models/userModel.js";

export const authMiddleware = (req, res, next)=>{ 
    const {id: authUserId} = req.auth ;
   const user = User.findById(authUserId);
   req.user = user;

    next()

}
