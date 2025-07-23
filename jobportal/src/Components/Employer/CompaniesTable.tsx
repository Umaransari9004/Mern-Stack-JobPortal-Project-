import { useEffect, useState } from 'react'
import { Avatar, Button, Popover, Table, TableCaption } from '@mantine/core';
import {  useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { COMPANY_API_END_POINT } from '../../utils/constant';
import axios from 'axios';

const CompaniesTable = () => {

   
    const navigate = useNavigate();
    const { companies, searchCompanyByText } = useSelector((store: any) => store?.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    const deleteCompany = async (id) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                notifications.show({
                    title: "Deleted Successfully",
                    message: res.data.message,
                    color: "green",
                });
                setFilterCompany(prev => prev.filter(company => company._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className='sm-mx:mx-3'>
            <h1 className='font-bold text-xl my-5'>
                Posted Company List ({filterCompany.length})
            </h1>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>

                <Table.Thead>

                    <Table.Tr className='font-semibold'>
                        <Table.Td>Logo</Table.Td>
                        <Table.Td>Name</Table.Td>
                        <Table.Td>Date</Table.Td>
                        <Table.Td className="text-right">Action</Table.Td>

                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        filterCompany?.map((company) => (

                            <Table.Tr>
                                <Table.Td>
                                    <Avatar src={company.logo} alt="" />
                                </Table.Td>
                                <Table.Td>{company.name}</Table.Td>
                                <Table.Td>{company.createdAt.split("T")[0]}</Table.Td>
                                <Table.Td className="text-right">
                                    <Popover >
                                        <Popover.Target >
                                            <Button><IconDots /></Button>
                                        </Popover.Target>
                                        <Popover.Dropdown className="w-32">
                                            <div onClick={() => navigate(`/companies-post/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                <IconEdit />
                                                <span className='flex w-fit items-center my-2 cursor-pointer'>Edit</span>
                                            </div>
                                            <div
                                                onClick={() => deleteCompany(company._id)}
                                                className='flex items-center gap-2 cursor-pointer hover:text-red-600'
                                            >
                                                <IconTrash size={16} />
                                                <span>Delete</span>
                                            </div>

                                        </Popover.Dropdown>
                                    </Popover>
                                </Table.Td>
                            </Table.Tr>

                        ))
                    }
                </Table.Tbody>
            </Table>
        </div>
    )
}

export default CompaniesTable;