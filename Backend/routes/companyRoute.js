import express from "express";
import { getCompany, getCompanyById, getCompanyProfile, registerCompany, updateCompany, deleteCompany } from "../controllers/companyController.js";
import { singleUpload } from "../middelwares/multer.js";
import userAuth from "../middelwares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(userAuth,registerCompany);
router.route("/get").get(userAuth,getCompany);
router.route("/get/:id").get(userAuth,getCompanyById);
router.route("/profile/:id").get(userAuth, getCompanyProfile);
router.route("/update/:id").put(userAuth,singleUpload, updateCompany);
router.route("/delete/:id").delete(userAuth, deleteCompany);

export default router;