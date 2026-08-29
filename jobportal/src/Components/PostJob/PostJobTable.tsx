import React, { useEffect, useState, useRef } from 'react'
import { Avatar, Pagination } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconDots, IconTrash, IconEdit, IconBriefcase, IconChevronRight, IconCalendar, IconRocket, IconPlayerStop, IconRefresh, IconBuilding } from '@tabler/icons-react';
import { JOB_API_END_POINT } from '../../utils/constant';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { setAllAdminJobs } from '../../Slices/Jobslice.tsx';

const ITEMS_PER_PAGE = 6;

interface PostJobTableProps {
    activeTab: string;
}

const PostJobTable: React.FC<PostJobTableProps> = ({ activeTab }) => {

    const { allAdminJobs, searchJobByText } = useSelector((store: any) => store?.job);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Re-fetch admin jobs from API
    const refetchJobs = async () => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAllAdminJobs(res.data.jobs));
            }
        } catch (error) {
            console.error(error);
        }
    };
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    /* ── filter logic: by tab status + search text ── */
    const filterJobs = React.useMemo(() => {
        const tabStatus = activeTab === 'drafts' ? 'draft' : activeTab;
        return (allAdminJobs || []).filter((job: any) => {
            const jobStatus = job.status || 'active';
            if (jobStatus !== tabStatus) return false;
            if (!searchJobByText) return true;
            return job?.jobTitle?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
        });
    }, [allAdminJobs, searchJobByText, activeTab]);

    /* ── Pagination state ── */
    const [activePage, setActivePage] = useState(1);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setActivePage(1);
    }, [activeTab, searchJobByText]);

    const totalPages = Math.ceil((filterJobs?.length || 0) / ITEMS_PER_PAGE);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedJobs = filterJobs?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

    /* ── close dropdown on outside click ── */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpenDropdownId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ── delete job (unchanged) ── */
    const deleteJob = async (id: string) => {
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                notifications.show({
                    title: "Deleted Successfully",
                    message: res.data.message,
                    color: "green",
                });
                // Re-fetch jobs to update the list
                    refetchJobs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    /* ── close job ── */
    const closeJob = async (id: string) => {
        try {
            const res = await axios.put(`${JOB_API_END_POINT}/close/${id}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                notifications.show({
                    title: "Job Closed",
                    message: res.data.message,
                    color: "blue",
                });
                // Update local state: remove from current tab
                refetchJobs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    /* ── publish draft ── */
    const publishJob = async (id: string) => {
        try {
            const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, { status: 'active' }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.data.success) {
                notifications.show({
                    title: "Job Published",
                    message: "Job is now active and visible to applicants.",
                    color: "green",
                });
                refetchJobs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const getStatusBadge = (status: string) => {
        if (status === 'draft') {
            return (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                    Draft
                </span>
            );
        }
        if (status === 'closed') {
            return (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200">
                    Closed
                </span>
            );
        }
        return null;
    };

    const getEmptyMessage = () => {
        if (searchJobByText) {
            return `No jobs matching "${searchJobByText}". Try a different search.`;
        }
        switch (activeTab) {
            case 'closed':
                return 'No closed jobs yet.';
            case 'drafts':
                return 'No draft jobs. Click "New Posting" to start creating one.';
            default:
                return 'You haven\'t posted any jobs yet. Click "New Posting" to get started.';
        }
    };

    /* ── Check if draft has all mandatory fields filled ── */
    const isDraftComplete = (job: any) => {
        const title = (job?.jobTitle || '').trim();
        const about = (job?.about || '').trim();
        const type = (job?.jobType || '').trim();
        const exp = (job?.experience || '').trim();
        const loc = (job?.location || '').trim();
        const salaryNum = Number(job?.salary || 0);

        return Boolean(
            title.length > 0 &&
            about.length > 0 &&
            type.length > 0 &&
            exp.length > 0 &&
            loc.length > 0 &&
            salaryNum > 0
        );
    };

    return (
        <div className='sm-mx:mx-3'>
            {/* Rich list container */}
            <div className="space-y-3">
                {paginatedJobs?.length > 0 ? (
                    paginatedJobs.map((job: any) => (
                        <div
                            key={job._id}
                            onClick={() => navigate(`/job-desc/${job._id}`)}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                        >
                            {/* Left: logo + job info + tags */}
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 p-1.5 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    {job?.company?.logo ? (
                                        <img src={job?.company?.logo} alt={job?.company?.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <IconBuilding size={24} className="text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors">
                                        {job?.jobTitle}
                                    </h3>
                                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                        <span className="text-sm font-semibold text-slate-600">
                                            {job?.company?.name}
                                        </span>
                                        {job?.jobType && (
                                            <>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                                    {job?.jobType}
                                                </span>
                                            </>
                                        )}
                                        {job?.location && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                                {job?.location}
                                            </span>
                                        )}
                                        {Number(job?.salary) > 0 && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                                ₹{job?.salary} LPA
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: applicants count + actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                                {/* Applicants + date */}
                                <div className="text-left sm:text-right hidden md:block">
                                    {activeTab !== 'drafts' && (
                                        <div className="text-sm font-bold text-slate-900">
                                            {job?.applications?.length || 0} Applicants
                                        </div>
                                    )}
                                    <div className="text-xs font-medium text-slate-500 flex items-center sm:justify-end gap-1 mt-0.5">
                                        <IconCalendar size={12} />
                                        {activeTab === 'drafts' ? 'Created' : 'Posted'} {job?.createdAt?.split('T')[0]}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {/* View Applicants button (only for active & closed) */}
                                    {(activeTab === 'active' || (activeTab === 'closed' && (job?.applications?.length || 0) > 0)) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/jobs-Table/${job._id}/applicants`);
                                            }}
                                            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-blue-400 font-bold rounded-xl hover:bg-blue-400 hover:text-white transition-colors"
                                        >
                                            View Applicants
                                            <IconChevronRight size={16} />
                                        </button>
                                    )}

                                    {/* Re-activate button for closed jobs */}
                                    {activeTab === 'closed' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                publishJob(job._id);
                                            }}
                                            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-green-50 text-green-600 font-bold rounded-xl hover:bg-green-500 hover:text-white transition-colors"
                                        >
                                            <IconRefresh size={16} />
                                            Re-activate
                                        </button>
                                    )}

                                    {/* Publish / Edit button for drafts */}
                                    {activeTab === 'drafts' && (
                                        isDraftComplete(job) ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    publishJob(job._id);
                                                }}
                                                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-green-50 text-green-600 font-bold rounded-xl hover:bg-green-500 hover:text-white transition-colors"
                                            >
                                                <IconRocket size={16} />
                                                Publish
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/post-job/${job._id}`);
                                                }}
                                                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-600 font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-colors"
                                            >
                                                <IconEdit size={16} />
                                                Edit Job
                                            </button>
                                        )
                                    )}

                                    {/* Dropdown trigger */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => toggleDropdown(job._id, e)}
                                            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors border border-transparent hover:border-blue-500"
                                        >
                                            <IconDots size={18} />
                                        </button>

                                        {openDropdownId === job._id && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden text-left"
                                            >
                                                {/* <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(null);
                                                        navigate(`/jobs-Table/${job._id}/applicants`);
                                                    }}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    <IconEdit size={14} className="mr-2 text-slate-400" />
                                                    View Applicants
                                                </button> */}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(null);
                                                        navigate(`/post-job/${job._id}`);
                                                    }}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                                                >
                                                    <IconEdit size={14} className="mr-2 text-slate-400" />
                                                    Edit Job
                                                </button>

                                                {/* Close Job option (only for active jobs) */}
                                                {(job.status || 'active') === 'active' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdownId(null);
                                                            closeJob(job._id);
                                                        }}
                                                        className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors border-t border-slate-100"
                                                    >
                                                        <IconPlayerStop size={14} className="mr-2 text-amber-400" />
                                                        Close Job
                                                    </button>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(null);
                                                        deleteJob(job._id);
                                                    }}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                                                >
                                                    <IconTrash size={14} className="mr-2 text-rose-400" />
                                                    Delete Job
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty state */
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 flex flex-col items-center justify-center text-center px-4">
                        <div className="bg-slate-50 p-5 rounded-2xl mb-5 border border-slate-100">
                            <IconBriefcase size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No jobs found
                        </h3>
                        <p className="text-slate-500 max-w-sm font-medium">
                            {searchJobByText
                                ? `No jobs matching "${searchJobByText}". Try a different search.`
                                : 'You haven\'t posted any jobs yet. Click "New Posting" to get started.'}
                        </p>
                    </div>
                )}
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
            {filterJobs?.length > 0 && (
                <p className="text-center text-sm text-slate-400 font-medium mt-4">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filterJobs.length)} of {filterJobs.length} posted jobs
                </p>
            )}
        </div>
    )
}

export default PostJobTable;