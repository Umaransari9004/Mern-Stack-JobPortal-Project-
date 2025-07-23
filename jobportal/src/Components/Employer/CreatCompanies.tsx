import { Button, Input } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import CompaniesTable from './CompaniesTable.tsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '../../Slices/Companieslice.tsx';
import useGetAllCompanies from '../../hooks/useGetAllCompanies.tsx';

const CreatCompanies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);
  return (
    <div className='max-w-6xl mx-auto my-10 sm-mx:mx-3'>
    <div className='flex items-center justify-between my-5'>
        <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={() => navigate("/companies-post")}>New Company</Button>
    </div>
    <CompaniesTable/>
</div>
  )
}

export default CreatCompanies;

