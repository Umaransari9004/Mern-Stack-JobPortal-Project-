import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ApplicantTable from './ApplicantTable.tsx';
import { APPLICATION_API_END_POINT } from '../../utils/constant.js';
import { setAllApplicants } from '../../Slices/Applicationslice.tsx';
import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

const Applicants = () => {
    const navigate=useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector((store:any)=>store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
            <div className='max-w-7xl mx-auto '>
                <div className='my-5'>
                <Button leftSection={<IconArrowLeft size={20}/> } onClick={()=>navigate(-1)} color='blue.4' variant="light" >Back</Button>
                </div>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1>
                <ApplicantTable />
            </div>
    )
}

export default Applicants