import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name Is Require"],
        },
        email: {
            type: String,
            required: [true, "Email Is Require"],
            unique: true,

        },
        password: {
            type: String,
            required: [true, "Password Is Require"],

        },
        confirmpassword: {
            type: String,
            required: [true, "Confirm-Password Is Require"],

        },
        role: {
            type: String,
            enum: ['student', 'employer'],
            required: true,
        },
        savedJobs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }],
        profile: {
            phoneNumber: { type: String },
            bio: { type: String },
            skills: [{ type: String }],
            resume: { type: String }, // URL to resume file
            resumeOriginalName: { type: String },
            company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
            profilePhoto: {
                type: String,
                default: ""
            },
            // ── NEW FIELDS ──
            jobTitle: { type: String },          // e.g. "Software Engineer"
            currentCompany: { type: String },    // e.g. "Google"
            location: { type: String },          // e.g. "New York, United States"
            expectedCtc: { type: String },       // e.g. "₹48 - 60LPA"
            experience: { type: String },        // e.g. "3 Years"
            // education: { type: String },         // e.g. "B.Tech in Computer Science"
            linkedIn: { type: String },          // LinkedIn profile URL
            github: { type: String },            // GitHub profile URL
            portfolio: { type: String },         // Portfolio website URL
            certificates: [{
                url: { type: String },
                originalName: { type: String }
            }],
            // ── WORK HISTORY ENTRIES ──
            experiences: [{
                jobTitle: { type: String },
                company: { type: String },
                location: { type: String },
                summary: { type: String },
                startDate: { type: String },
                endDate: { type: String },
                currentlyWorking: { type: Boolean, default: false }
            }],
            // ── EDUCATION ENTRIES ──
            educations: [{
                school: { type: String },
                degree: { type: String },
                startDate: { type: String },
                endDate: { type: String },
                description: { type: String }
            }],
            // ── PROJECT ENTRIES ──
            projects: [{
                title: { type: String },
                technologies: { type: String },
                link: { type: String },
                description: { type: String }
            }],
        },

            resetPasswordToken: { type: String },
            resetPasswordExpire: { type: Date },

            // ── Email Verification Fields ──
            isVerified: { type: Boolean, default: true },
            verificationToken: { type: String },
            verificationTokenExpire: { type: Date },


    },
    { timestamps: true }
);



export const User = mongoose.model("User", userSchema);