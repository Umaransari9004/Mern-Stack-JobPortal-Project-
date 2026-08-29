import { IconBookmark, IconBookmarkFilled, IconClockHour3, IconBriefcase } from '@tabler/icons-react'
import { Button, Divider, Text, Badge, Pagination } from '@mantine/core';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '../../hooks/useGetAppliedJob.tsx';
import useSavedJobs from '../../hooks/useGetAllSavedJob.tsx';

const ITEMS_PER_PAGE = 8;

interface AppliedJobTableProps {
    statusFilter?: string;
}

const AppliedJobTable: React.FC<AppliedJobTableProps> = ({ statusFilter }) => {
    useGetAppliedJobs();
    const { allAppliedJobs, allSavedJobs } = useSelector((store: any) => store.job);
    const { saveJob, unsaveJob } = useSavedJobs();

    const savedJobIds = allSavedJobs?.map((job: any) => job._id) || [];

    // Filter by status if statusFilter is provided
    const filteredJobs = statusFilter
        ? allAppliedJobs.filter((appliedJob: any) =>
            appliedJob?.status?.toLowerCase() === statusFilter.toLowerCase()
          )
        : allAppliedJobs;

    /* ── Pagination ── */
    const [activePage, setActivePage] = useState(1);
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSaveToggle = (jobId: string) => {
        if (savedJobIds.includes(jobId)) {
            unsaveJob(jobId);
        } else {
            saveJob(jobId);
        }
    };

    const daysAgoFunction = (mongodbTime: string) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        if (isNaN(createdAt.getTime())) return "Invalid date";
        const timeDifference: number = currentTime.getTime() - createdAt.getTime();
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };

    const emptyTitle = statusFilter === 'pending' ? 'Nothing In Progress' : 'No Applied Jobs';
    const emptyMessage = statusFilter === 'pending'
        ? 'Jobs where your application is pending review will show here.'
        : "You haven't applied to any jobs yet. Start exploring and apply to your dream job!";
    const emptyIcon = statusFilter === 'pending' ? '⏳' : undefined;

    return (
        <div className='px-3'>
            {filteredJobs.length <= 0 ? (
                <div className="bg-blue-50 rounded-xl py-16 flex flex-col items-center justify-center text-center px-4">
                    <div className="bg-blue-100 p-5 rounded-full mb-5">
                        {emptyIcon ? (
                            <span className="text-3xl">{emptyIcon}</span>
                        ) : (
                            <IconBriefcase size={32} className="text-blue-400" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{emptyTitle}</h3>
                    <p className="text-gray-500 max-w-sm font-medium">{emptyMessage}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {paginatedJobs.map((appliedJob: any) => {
                            const job = appliedJob?.job;
                            const jobId = job?._id;
                            return (
                                <div key={appliedJob._id} className="bg-blue-50 p-4 flex flex-col gap-4 rounded-xl hover:shadow-[0_0_5px_blue] !shadow-blue-500">
                                    {/* ── Header: Logo + Title + Bookmark ── */}
                                    <div className="flex justify-between">
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-blue-100 rounded-md">
                                                <img className="h-7" src={job?.company?.logo} alt={job?.company?.name} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="font-semibold">{job?.jobTitle}</div>
                                                <div className="text-xs text-gray-700">{job?.company?.name} &bull; {job?.applications?.length || 0} Applicants</div>
                                            </div>
                                        </div>
                                        {savedJobIds.includes(jobId) ?
                                            <IconBookmarkFilled onClick={() => handleSaveToggle(jobId)} className="cursor-pointer text-blue-500 shrink-0" stroke={1.5} />
                                            :
                                            <IconBookmark onClick={() => handleSaveToggle(jobId)} className="text-gray-700 cursor-pointer hover:text-blue-500 shrink-0" stroke={1.5} />
                                        }
                                    </div>

                                    {/* ── Tags: Experience + JobType + Location ── */}
                                    <div className="flex gap-2 [&>div]:py-1 [&>div]:px-2 [&>div]:bg-blue-100 [&>div]:text-blue-400 [&>div]:rounded-lg text-xs">
                                        <div>{job?.experience}</div>
                                        <div>{job?.jobType}</div>
                                        <div>{job?.location}</div>
                                    </div>

                                    {/* ── Description ── */}
                                    <Text className="!text-xs text-justify !text-gray-700" lineClamp={3}>
                                        {job?.about}
                                    </Text>

                                    <Divider size="xs" color="gray.4" />

                                    {/* ── Salary + Applied Date ── */}
                                    <div className="flex justify-between">
                                        <div className="font-semibold text-gray-700">
                                            &#8377;{job?.salary} LPA
                                        </div>
                                        <div className="flex gap-1 text-xs text-gray-500 items-center">
                                            <IconClockHour3 className="h-5 w-5" stroke={1.5} /> Applied {daysAgoFunction(appliedJob?.createdAt) === 0 ? "Today" : `${daysAgoFunction(appliedJob?.createdAt)} days ago`}
                                        </div>
                                    </div>

                                    {/* ── Status Badge ── */}
                                    {appliedJob?.status && (
                                        <div className="flex justify-center">
                                            <Badge
                                                size="lg"
                                                variant="light"
                                                color={appliedJob.status === 'rejected' || appliedJob.status === 'Rejected'
                                                    ? 'red'
                                                    : appliedJob.status === 'pending' || appliedJob.status === 'Pending'
                                                        ? 'gray'
                                                        : 'green'}
                                            >
                                                {appliedJob.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    )}

                                    <Divider size="xs" color="gray.4" />

                                    {/* ── View Job Button ── */}
                                    <Link to={`/job-desc/${jobId}`} state={{ fromTab: 'applied' }}>
                                        <Button fullWidth color='blue.4' variant='outline'>View Job</Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                total={totalPages}
                                value={activePage}
                                onChange={setActivePage}
                                color="blue"
                                radius="md"
                                size="md"
                                withEdges={false}
                            />
                        </div>
                    )}

                    {/* Footer caption */}
                    <p className="text-center text-sm text-gray-400 font-medium mt-4">
                        Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length} {statusFilter === 'pending' ? 'in-progress' : 'applied'} jobs
                    </p>
                </>
            )}
        </div>
    )
}

export default AppliedJobTable
