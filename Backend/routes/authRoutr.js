import express from "express"
import { login, logout, register, updateProfile } from "../controllers/authController.js"
import userAuth from "../middelwares/authMiddleware.js";
import { singleUpload } from "../middelwares/multer.js"
const router = express.Router()

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(userAuth, singleUpload, updateProfile);

export default router;