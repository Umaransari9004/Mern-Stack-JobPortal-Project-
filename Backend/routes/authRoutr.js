import express from "express"
import { login, logout, register, updateProfile, deleteCertificate, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, addProject, updateProject, deleteProject, getAllTalents, getTalentById, forgotPassword, resetPassword, verifyEmail, resendVerification } from "../controllers/authController.js"
import userAuth from "../middelwares/authMiddleware.js";
import { singleUpload } from "../middelwares/multer.js"
const router = express.Router()

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(userAuth, singleUpload, updateProfile);
router.route("/profile/certificate/:index").delete(userAuth, deleteCertificate);

// ── Experience CRUD ──
router.route("/profile/experience").post(userAuth, addExperience);
router.route("/profile/experience/:index").put(userAuth, updateExperience);
router.route("/profile/experience/:index").delete(userAuth, deleteExperience);

// ── Education CRUD ──
router.route("/profile/education").post(userAuth, addEducation);
router.route("/profile/education/:index").put(userAuth, updateEducation);
router.route("/profile/education/:index").delete(userAuth, deleteEducation);

// ── Project CRUD ──
router.route("/profile/project").post(userAuth, addProject);
router.route("/profile/project/:index").put(userAuth, updateProject);
router.route("/profile/project/:index").delete(userAuth, deleteProject);

// ── Find Talent (Employer) ──
router.route("/talents").get(userAuth, getAllTalents);
router.route("/talents/:id").get(userAuth, getTalentById);

// ── Forgot / Reset Password ──
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// ── Email Verification ──
router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-verification").post(resendVerification);

export default router;