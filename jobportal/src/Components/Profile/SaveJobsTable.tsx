import { Badge, Button, Divider, Table, TableCaption } from '@mantine/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useSavedJobs from '../../hooks/useGetAllSavedJob.tsx';


const SaveJobTable = () => {
  const dispatch = useDispatch();
  const { allSavedJobs } = useSelector((store: any) => store.job);
  const { saveJob, unsaveJob } = useSavedJobs();

  // Automatically fetch saved jobs when the component mounts
  useEffect(() => {
    // The useSavedJobs hook already handles fetching saved jobs on mount
  }, [dispatch]);

  return (
    <div className='px-3'>
      <div className="flow-root">
         <div className="overflow-x-auto">
           <div className="inline-block min-w-full">
      <Table >
        <TableCaption>A list of your Saved Jobs</TableCaption>
        <Table.Thead>
          <Table.Tr className='font-semibold'>
            <Table.Td>Date</Table.Td>
            <Table.Td>Job Role</Table.Td>
            <Table.Td>Company</Table.Td>
            <Table.Td>Job Type</Table.Td>
            <Table.Td className='text-right'>Actions</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {allSavedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> :
            allSavedJobs.map((savedJob) => (
              <Table.Tr key={savedJob._id}>
                <Table.Td>{savedJob.createdAt?.split("T")[0]}</Table.Td>
                <Table.Td>{savedJob.jobTitle}</Table.Td>
                <Table.Td>{savedJob.company?.name}</Table.Td>
                <Table.Td>{savedJob.jobType}</Table.Td>
                <Table.Td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link to={`/job-desc/${savedJob._id}`}>
                      <Button color="blue.4" variant="outline">
                        View Job
                      </Button>
                    </Link>
                    <Button
                      color="red.4"
                      variant="outline"
                      onClick={() => unsaveJob(savedJob._id)}
                    >
                      Unsave
                    </Button>
                  </div>
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
  //   <div className="bg-blue-50 p-4 w-96 flex flex-col gap-4 rounded-xl hover:shadow-[0_0_5px_blue] !shadow-blue-500">
  //   <div className="flex justify-between">
  //     <div className="flex gap-2 items-center ">
        
  //       <div>
  //         <div className="font-semibold text-lg">{allSavedJobs.jobTitle}</div>
  //         <div className="text-sm text-gray-700">{allSavedJobs.jobType} &bull; {allSavedJobs.company}</div>
  //       </div>
  //     </div>
      
  //   </div>
  //   {/* <div className="flex gap-2">
  //     {
  //       props.topSkills?.map((skill: any, index: any) => <div key={index} className="p-2 py-1 bg-blue-100 text-blue-400 rounded-lg text-xs">{skill}</div>
  //       )
  //     }
  //   </div> */}
    
   
  //   <Divider size="xs" color="gray.4" />
  //   <div className="flex [&>*]:w-1/2 [&>*]:p-1 ">
  //     <Link to="/talent-Profile">
  //       <Button color='blue.4' variant="outline" fullWidth>Profile</Button>
  //     </Link>
  //     <div>
  //       <Button color="blue.4" variant="light" fullWidth>Message</Button>
  //     </div>
  //   </div>
  // </div>
  );
};

export default SaveJobTable;

