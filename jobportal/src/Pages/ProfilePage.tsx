import { Divider } from '@mantine/core'
import React from 'react'
import Profile from '../Components/Profile/Profile.tsx'

const ProfilePage = () => {
  return (
    <div className="min-h-[90vh] bg-white font-['poppins'] ">
      <Divider mx="md" mb="xl"/>
      <Profile/>
    </div>
  )
}

export default ProfilePage
