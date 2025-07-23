import { Avatar, Button, Divider, FileInput, Overlay } from '@mantine/core'
import { IconAddressBook, IconEdit, IconMail } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UpdateProfileDialog from './UpdateProfileDialog.tsx'
import useGetAppliedJobs from '../../hooks/useGetAppliedJob.tsx'
import { useHover } from '@mantine/hooks'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { setUser } from '../../Slices/Userslice.tsx'
import { notifications } from '@mantine/notifications'

const isResume = true;
const Profile = () => {

  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store: any) => store.auth);

  const [input, setInput] = useState({
    file: user?.profile?.profilePhoto || ""

  });

  const { hovered, ref } = useHover();
  const dispatch = useDispatch();

  const photoChangeHandler = async (file: File | null) => {
    if (!file) return;

    setInput({ ...input, file });

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        notifications.show({
          message: (res.data.message),
          withBorder: true,
          className: '!border-blue-500',
        })
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        message: (error.response.data.message),
        color: "red",
        withBorder: true,
        className: '!border-red-500',
      })
    }
  };

  return (
    <div className="w-3/4 lg-mx:w-full mx-auto">
      <div className="relative px-3">
        <img className="rounded-t-2xl xs-mx:h-32" src="/Profile/banner.jpg" alt="" />
        <div ref={ref} className=" !rounded-full -bottom-1/3 md-mx:-bottom-10 sm-mx:-bottom-14 absolute left-6  flex items-center justify-center ">
          <Avatar className="!w-48 !h-48 md-mx:!w-40 md-mx:-!h-40 border-gray-300 border-8 rounded-full sm-mx:!w-36 sm-mx:!h-36 xs-mx:!w-32 xs-mx:!h-32" src={user?.profile?.profilePhoto || '/avatar.png'} alt='' />
          {hovered && <Overlay className="!rounded-full" color="#000" backgroundOpacity={0.50} />}
          {hovered && <IconEdit className="absolute z-[300] !w-16 !h-16" />}
          {hovered && <FileInput id="file" name="file" accept="image/*" onChange={photoChangeHandler}
            className="absolute z-[301] w-full [&_*]:!rounded-full [&_*]:!h-full" variant="transparent" />}
        </div>
      </div>
      <div className="px-3 lg:mt-20 lg-mx:mt-16 ">
        <div className="text-3xl xs-mx:text-xl font-semibold flex justify-between">
          {user?.name}
          <Button onClick={() => setOpen(true)} color="blue.4" variant="light"  ><IconEdit stroke={1.5} /> Edit</Button>
        </div>
        <div className="text-xl flex gap-1 xs-mx:text-sm text-gray-500 items-center">
          {/* <IconBriefcase   />{user?.role} &bull; {profile.company} */}
          <IconMail className="h-5 w-5 " stroke={1.5} />
          <span>{user?.email}</span>
        </div>
        <div className="text-lg xs-mx:text-sm flex gap-1  text-gray-500 items-center">
          {/* <IconMapPin   />{profile.location} */}
          <IconAddressBook className="h-5 w-5 " stroke={1.5} />
          <span>{user?.profile?.phoneNumber}</span>
        </div>
        <div className='grid  w-full max-w-sm items-center gap-1.5'>
          <h1 className="text-md font-bold">Resume:-</h1>
          {
            isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
          }
        </div>
      </div>
      <Divider mx="xs" my="xl" />

      <div className="px-3">
        <div className="text-2xl xs-mx:text-xl font-semibold mb-3">Skills</div>
        <div className="flex flex-wrap  gap-2">
          {
            user?.profile?.skills?.map((skill: any, index: any) => <div key={index} className="bg-blue-400 text-sm xs-mx:text-xs font-medium bg-opacity-15 rounded-3xl text-blue-400 px-3 py-1">{skill}</div>)
          }
        </div>
      </div>
      <Divider mx="xs" my="xl" />
      <div className="px-3">
        <div className="text-2xl xs-mx:text-xl font-semibold mb-3">About</div>
        <div className="text-md xs-mx:text-sm text-gray-700 text-justify">
          {user?.profile?.bio}
        </div>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )

}
export default Profile;

