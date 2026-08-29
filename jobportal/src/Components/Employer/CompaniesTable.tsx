import { useEffect, useState, useRef } from 'react'
import { Avatar, Pagination } from '@mantine/core';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconDots, IconEdit, IconTrash, IconCalendar, IconBuilding } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { COMPANY_API_END_POINT } from '../../utils/constant';
import axios from 'axios';

const ITEMS_PER_PAGE = 6;

const CompaniesTable = () => {

    const navigate = useNavigate();
    const { companies, searchCompanyByText } = useSelector((store: any) => store?.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    /* ── Pagination state ── */
    const [activePage, setActivePage] = useState(1);
    const totalPages = Math.ceil((filterCompany?.length || 0) / ITEMS_PER_PAGE);

    /* ── Compute the slice of companies for the current page ── */
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedCompanies = filterCompany?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

    /* ── filter logic (unchanged) ── */
    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company: any) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
        setActivePage(1); // Reset to page 1 when search changes
    }, [companies, searchCompanyByText])

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

    /* ── delete company (unchanged) ── */
    const deleteCompany = async (id:any) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                notifications.show({
                    title: "Deleted Successfully",
                    message: res.data.message,
                    color: "green",
                });
                setFilterCompany((prev: any[]) => {
                    const updated = prev.filter(company => company._id !== id);
                    // If the current page becomes empty after deletion, go to the previous page
                    const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
                    if (activePage > newTotalPages && newTotalPages > 0) {
                        setActivePage(newTotalPages);
                    }
                    return updated;
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    return (
        <div className='sm-mx:mx-3'>
            {/* Rich list container */}
            <div className="space-y-3">
                {paginatedCompanies?.length > 0 ? (
                    paginatedCompanies.map((company: any) => (
                        <div
                            key={company._id}
                            onClick={() =>
                                navigate(`/company/${company._id}`)
                            }
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                        >
                            {/* Left: logo + info */}
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 p-1.5 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <IconBuilding size={24} className="text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors">
                                        {company.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                        <IconCalendar size={14} />
                                        Registered {company.createdAt?.split('T')[0]}
                                    </p>
                                </div>
                            </div>

                            {/* Right: hover button + dropdown */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/company/${company._id}`);
                                    }}
                                    className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                                >
                                    View Details
                                </button>

                                {/* Dropdown trigger */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleDropdown(company._id, e)}
                                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors border border-transparent hover:border-slate-300"
                                    >
                                        <IconDots size={18} />
                                    </button>

                                    {openDropdownId === company._id && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden text-left"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    navigate(`/companies-post/${company._id}`);
                                                }}
                                                className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <IconEdit size={14} className="mr-2 text-slate-400" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    deleteCompany(company._id);
                                                }}
                                                className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                                            >
                                                <IconTrash size={14} className="mr-2 text-rose-400" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty state */
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 flex flex-col items-center justify-center text-center px-4">
                        <div className="bg-slate-50 p-5 rounded-2xl mb-5 border border-slate-100">
                            <IconBuilding size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No companies found
                        </h3>
                        <p className="text-slate-500 max-w-sm font-medium">
                            {searchCompanyByText
                                ? `No companies matching "${searchCompanyByText}". Try a different search.`
                                : 'You haven\'t registered any companies yet. Click "New Company" to get started.'}
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
            {filterCompany?.length > 0 && (
                <p className="text-center text-sm text-slate-400 font-medium mt-4">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filterCompany.length)} of {filterCompany.length} companies
                </p>
            )}
        </div>
    )
}

export default CompaniesTable;
