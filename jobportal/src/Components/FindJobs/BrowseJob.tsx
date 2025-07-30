import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import JobCard from './jobCard.tsx';
import useGetAllJobs from '../../hooks/useGetAllJobs.tsx';
import { setSearchedQuery } from '../../Slices/Jobslice.tsx';

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store:any) => store.job);
  const dispatch = useDispatch();
  const location = useLocation();

  // Get search parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const title = searchParams.get('title') || '';
  const type = searchParams.get('type') || '';

  // Filter jobs
  const filteredJobs = allJobs.filter(job => {
    const matchesTitle = job.jobTitle.toLowerCase().includes(title.toLowerCase());
    const matchesType = job.jobType.toLowerCase().includes(type.toLowerCase());
    return matchesTitle && matchesType;
  });

  useEffect(() => {
    // Update Redux store with current search query
    dispatch(setSearchedQuery({ title, type }));
    
    return () => {
      dispatch(setSearchedQuery({ title: '', type: '' }));
    }
  }, [title, type, dispatch]);

  return (
    <div className='max-w-7xl mx-auto my-10'>
      <h1 className='font-bold text-xl my-10'>
        Search Results ({filteredJobs.length})
      </h1>
      <div className='p-4 w-80 sm-mx:w-full flex flex-col gap-4'>
        {filteredJobs.map((job) => (
          <JobCard key={job._id} {...job} />
        ))}
      </div>
    </div>
  );
};

export default Browse;