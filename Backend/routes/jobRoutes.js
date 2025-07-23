import express from 'express'
import userAuth from '../middelwares/authMiddleware.js'
import { getAdminJobs, getAllJobs, getJobById, postJob, saveJob, unsaveJob, getSavedJobs, deleteJob } from '../controllers/jobsController.js'

const router = express.Router()

router.route("/post").post(userAuth, postJob);
router.route("/get").get(userAuth, getAllJobs);
router.route("/getadminjobs").get(userAuth, getAdminJobs);
router.route("/get/:id").get(userAuth, getJobById);
router.route("/save").put(userAuth, saveJob);
router.route("/unsave").put(userAuth, unsaveJob);
router.route("/saved").get(userAuth, getSavedJobs);
router.route("/delete/:id").delete(userAuth, deleteJob);

export default router;