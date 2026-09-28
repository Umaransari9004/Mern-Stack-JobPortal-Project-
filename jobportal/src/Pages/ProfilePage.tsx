import { Divider } from '@mantine/core'
import React from 'react'
import { useSelector } from 'react-redux'
import Profile from '../Components/Profile/Profile.tsx'
import EmployerProfile from '../Components/EmployerProfile/EmployerProfile.tsx'

const ProfilePage = () => {
  const { user } = useSelector((store: any) => store.auth);

  if (user?.role === 'employer') {
    return (
      <div className="min-h-[90vh] bg-gray-50 font-['poppins']">
        <EmployerProfile />
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-white font-['poppins']">
      <Divider mx="md" mb="xl"/>
      <Profile />
    </div>
  )
}

export default ProfilePage
