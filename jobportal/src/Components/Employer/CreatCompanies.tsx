import React, { useEffect, useState } from 'react'
import CompaniesTable from './CompaniesTable.tsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '../../Slices/Companieslice.tsx';
import useGetAllCompanies from '../../hooks/useGetAllCompanies.tsx';
import { useSelector } from 'react-redux';
import { IconSearch, IconPlus } from '@tabler/icons-react';

const CreatCompanies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector((store: any) => store?.company);

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);

  return (
    <div className='max-w-6xl mx-auto my-10 sm-mx:mx-3'>

      {/* ── Dashboard Header ── */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
        {/* Left: Title + subtitle */}
        <div>
          <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
            Registered Companies
          </h1>
          <p className='mt-2 text-slate-500 font-medium'>
            Managing {companies?.length || 0} partner organizations.
          </p>
        </div>

        {/* Right: Search + New Company */}
        <div className='flex items-center gap-3 w-full md:w-auto'>
          {/* Search Input */}
          <div className='relative flex-grow md:w-72'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IconSearch size={16} className='text-slate-400' />
            </div>
            <input
              type="text"
              className='block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400'
              placeholder="Search companies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* New Company Button */}
          <button
            onClick={() => navigate("/companies-post")}
            className='flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm text-sm font-bold transition-all'
          >
            <IconPlus size={16} stroke={3} />
            <span className='hidden sm:inline'>New Company</span>
          </button>
        </div>
      </div>

      {/* ── Companies Table ── */}
      <CompaniesTable/>
    </div>
  )
}

export default CreatCompanies;
