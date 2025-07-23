import { setAllAdminJobs } from '../Slices/Jobslice.tsx'
import { JOB_API_END_POINT } from '../utils/constant.js'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPostJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPostJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPostJobs();
    },[])
}

export default useGetAllPostJobs;