import express from "express";
import { userSigninValidator, userSignupValidator } from "../validators/authValidator.js";
import { requiredSignIn } from "../utils/requiredSignIn.js";
import { runValidation } from "../validators/index.js";
import {
    registerUserCtrl,
    loginUserCtrl,
    signoutUserCtrl
} from "../controllers/userControllers.js";
const router = express.Router();


// @ routs '/users'
router.route("/signup").post(userSignupValidator, runValidation, registerUserCtrl)
router.route("/signin").post(userSigninValidator, runValidation, loginUserCtrl)
router.route("/signout").post(requiredSignIn, signoutUserCtrl)
export default router;