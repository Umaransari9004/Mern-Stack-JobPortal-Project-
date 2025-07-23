import { Menu, Avatar, Button } from '@mantine/core';
import { IconMessageCircle, IconFileText, IconUserCircle, IconLogout2 } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { setUser } from '../../Slices/Userslice.tsx';
import { USER_API_END_POINT } from '../../utils/constant.js';

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth);
  const [opened, setOpened] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        notifications.show({
          message: (res.data.message),
          withBorder: true,
          className: '!border-blue-500',
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        message: (error.response.data.message),
        color: "red",
        withBorder: true,
        className: '!border-red-500',
      });
    }
  };

  const profilePhoto = user?.profile?.profilePhoto || null;
  const userInitial = user?.name?.charAt(0).toUpperCase() || '';
  return (
    <Menu shadow="md" width={200} opened={opened} onChange={setOpened}>
      <Menu.Target>
      <div className="flex items-center gap-2 cursor-pointer">
          <div className='xs-mx:hidden'>{user?.name}</div>
          <Avatar src={profilePhoto} alt={user?.name} color="blue">
            {userInitial}
          </Avatar>
        </div>
      </Menu.Target>

      <Menu.Dropdown onChange={() => setOpened(true)}>
        {user && user.role === 'student' && (
          <Link to="/profile">
            <Menu.Item leftSection={<IconUserCircle size={14} />}>
              View Profile
            </Menu.Item>
          </Link>
        )}
        
        <Menu.Item onClick={handleLogout} color="red" leftSection={<IconLogout2 size={14} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;



  {/* Always render "Profile" link */}
        {/* <Link to="/profile">
          <Menu.Item leftSection={<IconUserCircle size={14} />}>
            Profile
          </Menu.Item>
        </Link> */}