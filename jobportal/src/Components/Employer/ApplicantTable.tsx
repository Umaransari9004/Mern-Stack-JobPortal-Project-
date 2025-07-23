import { Button, Popover, Table, TableCaption } from '@mantine/core'
import { IconDots } from '@tabler/icons-react';
import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { APPLICATION_API_END_POINT } from '../../utils/constant.js';


const shortlistingStatus = ["Accepted", "Rejected"];


const ApplicantTable = () => {
  const { applicants } = useSelector((store: any) => store.application);

  const statusHandler = async (status, id) => {
    console.log('called');
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
      console.log(res);
      if (res.data.success) {
        notifications.show({
          message: (res.data.message),
          withBorder: true,
          className: '!border-blue-500',
        })
      }
    } catch (error) {
      notifications.show({
        message: (error.response.data.message),
        color: "red",
        withBorder: true,
        className: '!border-red-500',
      })
    }
  }
  return (
    <div className='px-3'>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <Table>
              <TableCaption>A list of your recent Applied User</TableCaption>

              <Table.Thead>

                <Table.Tr className='font-semibold'>
                  <Table.Td>Name</Table.Td>
                  <Table.Td>Email</Table.Td>
                  <Table.Td>Contact</Table.Td>
                  <Table.Td>Resume</Table.Td>
                  <Table.Td>Date</Table.Td>
                  <Table.Td>Action</Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>

                {
                  applicants && applicants?.applications?.map((item) => (
                    <Table.Tr key={item._id}>
                      <Table.Td>{item?.applicant?.name}</Table.Td>
                      <Table.Td>{item?.applicant?.email}</Table.Td>
                      <Table.Td>{item?.applicant?.profile?.phoneNumber}</Table.Td>
                      <Table.Td>
                        {
                          item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                        }
                      </Table.Td>
                      <Table.Td>{item?.applicant.createdAt.split("T")[0]}</Table.Td>
                      <Table.Td >
                        <Popover >
                          <Popover.Target >
                            <Button><IconDots /></Button>
                          </Popover.Target>
                          <Popover.Dropdown className="w-32">
                            {
                              shortlistingStatus.map((status, index) => {
                                return (
                                  <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                    <span>{status}</span>
                                  </div>
                                )
                              })
                            }

                          </Popover.Dropdown>
                        </Popover>
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

export default ApplicantTable
