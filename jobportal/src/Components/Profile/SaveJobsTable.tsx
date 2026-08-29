import { IconBookmarkFilled, IconClockHour3, IconBriefcase } from '@tabler/icons-react'
import { Button, Divider, Text, Pagination } from '@mantine/core';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useSavedJobs from '../../hooks/useGetAllSavedJob.tsx';

const ITEMS_PER_PAGE = 8;

const SaveJobTable = () => {
    const dispatch = useDispatch();
    const { allSavedJobs } = useSelector((store: any) => store.job);
    const { saveJob, unsaveJob } = useSavedJobs();

    useEffect(() => {
        // The useSavedJobs hook already handles fetching saved jobs on mount
    }, [dispatch]);

    /* ── Pagination ── */
    const [activePage, setActivePage] = useState(1);
    const totalPages = Math.ceil(allSavedJobs.length / ITEMS_PER_PAGE);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedJobs = allSavedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const daysAgoFunction = (mongodbTime: string) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        if (isNaN(createdAt.getTime())) return "Invalid date";
        const timeDifference: number = currentTime.getTime() - createdAt.getTime();
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };

    return (
        <div className='px-3'>
            {allSavedJobs.length <= 0 ? (
                <div className="bg-blue-50 rounded-xl py-16 flex flex-col items-center justify-center text-center px-4">
                    <div className="bg-blue-100 p-5 rounded-full mb-5">
                        <IconBriefcase size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Jobs</h3>
                    <p className="text-gray-500 max-w-sm font-medium">You haven't saved any jobs yet. Bookmark jobs you're interested in to view them here later.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {paginatedJobs.map((savedJob: any) => (
                            <div key={savedJob._id} className="bg-blue-50 p-4 flex flex-col gap-4 rounded-xl hover:shadow-[0_0_5px_blue] !shadow-blue-500">
                                {/* ── Header: Logo + Title + Bookmark ── */}
                                <div className="flex justify-between">
                                    <div className="flex gap-2 items-center">
                                        <div className="p-2 bg-blue-100 rounded-md">
                                            <img className="h-7" src={savedJob?.company?.logo} alt={savedJob?.company?.name} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold">{savedJob?.jobTitle}</div>
                                            <div className="text-xs text-gray-700">{savedJob?.company?.name} &bull; {savedJob?.applications?.length || 0} Applicants</div>
                                        </div>
                                    </div>
                                    <IconBookmarkFilled
                                        onClick={() => unsaveJob(savedJob._id)}
                                        className="cursor-pointer text-blue-500 shrink-0"
                                        stroke={1.5}
                                    />
                                </div>

                                {/* ── Tags: Experience + JobType + Location ── */}
                                <div className="flex gap-2 [&>div]:py-1 [&>div]:px-2 [&>div]:bg-blue-100 [&>div]:text-blue-400 [&>div]:rounded-lg text-xs">
                                    <div>{savedJob?.experience}</div>
                                    <div>{savedJob?.jobType}</div>
                                    <div>{savedJob?.location}</div>
                                </div>

                                {/* ── Description ── */}
                                <Text className="!text-xs text-justify !text-gray-700" lineClamp={3}>
                                    {savedJob?.about}
                                </Text>

                                <Divider size="xs" color="gray.4" />

                                {/* ── Salary + Posted Date ── */}
                                <div className="flex justify-between">
                                    <div className="font-semibold text-gray-700">
                                        &#8377;{savedJob?.salary} LPA
                                    </div>
                                    <div className="flex gap-1 text-xs text-gray-500 items-center">
                                        <IconClockHour3 className="h-5 w-5" stroke={1.5} /> Posted {daysAgoFunction(savedJob?.createdAt) === 0 ? "Today" : `${daysAgoFunction(savedJob?.createdAt)} days ago`}
                                    </div>
                                </div>

                                <Divider size="xs" color="gray.4" />

                                {/* ── View Job Button ── */}
                                <Link to={`/job-desc/${savedJob?._id}`} state={{ fromTab: 'saved' }}>
                                    <Button fullWidth color='blue.4' variant='outline'>View Job</Button>
                                </Link>
                            </div>
                        ))}
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
                        Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, allSavedJobs.length)} of {allSavedJobs.length} saved jobs
                    </p>
                </>
            )}
        </div>
    );
};

export default SaveJobTable;
