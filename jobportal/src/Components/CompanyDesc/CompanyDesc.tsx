import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, Button, Badge, Divider, Avatar, Pagination } from '@mantine/core';
import { IconMapPin, IconWorld, IconBuilding, IconBriefcase } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import JobCard from '../FindJobs/jobCard.tsx';
import { COMPANY_API_END_POINT } from '../../utils/constant.js';

const JOBS_PER_PAGE = 6;

const CompanyDesc = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useSelector((store: any) => store.auth);
    const [company, setCompany] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        const fetchCompanyAndJobs = async () => {
            setLoading(true);
            try {
                // Single API call to get company details + active jobs
                const res = await axios.get(`${COMPANY_API_END_POINT}/profile/${id}`, {
                    withCredentials: true 
                });
                if (res.data.success) {
                    setCompany(res.data.company);
                    setJobs(res.data.jobs || []);
                } else {
                    setError('Company not found.');
                }
            } catch (err: any) {
                console.error(err);
                setError('Failed to load company details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompanyAndJobs();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader color="blue" size="xl" />
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <p className="text-xl text-red-500 mb-4">{error}</p>
                <Button onClick={() => navigate(-1)} color="blue.4" variant="light">
                    Go Back
                </Button>
            </div>
        );
    }

    const foundedDate = new Date(company.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    // Pagination logic
    const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
    const startIndex = (activePage - 1) * JOBS_PER_PAGE;
    const paginatedJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

    return (
        <div className="sm-mx:w-full w-[80%]">
            {/* Company Header — Title + Edit Button */}
            <div className="flex justify-between xs-mx:gap-2">
                <div className="flex gap-4 items-center">
                    <div className="h-20 w-20 p-2 bg-blue-50 rounded-lg border-2 border-blue-100 flex items-center justify-center shrink-0">
                        {company.logo ? (
                            <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                        ) : (
                            <IconBuilding size={40} className="text-gray-400" />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="font-semibold text-2xl xs-mx:text-lg">{company.name}</div>
                        <div className="flex items-center gap-3 text-gray-600 flex-wrap">
                            {company.location && (
                                <div className="flex items-center gap-1 text-sm">
                                    <IconMapPin size={16} className="text-blue-500" />
                                    <span>{company.location}</span>
                                </div>
                            )}
                            {company.website && (
                                <div className="flex items-center gap-1 text-sm">
                                    <IconWorld size={16} className="text-blue-500" />
                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {company.website}
                                    </a>
                                </div>
                            )}
                            <Badge color="blue" variant="light" size="sm">Founded {foundedDate}</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    {user?.role === 'employer' && company?.userId === user?._id && (
                        <Button 
                            onClick={() => navigate(`/companies-post/${id}`)}
                            size="sm"
                            color='blue.4' variant="light">
                            Edit Company
                        </Button>
                    )}
                </div>
            </div>

            <Divider my="xl" />

            {/* About Company */}
            <div>
                <div className="text-xl font-semibold mb-5">About Company</div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-justify">
                    {company.description || "No description provided."}
                </p>
            </div>

            <Divider my="xl" />

            {/* Open Positions */}
            <div>
                <div className="text-xl font-semibold mb-5">Open Positions at {company.name}</div>
                
                {jobs.length > 0 ? (
                    <>
                        <div className="flex flex-wrap gap-5">
                            {paginatedJobs.map((job: any) => (
                                <JobCard key={job._id} {...job} hideSave={true} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    total={totalPages}
                                    value={activePage}
                                    onChange={setActivePage}
                                    color="blue"
                                    radius="md"
                                    size="md"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-blue-50 rounded-xl p-10 text-center">
                        <IconBriefcase size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg">No open positions available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDesc;
