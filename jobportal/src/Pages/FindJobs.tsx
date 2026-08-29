import { Divider, Pagination } from '@mantine/core'
import useGetAllJobs from '../hooks/useGetAllJobs.tsx'
import SearchBar from '../Components/FindJobs/SearchBar.tsx'
import Job from '../Components/FindJobs/job.tsx'
import useGetAllSavedJob from '../hooks/useGetAllSavedJob.tsx'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const FindJobs = () => {
  const [page, setPage] = useState(1)
  useGetAllJobs(page);
  useGetAllSavedJob();

  const { totalPages } = useSelector((store: any) => store.job)
  return (
    <div className="min-h-[90vh] bg-white font-['poppins']">
      <SearchBar />
      <Divider size="xs" mx="md" />
      <Job page={page} setPage={setPage}/>
    </div>
  )
}

export default FindJobs
