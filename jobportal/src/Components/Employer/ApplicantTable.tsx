import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Button, Divider, Pagination, Text } from '@mantine/core';
import {
    IconDots,
    IconPhone,
    IconCalendar,
    IconCircleCheck,
    IconCircleX,
    IconUser,
    IconUserCircle,
    IconMessageCircle,
} from '@tabler/icons-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { APPLICATION_API_END_POINT } from '../../utils/constant.js';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 8;

const ApplicantTable = () => {
    const { applicants } = useSelector((store: any) => store.application);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    /* ── Pagination state ── */
    const [activePage, setActivePage] = useState(1);
    const applications = applicants?.applications || [];
    const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedApplicants = applications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

    /* ── status handler (unchanged) ── */
    const statusHandler = async (status: string, id: string) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                notifications.show({
                    message: (res.data.message),
                    withBorder: true,
                    className: '!border-blue-500',
                });
                setOpenDropdownId(null);
            }
        } catch (error: any) {
            notifications.show({
                message: (error.response.data.message),
                color: "red",
                withBorder: true,
                className: '!border-red-500',
            });
        }
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    return (
        <div>
            {/* ── Applicant Cards Grid (TalentCard style) ── */}
            {paginatedApplicants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedApplicants.map((item: any) => (
                        <div
                            key={item._id}
                            className="bg-blue-50 p-5 flex flex-col gap-4 rounded-xl hover:shadow-[0_0_5px_blue] !shadow-blue-500 relative min-h-[280px]"
                        >
                             {/* ── Options Menu (3-dot) ── */}
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleDropdown(item._id, e)}
                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        <IconDots size={18} />
                                    </button>

                                    {openDropdownId === item._id && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden text-left"
                                        >
                                            <button
                                                onClick={() => statusHandler("Accepted", item._id)}
                                                className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                                            >
                                                <IconCircleCheck size={16} className="mr-2" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => statusHandler("Rejected", item._id)}
                                                className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-100"
                                            >
                                                <IconCircleX size={16} className="mr-2" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                            </div>


                            {/* ── Top: Avatar + Name + Email + Status ── */}
                            <div className="flex gap-2 items-center pr-8">
                                <div className="p-2 bg-blue-100 rounded-full shrink-0">
                                    <Avatar
                                        size="lg"
                                        src={item?.applicant?.profile?.profilePhoto || null}
                                        alt={item?.applicant?.name}
                                    >
                                        {/* Fallback: initials */}
                                        {item?.applicant?.name
                                            ?.split(' ')
                                            .map((n: string) => n[0])
                                            .join('')
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5 gap-2">
                                        <div className="font-semibold text-lg leading-tight truncate">{item?.applicant?.name}</div>
                                        {item?.status && item.status !== 'pending' && (
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                                                item.status.toLowerCase() === 'accepted'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate pr-2">{item?.applicant?.email}</div>
                                </div>
                            </div>

                            {/* ── Skill Tags ── */}
                            {item?.applicant?.profile?.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {item?.applicant?.profile?.skills?.slice(0, 4).map((skill: string, index: number) => (
                                        <div key={index} className="p-2 py-1 bg-blue-100 text-blue-400 rounded-lg text-xs">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Bio ── */}
                            {item?.applicant?.profile?.bio && (
                                <div>
                                    <Text className="!text-xs text-justify !text-gray-700" lineClamp={3}>
                                        {item?.applicant?.profile?.bio}
                                    </Text>
                                </div>
                            )}

                            <Divider size="xs" color="gray.4" />

                            {/* ── Experience + Applied Date ── */}
                            <div className="flex justify-between">
                                <div className="font-semibold text-gray-700 text-sm">
                                    {item?.applicant?.profile?.experience ? `Exp: ${item?.applicant?.profile?.experience}` : 'Exp: N/A'}
                                </div>
                                <div className="flex gap-1 text-xs text-gray-500 items-center">
                                    <IconCalendar size={14} stroke={1.5} />
                                    Applied at: {item?.createdAt?.split('T')[0]}
                                </div>
                            </div>

                            <Divider size="xs" color="gray.4" />

                            {/* ── Action Buttons (Profile / Message) ── */}
                            <div className="flex [&>*]:w-1/2 [&>*]:p-1 mt-auto">
                                <div>
                                    <Link to={`/talent-Profile/${item?.applicant?._id}`} state={{ applicationId: item._id, applicationStatus: item.status, jobId: item.job }}>
                                        <Button color='blue.4' variant="outline" fullWidth leftSection={<IconUserCircle size={16} />}>
                                            Profile
                                        </Button>
                                    </Link>
                                </div>
                                <Link to={`/messages/${item?.applicant?._id}`} state={{ jobId: item.job }}>
                                    <Button
                                        color="blue.4"
                                        variant="light"
                                        fullWidth
                                        leftSection={<IconMessageCircle size={16} />}
                                    >
                                        Message
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="bg-blue-50 rounded-xl py-16 flex flex-col items-center justify-center text-center px-4">
                    <div className="bg-blue-100 p-5 rounded-full mb-5">
                        <IconUser size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No applicants yet
                    </h3>
                    <p className="text-gray-500 max-w-sm font-medium">
                        No one has applied for this position yet. Applicants will appear here once they apply.
                    </p>
                </div>
            )}

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
            {applications.length > 0 && (
                <p className="text-center text-sm text-gray-400 font-medium mt-4">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, applications.length)} of {applications.length} applicants
                </p>
            )}
        </div>
    );
};

export default ApplicantTable;
