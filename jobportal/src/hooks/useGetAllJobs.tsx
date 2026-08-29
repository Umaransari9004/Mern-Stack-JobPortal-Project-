import { setAllJobs } from '../Slices/Jobslice.tsx'
import { JOB_API_END_POINT } from '../utils/constant.js'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const JOBS_PER_PAGE = 8;

const useGetAllJobs = (page: number) => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((store: any) => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get`,
                    {
                        params: {
                            keyword: searchedQuery?.title || "", // ✅ safer
                            page,                          // ✅ send page
                            limit: JOBS_PER_PAGE           // ✅ send limit
                        },
                        withCredentials: true
                    }
                );

                if (res.data.success) {
                    // ✅ UPDATED: send jobs + totalPages
                    dispatch(setAllJobs({
                        jobs: res.data.jobs,
                        totalPages: res.data.totalPages, 
                        currentPage: res.data.currentPage // optional but good
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllJobs();
    }, [page, searchedQuery]);
};

export default useGetAllJobs;
