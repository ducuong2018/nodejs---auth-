import express,{Router} from "express";
const router = express.Router();
import {login,refreshToken,register,verifyRegisterOtp,forgotPassword,verifyForgotPasswordOtp,changePassWord} from "../controllers/AuthController";

router.post("/login", login);
router.post("/refresh-token", refreshToken);

//register
router.post('/register',register)
router.post('/verifyOtp',verifyRegisterOtp);
//forgot
router.post('/forgot_password',forgotPassword);
router.post('/verify_forgot_password',verifyForgotPasswordOtp);
router.put('/change_password',changePassWord);


export default router;

