import { Tabs, TabsPanel } from '@mantine/core'
import React from 'react'
import AppliedJobTable from '../Components/Profile/AppliedJobTable.tsx'
import SaveJobsTable from '../Components/Profile/SaveJobsTable.tsx'


const JobHistoryPage = () => {
  return (
      <div className="px-3">
        <div className="text-2xl font-semibold mb-5">Job History</div>
        <Tabs variant="outline" radius="lg" defaultValue="saved">
          <Tabs.List className="[&_button]:!text-lg font-semibold mb-5 [&_button[data-active='true']]:text-blue-400">

            <Tabs.Tab value="saved">Saved Jobs</Tabs.Tab>
            <Tabs.Tab value="applied">Applied Jobs</Tabs.Tab>

          </Tabs.List>

          <TabsPanel value="saved"><SaveJobsTable/></TabsPanel>
          <TabsPanel value="applied"><AppliedJobTable /></TabsPanel>

        </Tabs>
      </div>
  )
}

export default JobHistoryPage
