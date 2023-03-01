import express from "express";
import { userSigninValidator, userSignupValidator } from "../validators/authValidator.js";
import { runValidation } from "../validators/index.js";
import {
    registerUserCtrl,
    loginUserCtrl
} from "../controllers/userControllers.js";
const router = express.Router();


// @ routs '/users'
router.route("/signup").post(userSignupValidator, runValidation, registerUserCtrl)
router.route("/signin").post(userSigninValidator, runValidation, loginUserCtrl)
export default router;