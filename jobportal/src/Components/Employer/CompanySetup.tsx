import { Button, FileInput, TextInput } from '@mantine/core'
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import useGetCompanyById from '../../hooks/useGetCompanyById.tsx';
import { COMPANY_API_END_POINT } from '../../utils/constant.js';

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    const { singleCompany } = useSelector((store: any) => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (file) => {

        setInput({ ...input, file });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("logo", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                notifications.show({
                    title: 'Company Created Successfully',
                    message: (res.data.message),
                    withBorder: true,
                    className: '!border-blue-500',
                })
                navigate("/companies");
            }
        } catch (error) {
            console.log(error);
            notifications.show({
                message: (error.response.data.message),
                color: "red",
                withBorder: true,
                className: '!border-red-500',
            })
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany?.name || "",
                description: singleCompany?.description || "",
                website: singleCompany?.website || "",
                location: singleCompany?.location || "",
                file: singleCompany?.file || null
            });
        }
    }, [singleCompany]);



    return (
        <div className='max-w-xl mx-auto my-10'>
            <form onSubmit={submitHandler}>
                <div className='flex items-center gap-5 p-8'>
                    <Button color="blue.4" my="lg" leftSection={<IconArrowLeft size={20} />} onClick={() => navigate("/companies")} variant="light">
                        Back
                    </Button>
                    <h1 className='font-bold text-xl'>Company Setup</h1>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex gap-10 [&>*]:w-1/2">
                        <TextInput withAsterisk label="Company Name" name="name" value={input.name} onChange={changeEventHandler} />
                        <TextInput withAsterisk label="Description" name="description" value={input.description} onChange={changeEventHandler} />
                    </div>
                    <div className="flex gap-10 [&>*]:w-1/2">
                        <TextInput withAsterisk label="Website" name="website" value={input.website} onChange={changeEventHandler} />
                        <TextInput withAsterisk label="Location" name="location" value={input.location} onChange={changeEventHandler} />
                    </div>
                    <div>

                        <FileInput withAsterisk label="Logo" accept="image/*" onChange={changeFileHandler} />
                    </div>
                    <div className="flex gap-4">
                        {
                            loading ? <Button color="blue.4" variant="light"> <IconLoader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button color="blue.4" type="submit" variant="light"> Update </Button>
                        }

                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompanySetup;
