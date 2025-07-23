import { Job } from "../modles/jobsModel.js";
import { User } from "../modles/userModle.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { jobTitle ,companyId, experience, jobType, location, salary, skills, about, description} = req.body;
        const userId = req.id;

        if (!jobTitle || !companyId  || !experience || !jobType || !location|| !salary || !skills  || !about || !description ) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            jobTitle,
            company: companyId,
            experience,
            jobType,
            location,
            salary: Number(salary),
            skills: skills.split(","),
            about,
            description,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};


export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        // Check if job is already saved
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({ 
                message: "Job already saved", 
                success: false 
            });
        }

        user.savedJobs.push(jobId);
        await user.save();

        // Get updated user with populated jobs
        const updatedUser = await User.findById(userId)
            .populate({
                path: 'savedJobs',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            });

        return res.status(200).json({
            message: "Job saved successfully",
            success: true,
            savedJobs: updatedUser.savedJobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        });
    }
};

export const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();

        // Get updated user with populated jobs
        const updatedUser = await User.findById(userId)
            .populate({
                path: 'savedJobs',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            });

        return res.status(200).json({
            message: "Job unsaved successfully",
            success: true,
            savedJobs: updatedUser.savedJobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        });
    }
};
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        // Properly populate the job details and company info
        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: {
                path: 'company',
                model: 'Company'
            }
        });

        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        return res.status(200).json({
            success: true,
            savedJobs: user.savedJobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error while deleting job:", error);
        return res.status(500).json({
            message: "Something went wrong while deleting job.",
            success: false,
        });
    }
};