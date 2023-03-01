import { check } from "express-validator";

export const userSignupValidator = [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('firstName is required'),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('lastName is required'),
    check('email')
        .isEmail()
        .withMessage('must be a valid email address'),
    check('password')
       .isLength({min: 6, max: 12})
       .withMessage('password must be at least 6 characters long and not over 12 characters '),
 ]