import { Button, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '../../Slices/Jobslice.tsx';

const Jobs = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    const searchedQuery = `${jobTitle} ${jobType}`.trim();
    dispatch(setSearchedQuery(searchedQuery));
    navigate(`/browse?title=${jobTitle}&type=${jobType}`); 
  };

  return (
    <div className="mt-16 xs-mx:mt-10 flex flex-col items-center text-center  px-6 xs-mx:p-2">
    {/* Text Section */}
    <div className="max-w-3xl">
      <div className="text-6xl sm-mx:text-5xl xs-mx:text-3xl font-bold leading-tight [&>span]:text-blue-400">
        Find Your <span>Dream</span> <span>Job</span> With Us
      </div>
      <div className="text-lg xs-mx:text-sm text-gray-800 mt-4">
        Good life begins with a good company. Start exploring thousands of jobs in one place.
      </div>
    </div>

    {/* Search Section */}
    <div className="flex xs-mx:w-full gap-5 xs-mx:gap-3 mt-8 items-center">
          <TextInput
            className="bg-blue-100 rounded-lg p-1 px-2 border border-blue-200"
            variant="unstyled"
            label="Job Title"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <TextInput
            className="bg-blue-100 rounded-lg p-1 px-2 border border-blue-200"
            variant="unstyled"
            label="Job Type"
            placeholder="Job Type"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />
          <div
            className="flex items-center justify-center h-full w-20 bg-blue-400 !text-gray-200 rounded-lg p-2 hover:bg-blue-500 cursor-pointer"
            onClick={searchJobHandler}
          >
            <IconSearch className="h-[85%] w-[85%]"/>
          </div>
        </div>
 

      {/* Right Section */}
      {/* <div className="w-[55%] flex items-center justify-center">
        <div className="w-[30rem]">
          <img src="/Boy2.png" alt="boy" className="w-full h-auto object-contain" />
        </div>
      </div> */}
    </div>
  );
};

export default Jobs;




