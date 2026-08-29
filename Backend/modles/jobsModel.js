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
    },
    about: {
        type: String,
    },
    skills: [{
        type: String,
    }],
    salary: {
        type: Number,
    },
    experience: {
        type: String,
    },
    location: {
        type: String,
    },
    jobType: {
        type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'closed'],
        default: 'active',
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