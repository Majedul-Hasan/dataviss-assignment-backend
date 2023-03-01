import { expressjwt } from "express-jwt";
import dotenv from "dotenv";
dotenv.config();


 const requiredSignIn = expressjwt({
   secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth",
 
 })

 export {requiredSignIn}