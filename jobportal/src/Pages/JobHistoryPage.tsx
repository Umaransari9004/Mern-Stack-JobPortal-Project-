import { Tabs, TabsPanel } from '@mantine/core'
import React from 'react'
import { useLocation } from 'react-router-dom';
import AppliedJobTable from '../Components/Profile/AppliedJobTable.tsx'
import SaveJobsTable from '../Components/Profile/SaveJobsTable.tsx'


const JobHistoryPage = () => {
  const { state } = useLocation();
  const defaultTab = state?.activeTab || 'applied';


  return (
      <div className="px-3">
        <div className="text-2xl font-semibold mb-5">Job History</div>
        <Tabs variant="outline" radius="lg" defaultValue={defaultTab}>
          <Tabs.List className="[&_button]:!text-lg font-semibold mb-5 [&_button[data-active='true']]:text-blue-400">

            <Tabs.Tab value="applied">Applied</Tabs.Tab>
            <Tabs.Tab value="saved">Saved</Tabs.Tab>
            <Tabs.Tab value="offered">Offered</Tabs.Tab>
            <Tabs.Tab value="inprogress">In Progress</Tabs.Tab>

          </Tabs.List>

          <TabsPanel value="applied"><AppliedJobTable /></TabsPanel>
          <TabsPanel value="saved"><SaveJobsTable /></TabsPanel>
          <TabsPanel value="offered">
            <div className="bg-blue-50 rounded-xl py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-blue-100 p-5 rounded-full mb-5">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Yet</h3>
              <p className="text-gray-500 max-w-sm font-medium">Job offers from employers will appear here.</p>
            </div>
          </TabsPanel>
          <TabsPanel value="inprogress">
            <AppliedJobTable statusFilter="pending" />
          </TabsPanel>

        </Tabs>
      </div>
  )
}

export default JobHistoryPage
