import React, { useEffect, useState } from 'react'
import { Avatar, Button, Popover, Table, TableCaption } from '@mantine/core';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconDots, IconTrash } from '@tabler/icons-react';
import { JOB_API_END_POINT } from '../../utils/constant';
import axios from 'axios';
import { notifications } from '@mantine/notifications';

const PostJobTable = () => {

    const { allAdminJobs, searchJobByText } = useSelector((store: any) => store?.job);
    const navigate = useNavigate();
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);

    useEffect(()=>{ 
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])
    const deleteJob = async (id) => {
            try {
                const res = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, {
                    withCredentials: true
                });
    
                if (res.data.success) {
                    notifications.show({
                        title: "Deleted Successfully",
                        message: res.data.message,
                        color: "green",
                    });
                    setFilterJobs(prev => prev.filter(job => job._id !== id));
                }
            } catch (error) {
                console.error(error);
            }
        };
    return (
        <div className='px-3'>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <h1 className='font-bold text-xl my-5'>
                Posted Jobs List ({filterJobs.length})
            </h1>
            <Table>
                <TableCaption>A list of your recent Posted Jobs</TableCaption>

                <Table.Thead>
                    <Table.Tr className='font-semibold'>
                    <Table.Td>Company Logo</Table.Td>
                        <Table.Td>Company Name</Table.Td>
                        <Table.Td>Role</Table.Td>
                        <Table.Td>Date</Table.Td>
                        <Table.Td className="text-right">Action</Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        filterJobs?.map((job) => (
                            <Table.Tr >
                                <Table.Td>
                                    <Avatar src={job?.company.logo} alt="" />
                                </Table.Td>
                                <Table.Td>{job?.company?.name}</Table.Td>
                                <Table.Td>{job?.jobTitle}</Table.Td>
                                <Table.Td>{job?.createdAt.split("T")[0]}</Table.Td>
                                <Table.Td className="text-right">
                                    <Button onClick={() => navigate(`/jobs-Table/${job._id}/applicants`)} color="blue.5" variant="light">Application</Button>
                                    
                                </Table.Td>
                                <Table.Td>
                                <Button onClick={() => deleteJob(job._id)} color="blue.5" variant="light">Delete</Button>
                                {/* <Popover >
                                        <Popover.Target >
                                            <Button><IconDots /></Button>
                                        </Popover.Target>
                                        <Popover.Dropdown className="w-32">
                                            
                                            <div
                                                onClick={() => deleteCompany(job._id)}
                                                className='flex items-center gap-2 cursor-pointer hover:text-red-600'
                                            >
                                                <IconTrash size={16} />
                                                <span>Delete</span>
                                            </div>

                                        </Popover.Dropdown>
                                    </Popover> */}
                                </Table.Td>
                                
                            </Table.Tr>

                        ))
                    }
                </Table.Tbody>
            </Table>
        </div>
        </div>
        </div>
        </div>
    )
}

export default PostJobTable;