import express from "express";
import userAuth from "../middelwares/authMiddleware.js";
import { singleUpload } from "../middelwares/multer.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationController.js";
 
const router = express.Router();

router.route("/apply/:id").post(userAuth, singleUpload, applyJob);
router.route("/get").get(userAuth, getAppliedJobs);
router.route("/:id/applicants").get(userAuth, getApplicants);
router.route("/status/:id/update").post(userAuth, updateStatus);
 

export default router;
