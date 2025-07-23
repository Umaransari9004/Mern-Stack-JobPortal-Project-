import { Divider } from '@mantine/core'
import useGetAllJobs from '../hooks/useGetAllJobs.tsx'
import SearchBar from '../Components/FindJobs/SearchBar.tsx'
import Job from '../Components/FindJobs/job.tsx'
import useGetAllSavedJob from '../hooks/useGetAllSavedJob.tsx'

const FindJobs = () => {
  useGetAllJobs();
  useGetAllSavedJob();
  return (
    <div className="min-h-[90vh] bg-white font-['poppins']">
      <SearchBar/>
      <Divider size="xs"mx="md" />
        <Job/>
        </div>
  )
}

export default FindJobs
