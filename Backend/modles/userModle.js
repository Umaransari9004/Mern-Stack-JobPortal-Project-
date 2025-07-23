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
        },

    },
    { timestamps: true }
);



export const User = mongoose.model("User", userSchema);