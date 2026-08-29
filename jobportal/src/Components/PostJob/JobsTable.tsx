import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PostJobTable from './PostJobTable.tsx';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllPostJobs from '../../hooks/useGetAllPostJobs.tsx';
import { setSearchJobByText } from '../../Slices/Jobslice.tsx';
import { IconSearch, IconPlus } from '@tabler/icons-react';

const tabs = [
  { key: 'active', label: 'Active' },
  { key: 'closed', label: 'Closed' },
  { key: 'drafts', label: 'Drafts' },
];

const tabTitles: Record<string, string> = {
  active: 'Active Postings',
  closed: 'Closed Postings',
  drafts: 'Draft Postings',
};

const tabSubtitles: Record<string, (count: number) => string> = {
  active: (count) => `Tracking ${count} open positions across your network.`,
  closed: (count) => `${count} closed positions no longer accepting applications.`,
  drafts: (count) => `${count} draft jobs saved for later.`,
};

const JobsTable = () => {
  useGetAllPostJobs();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState('active');
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector((store: any) => store?.job);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  // Count jobs per tab
  const tabCounts: Record<string, number> = {
    active: allAdminJobs?.filter((j: any) => (j.status || 'active') === 'active').length || 0,
    closed: allAdminJobs?.filter((j: any) => j.status === 'closed').length || 0,
    drafts: allAdminJobs?.filter((j: any) => j.status === 'draft').length || 0,
  };

  return (
    <div className='max-w-6xl mx-auto my-10 sm-mx:mx-3'>

      {/* ── Dashboard Header ── */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
        {/* Left: Title + subtitle */}
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {tabTitles[activeTab]}
          </h1>
          <p className='mt-2 text-slate-500 font-medium'>
            {tabSubtitles[activeTab](tabCounts[activeTab])}
          </p>
        </div>

        {/* Right: Search + Post Job */}
        <div className='flex items-center gap-3 w-full md:w-auto'>
          {/* Search Input */}
          <div className='relative flex-grow md:w-72'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IconSearch size={16} className='text-slate-400' />
            </div>
            <input
              type="text"
              className='block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400'
              placeholder="Search by role or company..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Post Job Button */}
          <button
            onClick={() => navigate("/post-job")}
            className='flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm text-sm font-bold transition-all'
          >
            <IconPlus size={16} stroke={3} />
            <span className='hidden sm:inline'>New Posting</span>
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-md ${
                activeTab === tab.key 
                  ? 'bg-blue-50 text-blue-500' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Jobs Table ── */}
      <PostJobTable activeTab={activeTab} />
    </div>
  )
}

export default JobsTable;
