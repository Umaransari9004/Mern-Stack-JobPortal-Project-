import { Badge, Table, TableCaption } from '@mantine/core'
import React from 'react'
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '../../hooks/useGetAppliedJob.tsx';

const AppliedJobTable = () => {
    useGetAppliedJobs();
    const { allAppliedJobs } = useSelector((store: any) => store.job);
    return (
        <div className='px-3'>
            <div className="flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <Table>
                            <TableCaption>A list of your Applied Jobs</TableCaption>
                            <Table.Thead>

                                <Table.Tr className='font-semibold'>
                                    <Table.Td>Date</Table.Td>
                                    <Table.Td>Job Role</Table.Td>
                                    <Table.Td>Company</Table.Td>
                                    <Table.Td>Job Type</Table.Td>
                                    <Table.Td className='text-right'>Status</Table.Td>

                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {
                                    allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (

                                        <Table.Tr key={appliedJob.id}>
                                            <Table.Td>{appliedJob.createdAt?.split("T")[0]}</Table.Td>
                                            <Table.Td>{appliedJob.job?.jobTitle}</Table.Td>
                                            <Table.Td>{appliedJob.job?.company?.name}</Table.Td>
                                            <Table.Td>{appliedJob.job?.jobType}</Table.Td>
                                            <Table.Td className='text-right' ><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></Table.Td>
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

export default AppliedJobTable
