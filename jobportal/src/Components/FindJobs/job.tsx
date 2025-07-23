import React, { useState, useEffect } from 'react';
import JobCard from './jobCard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilter } from '../../Slices/Filterslice.tsx';

interface Job {
  _id: string;
  jobTitle: string;
  location: string;
  experience: string;
  jobType: string;
 
}
const Job = () => {
  const dispatch = useDispatch();
  const { allJobs } = useSelector((store:any) => store.job);
  const  filter  = useSelector((state:any) => state.filter);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);;

  useEffect(() => {
    dispatch(resetFilter());
  }, []);

  useEffect(() => {
    if (!allJobs) return;

    let filtered = [...allJobs];

    // Independent filter checks
    if (filter?.jobTitle) {
        filtered = filtered.filter(job => 
            job.jobTitle.toLowerCase().includes(filter.jobTitle.toLowerCase())
        );
    }
    
    if (filter?.location) {
        filtered = filtered.filter(job => 
            job.location.toLowerCase().includes(filter.location.toLowerCase())
        );
    }

    if (filter?.experience) {
      filtered = filtered.filter(job => 
          job.experience.toLowerCase().includes(filter.experience.toLowerCase())
      );
  }
    
    if (filter?.jobType) {
        filtered = filtered.filter(job => 
            job.jobType.toLowerCase().includes(filter.jobType.toLowerCase())
        );
    }

    setFilteredJobs(filtered);
}, [filter, allJobs]);

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div className="text-2xl xs-mx:text-xl font-semibold">Recommended Jobs</div>
      </div>

      <div className="mt-5 flex flex-wrap gap-10 sm-mx:gap-5 justify-around">
        {filteredJobs.map((job:any) => 
          <JobCard key={job._id} {...job} />
        )}
      </div>
    </div>
  );
};

export default Job;