import express from "express";
import { registerUserCtrl } from "../controllers/userControllers.js";
import { userSignupValidator } from "../validators/authValidator.js";
import { runValidation } from "../validators/index.js";
const router = express.Router();


// @ routs '/users'
router.route("/").post(userSignupValidator, runValidation, registerUserCtrl)
export default router;