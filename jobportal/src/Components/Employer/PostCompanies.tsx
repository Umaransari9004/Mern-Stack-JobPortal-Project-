import { Button, TextInput } from '@mantine/core'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { COMPANY_API_END_POINT } from '../../utils/constant.js';
import { setSingleCompany } from '../../Slices/Companieslice.tsx';
import { notifications } from '@mantine/notifications';


const PostCompanies = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState();
    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                notifications.show({
                    message: (res.data.message),
                    withBorder: true,
                    className: '!border-blue-500',
                })
                const companyId = res?.data?.company?._id;
                navigate(`/companies-post/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            notifications.show({
                title: 'Registration Failed',
                message: (error.response.data.message),
                color: 'red',
                withBorder: true,
                className: '!border-red-500',
            });
        }
    }
    return (
        <div>
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>

                <TextInput
                    type="text"
                    label="Company Name"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                    onChange={(e: any) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany}>Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default PostCompanies
