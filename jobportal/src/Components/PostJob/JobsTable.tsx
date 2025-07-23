import { Button, Input } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PostJobTable from './PostJobTable.tsx';
import { useDispatch } from 'react-redux';
import useGetAllPostJobs from '../../hooks/useGetAllPostJobs.tsx';
import { setSearchJobByText } from '../../Slices/Jobslice.tsx';

const JobsTable = () => {
  useGetAllPostJobs();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div className='max-w-6xl mx-auto my-10 sm-mx:mx-3'>
      <div className='flex items-center justify-between my-5 '>
        <Input
          className="w-fit"
          placeholder="Filter by name"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={() => navigate("/post-job")}>Post Job</Button>
      </div>
      <PostJobTable />
    </div>
  )
}

export default JobsTable;


