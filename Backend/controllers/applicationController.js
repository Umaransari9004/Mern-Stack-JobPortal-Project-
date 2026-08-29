import { Application } from "../modles/applicationModle.js";
import { Job } from "../modles/jobsModel.js";
import getDataUri from "../config/datauri.js";
import cloudinary from "../config/cloudinary.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        // Get form fields from request body
        const { fullName, email, phone, personalWebsite, coverLetter } = req.body;

        // Handle resume upload
        let resumeUrl = '';
        let resumeOriginalName = '';

        // Check if a new resume file was uploaded
        const resumeFile = req.files?.resume?.[0];
        if (resumeFile) {
            const fileUri = getDataUri(resumeFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
            });
            resumeUrl = cloudResponse.secure_url;
            resumeOriginalName = resumeFile.originalname;
        } else if (req.body.existingResumeUrl) {
            // Use existing resume from profile
            resumeUrl = req.body.existingResumeUrl;
            resumeOriginalName = req.body.existingResumeName || 'Resume';
        }

        // create a new application with form data
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            fullName: fullName || '',
            email: email || '',
            phone: phone || '',
            personalWebsite: personalWebsite || '',
            resume: resumeUrl,
            resumeOriginalName: resumeOriginalName,
            coverLetter: coverLetter || '',
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}
