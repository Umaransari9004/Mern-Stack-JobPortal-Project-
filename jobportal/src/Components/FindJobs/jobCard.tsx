import { IconBookmark, IconBookmarkFilled, IconClockHour3 } from '@tabler/icons-react'
import { Button, Divider, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useSavedJobs from '../../hooks/useGetAllSavedJob.tsx';

const JobCard = (job: any) => {

  const { allSavedJobs } = useSelector((store: any) => store.job);
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

  const savedJobIds = allSavedJobs.map(job => job._id);
  const handleSaveToggle = () => {
    if (savedJobIds.includes(job._id)) {
      unsaveJob(job._id);
    } else {
      saveJob(job._id);
    }
  };

  return <div className="bg-blue-50 p-4 w-80 sm-mx:w-full flex flex-col gap-4 rounded-xl hover:shadow-[0_0_5px_blue] !shadow-blue-500">
    <div className="flex justify-between">
      <div className="flex gap-2 items-center ">
        <div className="p-2 bg-blue-100 rounded-md">
          <img className="h-7" src={job?.company?.logo} />

        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{job?.jobTitle}</div>
          <div className="text-xs text-gray-700">{job?.company?.name} &bull; {job?.applications?.length} Applications</div>
        </div>
      </div>
      {savedJobIds.includes(job._id) ?
        <IconBookmarkFilled onClick={handleSaveToggle} className="cursor-pointer text-blue-500" stroke={1.5} />
        :
        <IconBookmark onClick={handleSaveToggle} className="text-gray-700 cursor-pointer hover:text-blue-500" stroke={1.5} />
      }

    </div>
    <div className="flex gap-2 [&>div]:py-1 [&>div]:px-2 [&>div]:bg-blue-100 [&>div]:text-blue-400 [&>div]:rounded-lg text-xs">
      <div>{job?.experience}</div>
      <div>{job?.jobType}</div>
      <div>{job?.location}</div>
    </div>
    <Text className="!text-xs text-justify !text-gray-700" lineClamp={3}>
      {job?.about}
    </Text>
    <Divider size="xs" color="gray.4" />
    <div className="flex justify-between">
      <div className="font-semibold text-gray-700">
        &#8377;{job?.salary} LPA
      </div>
      <div className="flex gap-1 text-xs text-gray-500 items-center">
        <IconClockHour3 className="h-5 w-5 " stroke={1.5} /> Posted {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
      </div>
    </div>
    <Divider size="xs" color="gray.4" />
    <Link to={`/job-desc/${job?._id}`}>
      <Button fullWidth color='blue.4' variant='outline'>View Job</Button>
    </Link>
  </div>
}

export default JobCard;
