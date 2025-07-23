import mongoose from 'mongoose';


const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, 'Job Tital is required'],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    salary: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
},
    {
        timestamps: true,
    });



export const Job = mongoose.model('Job', jobSchema);