import { Button, Drawer, TextInput, Title } from '@mantine/core'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { setUser } from '../../Slices/Userslice.tsx';
import { IconLoader2 } from '@tabler/icons-react';


const UpdateProfileDialog = ({ open, setOpen }) => {

  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store: any) => store.auth);

  const [input, setInput] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.map(skill => skill) || "",
    resumeFile: null as File | null

  });
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, resumeFile: file })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.resumeFile) {
      formData.append("resume", input.resumeFile);
    }
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
    setOpen(false);
    console.log(input);
  }
  return (
    <div className='justify-center'>
      <Drawer
        offset={8}
        radius="md"
        opened={open}
        size="lg"
        onClose={() => setOpen(false)}
        title={<Title order={3}>Update Profile</Title>}
      >
        <div className="sm:max-w-[425px]">
          <form onSubmit={submitHandler}>
            <div className='grid gap-4 py-4 justify-center'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <TextInput
                  label="Name"
                  name="name"
                  type="text"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <TextInput
                  label="Email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <TextInput
                  label="Number"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <TextInput
                  label="Bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <TextInput
                  label="Skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <TextInput
                  label="Resume"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>

              {loading ? (
                <Button color='blue.4' size="sm" variant="light">
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" color='blue.4' size="sm" variant="light">
                  Update
                </Button>
              )}
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}

export default UpdateProfileDialog
