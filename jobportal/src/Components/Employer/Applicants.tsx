import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ApplicantTable from './ApplicantTable.tsx';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../../utils/constant.js';
import { setAllApplicants } from '../../Slices/Applicationslice.tsx';
import { Avatar } from '@mantine/core';
import { IconArrowLeft, IconBuilding, IconCalendar } from '@tabler/icons-react';

const Applicants = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector((store: any) => store.application);

    // ── NEW: Separate state for job details (with populated company) ──
    const [jobDetails, setJobDetails] = useState<any>(null);
    // ── END NEW ──

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }

        // ── NEW: Fetch job details with populated company for header ──
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, { withCredentials: true });
                if (res.data.success) {
                    setJobDetails(res.data.job);
                }
            } catch (error) {
                console.log(error);
            }
        }
        // ── END NEW ──

        fetchAllApplicants();
        fetchJobDetails(); // ── NEW ──
    }, []);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* ── Header Card ── */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors font-semibold text-sm mb-4"
                    >
                        <IconArrowLeft size={16} strokeWidth={2.5} />
                        Return to Postings
                    </button>

                    {/* Job info — uses jobDetails (with populated company) */}
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={jobDetails?.company?.logo}
                            alt={jobDetails?.company?.name}
                            size={64}
                            radius="xl"
                        />
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {jobDetails?.jobTitle || applicants?.jobTitle || 'Job Position'}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mt-1">
                                <span className="flex items-center gap-1">
                                    <IconBuilding size={14} />
                                    {jobDetails?.company?.name || 'Loading...'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <IconCalendar size={14} />
                                    Posted {jobDetails?.createdAt?.split('T')[0] || applicants?.createdAt?.split('T')[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicant count badge */}
                <div className="flex flex-col items-end justify-between h-full">
                    <span className="bg-blue-50 text-blue-500 text-sm font-bold px-3 py-1 rounded-full border border-blue-100">
                        {applicants?.applications?.length || 0} Total Applicants
                    </span>
                </div>
            </div>

            {/* ── Applicant Cards Grid ── */}
            <ApplicantTable />
        </div>
    )
}

export default Applicants