import { Job } from "../modles/jobsModel.js";
import { User } from "../modles/userModle.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { jobTitle, companyId, experience, jobType, location, salary, skills, about, description, status } = req.body;
        const userId = req.id;

        const jobStatus = status || 'active';

        // Only validate required fields for active jobs (not drafts)
        if (jobStatus === 'active') {
            if (!jobTitle || !companyId || !experience || !jobType || !location || !salary || !skills || !about || !description) {
                return res.status(400).json({
                    message: "Somethin is missing.",
                    success: false
                })
            };
        } else {
            // For drafts, at least jobTitle and companyId are needed
            if (!jobTitle || !companyId) {
                return res.status(400).json({
                    message: "Job title and company are required.",
                    success: false
                })
            };
        }

        const job = await Job.create({
            jobTitle,
            company: companyId,
            experience: experience || '',
            jobType: jobType || '',
            location: location || '',
            salary: salary ? Number(salary) : 0,
            skills: skills ? (Array.isArray(skills) ? skills : skills.split(",")) : [],
            about: about || '',
            description: description || '',
            status: jobStatus,
            created_by: userId
        });
        return res.status(201).json({
            message: jobStatus === 'draft' ? "Job saved as draft." : "New job created successfully.",
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;       // jobs per page
        const keyword =
            typeof req.query.keyword === "string"
                ? req.query.keyword
                : "";

        const query = {
            status: 'active', // Only show active jobs to applicants
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        };
        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)   // ✅ pagination
            .limit(limit);

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true,
            totalPages: Math.ceil(totalJobs / limit), 
            currentPage: page
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({ path: "applications" })
            .populate({ path: "company" });
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

// Update an existing job (employer/admin)
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { jobTitle, companyId, experience, jobType, location, salary, skills, about, description, status } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Update fields if provided
        if (jobTitle) job.jobTitle = jobTitle;
        if (companyId) job.company = companyId;
        if (experience) job.experience = experience;
        if (jobType) job.jobType = jobType;
        if (location) job.location = location;
        if (salary) job.salary = Number(salary);
        if (skills) job.skills = typeof skills === 'string' ? skills.split(",").map(s => s.trim()) : skills;
        if (about) job.about = about;
        if (description) job.description = description;
        if (status) job.status = status;

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error while updating job:", error);
        return res.status(500).json({
            message: "Something went wrong while updating job.",
            success: false
        });
    }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
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

// Close a job
export const closeJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        job.status = 'closed';
        await job.save();

        return res.status(200).json({
            message: "Job closed successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error while closing job:", error);
        return res.status(500).json({
            message: "Something went wrong while closing job.",
            success: false
        });
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