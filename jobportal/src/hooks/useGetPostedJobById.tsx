// import { setSingleJob } from '../Slices/Jobslice.tsx'

// import { JOB_API_END_POINT } from '../utils/constant.js'
// import axios from 'axios'
// import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

// const useGetJobById = (jobId) => {
//     const dispatch = useDispatch();
//     useEffect(()=>{
//         const fetchSingleJob = async () => {
//             try {
//                 const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
//                 console.log(res.data.job);
//                 if(res.data.success){
//                     dispatch(setSingleJob(res.data.job));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchSingleJob();
//     },[jobId, dispatch])
// }

// export default useGetJobById;