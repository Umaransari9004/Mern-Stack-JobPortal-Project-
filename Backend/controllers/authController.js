import { User } from "../modles/userModle.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import getDataUri from "../config/datauri.js"
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
export const register = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, role } = req.body;

        if (!name || !email || !password || !confirmpassword || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            role,
            isVerified: false,
            verificationToken: hashedToken,
            verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        // Build verification URL
        const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${verificationToken}`;

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"JobPortal" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email — JobPortal",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                    <h2 style="color: #1e293b; margin-bottom: 8px;">Welcome to JobPortal!</h2>
                    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                        Hi <strong>${name}</strong>, thanks for creating your account.
                        Please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${verifyUrl}" 
                           style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: #ffffff; 
                                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">
                        This link will expire in <strong>24 hours</strong>. If you didn't create this account, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="color: #cbd5e1; font-size: 12px; text-align: center;">JobPortal © ${new Date().getFullYear()}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            message: "Account created! Please check your email to verify your account.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error during registration." });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            })
        };

        // ── NEW: Check if email is verified ──
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in. Check your inbox for the verification link.",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id
        }
        const token = await JWT.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            name, email, phoneNumber, bio, skills,
            jobTitle, currentCompany, location, expectedCtc,
            experience, education, linkedIn, github, portfolio
        } = req.body;

        const userId = req.id;

        const profilePhotoFile = req.files?.profilePhoto?.[0];
        const resumeFile = req.files?.resume?.[0];
        const certificateFiles = req.files?.certificates;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // ── Top-level fields ──
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;

        // ── Profile fields ──
        if (phoneNumber !== undefined) user.profile.phoneNumber = phoneNumber;
        if (bio !== undefined) user.profile.bio = bio;
        if (skills !== undefined) user.profile.skills = skills.split(",").map(s => s.trim()).filter(s => s);
        if (jobTitle !== undefined) user.profile.jobTitle = jobTitle;
        if (currentCompany !== undefined) user.profile.currentCompany = currentCompany;
        if (location !== undefined) user.profile.location = location;
        if (expectedCtc !== undefined) user.profile.expectedCtc = expectedCtc;
        if (experience !== undefined) user.profile.experience = experience;
        if (education !== undefined) user.profile.education = education;
        if (linkedIn !== undefined) user.profile.linkedIn = linkedIn;
        if (github !== undefined) user.profile.github = github;
        if (portfolio !== undefined) user.profile.portfolio = portfolio;

        // ── Profile photo upload ──
        if (profilePhotoFile) {
            const fileUri = getDataUri(profilePhotoFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        // ── Resume upload ──
        if (resumeFile) {
            const fileUri = getDataUri(resumeFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = resumeFile.originalname;
        }

        // ── Certificates upload (append to existing) ──
        if (certificateFiles && certificateFiles.length > 0) {
            if (!user.profile.certificates) user.profile.certificates = [];
            for (const certFile of certificateFiles) {
                const fileUri = getDataUri(certFile);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                user.profile.certificates.push({
                    url: cloudResponse.secure_url,
                    originalName: certFile.originalname
                });
            }
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
// ── Delete a certificate by index ──
export const deleteCertificate = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.certificates || index >= user.profile.certificates.length) {
            return res.status(400).json({ message: "Certificate not found.", success: false });
        }

        user.profile.certificates.splice(index, 1);
        await user.save();

        return res.status(200).json({
            message: "Certificate deleted successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Add a new experience entry ──
export const addExperience = async (req, res) => {
    try {
        const userId = req.id;
        const { jobTitle, company, location, summary, startDate, endDate, currentlyWorking } = req.body;

        if (!jobTitle || !company) {
            return res.status(400).json({ message: "Job title and company are required.", success: false });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.experiences) user.profile.experiences = [];

        user.profile.experiences.push({
            jobTitle, company, location, summary, startDate, endDate,
            currentlyWorking: currentlyWorking || false
        });

        await user.save();

        return res.status(200).json({
            message: "Experience added successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Update an experience entry by index ──
export const updateExperience = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;
        const { jobTitle, company, location, summary, startDate, endDate, currentlyWorking } = req.body;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.experiences || index >= user.profile.experiences.length) {
            return res.status(400).json({ message: "Experience not found.", success: false });
        }

        const exp = user.profile.experiences[index];
        if (jobTitle !== undefined) exp.jobTitle = jobTitle;
        if (company !== undefined) exp.company = company;
        if (location !== undefined) exp.location = location;
        if (summary !== undefined) exp.summary = summary;
        if (startDate !== undefined) exp.startDate = startDate;
        if (endDate !== undefined) exp.endDate = endDate;
        if (currentlyWorking !== undefined) exp.currentlyWorking = currentlyWorking;

        await user.save();

        return res.status(200).json({
            message: "Experience updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Delete an experience entry by index ──
export const deleteExperience = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.experiences || index >= user.profile.experiences.length) {
            return res.status(400).json({ message: "Experience not found.", success: false });
        }

        user.profile.experiences.splice(index, 1);
        await user.save();

        return res.status(200).json({
            message: "Experience deleted successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Add a new education entry ──
export const addEducation = async (req, res) => {
    try {
        const userId = req.id;
        const { school, degree, startDate, endDate, description } = req.body;

        if (!school || !degree) {
            return res.status(400).json({ message: "School and degree are required.", success: false });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.educations) user.profile.educations = [];

        user.profile.educations.push({ school, degree, startDate, endDate, description });
        await user.save();

        return res.status(200).json({
            message: "Education added successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Update an education entry by index ──
export const updateEducation = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;
        const { school, degree, startDate, endDate, description } = req.body;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.educations || index >= user.profile.educations.length) {
            return res.status(400).json({ message: "Education not found.", success: false });
        }

        const edu = user.profile.educations[index];
        if (school !== undefined) edu.school = school;
        if (degree !== undefined) edu.degree = degree;
        if (startDate !== undefined) edu.startDate = startDate;
        if (endDate !== undefined) edu.endDate = endDate;
        if (description !== undefined) edu.description = description;

        await user.save();

        return res.status(200).json({
            message: "Education updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Delete an education entry by index ──
export const deleteEducation = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.educations || index >= user.profile.educations.length) {
            return res.status(400).json({ message: "Education not found.", success: false });
        }

        user.profile.educations.splice(index, 1);
        await user.save();

        return res.status(200).json({
            message: "Education deleted successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Add a new project entry ──
export const addProject = async (req, res) => {
    try {
        const userId = req.id;
        const { title, technologies, link, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Project title is required.", success: false });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.projects) user.profile.projects = [];

        user.profile.projects.push({ title, technologies, link, description });
        await user.save();

        return res.status(200).json({
            message: "Project added successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Update a project entry by index ──
export const updateProject = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;
        const { title, technologies, link, description } = req.body;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.projects || index >= user.profile.projects.length) {
            return res.status(400).json({ message: "Project not found.", success: false });
        }

        const proj = user.profile.projects[index];
        if (title !== undefined) proj.title = title;
        if (technologies !== undefined) proj.technologies = technologies;
        if (link !== undefined) proj.link = link;
        if (description !== undefined) proj.description = description;

        await user.save();

        return res.status(200).json({
            message: "Project updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Delete a project entry by index ──
export const deleteProject = async (req, res) => {
    try {
        const userId = req.id;
        const { index } = req.params;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (!user.profile.projects || index >= user.profile.projects.length) {
            return res.status(400).json({ message: "Project not found.", success: false });
        }

        user.profile.projects.splice(index, 1);
        await user.save();

        return res.status(200).json({
            message: "Project deleted successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ══════════════════════════════════════════════
//   FIND TALENT — Employer views student profiles
// ══════════════════════════════════════════════

// ── Get all talents (students) with search/filter/pagination ──
export const getAllTalents = async (req, res) => {
    try {
        const { keyword, location, page = 1, limit = 12 } = req.query;

        const filter = { role: 'student' };

        // ── Keyword search (name, jobTitle, skills) ──
        if (keyword) {
            const regex = new RegExp(keyword, 'i');
            filter.$or = [
                { name: regex },
                { 'profile.jobTitle': regex },
                { 'profile.skills': regex }
            ];
        }

        // ── Location filter ──
        if (location) {
            filter['profile.location'] = new RegExp(location, 'i');
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(filter);

        const talents = await User.find(filter)
            .select('-password -confirmpassword -savedJobs')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).json({
            success: true,
            talents,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            totalTalents: total
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Get a single talent (student) by ID ──
export const getTalentById = async (req, res) => {
    try {
        const { id } = req.params;

        const talent = await User.findById(id)
            .select('-password -confirmpassword -savedJobs');

        if (!talent) {
            return res.status(404).json({
                message: "Talent not found.",
                success: false
            });
        }

        if (talent.role !== 'student') {
            return res.status(400).json({
                message: "This user is not a student/talent.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            talent
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ── Forgot Password — Send reset link via email ──
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide your email address.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "No account found with that email address.",
                success: false
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the token and save to user document
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        // Build the reset URL (frontend URL)
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: `"JobPortal" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request — JobPortal",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                    <h2 style="color: #1e293b; margin-bottom: 8px;">Reset Your Password</h2>
                    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                        Hi <strong>${user.name}</strong>, we received a request to reset your password. 
                        Click the button below to create a new password:
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: #ffffff; 
                                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">
                        This link will expire in <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="color: #cbd5e1; font-size: 12px; text-align: center;">JobPortal © ${new Date().getFullYear()}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "Password reset link sent to your email.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to send reset email. Please try again.",
            success: false,
        });
    }
};

