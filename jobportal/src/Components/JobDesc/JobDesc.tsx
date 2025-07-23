import { ActionIcon, Button, Divider } from '@mantine/core'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { notifications } from '@mantine/notifications'
import { card } from '../../Data/JobDescData.tsx';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../../utils/constant.js';
import { setSingleJob } from '../../Slices/Jobslice.tsx';
import useSavedJobs from '../../hooks/useGetAllSavedJob.tsx';

const JobDesc = () => {
    const { singleJob, allSavedJobs } = useSelector((store: any) => store.job);
    const { saveJob, unsaveJob } = useSavedJobs();
    const daysAgoFunction = (mongodbTime: string) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        // Ensure the date is valid
        if (isNaN(createdAt.getTime())) {
            return "Invalid date";
        }
        // Calculate the difference in milliseconds
        const timeDifference: number = currentTime.getTime() - createdAt.getTime();
        // Convert to days
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };


    const data = DOMPurify.sanitize(singleJob?.description);
    const { user } = useSelector((store: any) => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();


    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            console.log(res)
            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                notifications.show({
                    message: (res.data.message),
                    withBorder: true,
                    className: '!border-blue-500',
                })

            }
        } catch (error) {
            console.log(error);
            notifications.show({
                message: (error.response.data.message),
                color: "red",
                withBorder: true,
                className: '!border-red-500',
            })
        }
    }

    const savedJobIds = allSavedJobs.map(job => job._id);
    const handleSaveToggle = () => {
        if (savedJobIds.includes(jobId)) {
            unsaveJob(jobId);
        } else {
            saveJob(jobId);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className="sm-mx:w-full w-[80%]">
            <p className='text-xs  text-red-600 font-bold text-center my-3'>*Please Update Profile and Add Resume in Profile first, before Apply jobs</p>
            <div className="flex justify-between xs-mx:gap-2">
                <div className="flex gap-2 items-center ">
                    {/* <div className="p-3 bg-blue-100 rounded-xl">
                        <img className="h-14" src={singleJob.jobs?.company?.logo} />

                    </div> */}
                    <div className="flex flex-col gap-1">
                        <div className="font-semibold text-2xl xs-mx:text-lg">{singleJob?.jobTitle}</div>
                        <div className="text-lg text-gray-700 xs-mx:text-sm"> Posted {daysAgoFunction(singleJob?.createdAt) === 0 ? "Today" : `${daysAgoFunction(singleJob?.createdAt)} days ago`} &bull; {singleJob?.applications?.length} Applicants</div>
                        {/* {singleJob?.company} &bull; */}
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center">

                    <Button onClick={isApplied ? undefined : applyJobHandler}
                        disabled={isApplied} color='blue.4' size="sm" variant="light"
                        className={`rounded-lg ${isApplied ? '!bg-green-100 !text-green-400 !rounded-r-sm cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                        {isApplied ? 'Applied' : 'Apply Now'}
                    </Button>

                    {savedJobIds.includes(jobId) ?
                        <IconBookmarkFilled onClick={handleSaveToggle} className="cursor-pointer text-blue-500" stroke={1.5} />
                        :
                        <IconBookmark onClick={handleSaveToggle} className="text-gray-700 cursor-pointer hover:text-blue-500" stroke={1.5} />
                    }
                </div>
            </div>
            <Divider my="xl" />
            <div className="flex justify-between xs-mx:gap-4 xs-mx:flex-wrap">
                {
                    card.map((item: any, index: number) => <div key={index} className="flex flex-col items-center gap-1">
                        <ActionIcon color="blue.4" className="!h-12 !w-12 " variant="light" radius="xl" aria-label="Settings">
                            <item.icon className="h-4/5 w-4/5 sm-mx:w-[60%]" stroke={1.5} />
                        </ActionIcon>
                        <div className="text-sm sm-mx:text-xs text-gray-600">{item.name}</div>
                        <div className="font-semibold">{singleJob ? singleJob[item.id] : "NA"} {item.id == "salary" && <>LPA</>}</div>
                    </div>)
                }
            </div>
            <Divider my="xl" />
            <div>
                <div className="text-xl font-semibold mb-5">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                    {
                        singleJob?.skills?.map((skill: any, index: number) => <ActionIcon key={index} color="blue.4" className="!h-fit font-medium !text-sm sm-mx:!text-xs !w-fit " variant="light" p="xs" radius="xl" aria-label="Settings">
                            {skill}
                        </ActionIcon>)
                    }

                </div>
            </div>
            <Divider my="xl" />
            <div className="[&_h4]:text-xl [&_*]:text-gray-600 [&_li]:mb-1 [&_h4]:my-5 [&_h4]:font-semibold [&_h4]:text-gray-700 [&_p]:text-justify lg-mx:[&_p]:text-sm lg-mx:[&_li]:text-sm" dangerouslySetInnerHTML={{ __html: data }}>
            </div>
        </div>
    )
}

export default JobDesc;
