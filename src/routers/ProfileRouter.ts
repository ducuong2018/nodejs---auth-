
import {addCompanyInfo,companyIntroduction,productionCapacity,qualityControl,certification,updateCompanyInfo} from "../controllers/ProfileCompanyController";
import express,{Router} from "express";
const router = express.Router();
import {isAuth} from  "../middlewares/AuthMiddleware";

router.post("/profile_company",isAuth,addCompanyInfo);
router.put("/profile_company",isAuth,updateCompanyInfo)

//info advan
router.post("/companys/profile_advanced/company_introduction",isAuth,companyIntroduction);
router.put("/companys/profile_advanced/production_capacity",isAuth,productionCapacity);
router.put("/companys/profile_advanced/quality_control",isAuth,qualityControl);
router.put("/companys/profile_advanced/certification",isAuth,certification);


export default router;
