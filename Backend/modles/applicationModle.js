import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    // Application form fields
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    personalWebsite: {
        type: String,
    },
    resume: {
        type: String, // Cloudinary URL
    },
    resumeOriginalName: {
        type: String,
    },
    coverLetter: {
        type: String,
    },
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);