// ── Reset Password — Verify token and update password ──
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "Please provide both password fields.",
                success: false,
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match.",
                success: false,
            });
        }

        // Hash the token from the URL to compare with the stored hash
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset link. Please request a new one.",
                success: false,
            });
        }

        // Hash new password and save
        user.password = await bcrypt.hash(password, 10);
        user.confirmpassword = user.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully. You can now login.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to reset password. Please try again.",
            success: false,
        });
    }
};

// ── Verify Email — Called when user clicks the verification link ──
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Hash the token from the URL to compare with stored hash
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link. Please request a new one.",
                success: false,
            });
        }

        // Mark as verified and clear the token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully! You can now login.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to verify email. Please try again.",
            success: false,
        });
    }
};

// ── Resend Verification Email ──
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide your email address.",
                success: false,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with that email address.",
                success: false,
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "This email is already verified. You can login.",
                success: false,
            });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        user.verificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");
        user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await user.save();

        // Build verification URL
        const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${verificationToken}`;

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"JobPortal" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify Your Email — JobPortal",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                    <h2 style="color: #1e293b; margin-bottom: 8px;">Verify Your Email</h2>
                    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                        Hi <strong>${user.name}</strong>, here's a new verification link for your account.
                        Click the button below to verify:
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${verifyUrl}" 
                           style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: #ffffff; 
                                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">
                        This link will expire in <strong>24 hours</strong>.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="color: #cbd5e1; font-size: 12px; text-align: center;">JobPortal © ${new Date().getFullYear()}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "Verification email sent! Please check your inbox.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to send verification email. Please try again.",
            success: false,
        });
    }
};
