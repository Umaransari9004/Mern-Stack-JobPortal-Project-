import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JOB_API_END_POINT } from '../utils/constant.js';
import { setAllSavedJobs } from '../Slices/Jobslice.tsx';

const useSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store:any) => store.auth);

    // Fetch saved jobs on mount
    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const response = await fetch(`${JOB_API_END_POINT}/saved`, {
                    credentials: 'include' // Send cookies automatically
                });
                const data = await response.json();
                if (data.success) {
                    dispatch(setAllSavedJobs(data.savedJobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        if(user) fetchSavedJobs();
    }, [dispatch, user]);

    // Save job handler
    const saveJob = async (jobId) => {
        if (!jobId) {
            console.error('Invalid jobId provided.');
            return;
        }
    
        try {
            const response = await fetch(`${JOB_API_END_POINT}/save`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, userId: user.id }), // Include userId if required
                credentials: 'include' // Send cookies automatically
            });
    
            if (!response.ok) {
                const error = await response.json();
                console.error('Error:', error.message || 'Failed to save job.');
                return;
            }
    
            const data = await response.json();
            if (data.success) {
                dispatch(setAllSavedJobs(data.savedJobs));
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };
    
    // Unsave job handler
    const unsaveJob = async (jobId) => {
        try {
            const response = await fetch(`${JOB_API_END_POINT}/unsave`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId }),
                credentials: 'include' // Send cookies automatically
            });
            const data = await response.json();
            if (data.success) {
                dispatch(setAllSavedJobs(data.savedJobs));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { saveJob, unsaveJob };
};

export default useSavedJobs;