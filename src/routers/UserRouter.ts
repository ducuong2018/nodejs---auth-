import express,{Router} from "express";
const router = express.Router();
export default router;
import {infoAccount,updateProfileBasicUser,updateProfileContact,addProfile} from "../controllers/UserController";
import {isAuth} from  "../middlewares/AuthMiddleware";
router.put("/update_profile",isAuth,addProfile);
router.get("/user",isAuth,infoAccount);
router.put("/user/basic",isAuth,updateProfileBasicUser);
router.put("/user/contact",isAuth,updateProfileContact);

