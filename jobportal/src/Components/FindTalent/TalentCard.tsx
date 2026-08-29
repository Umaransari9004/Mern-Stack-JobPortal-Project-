import { IconHeart, IconMapPin } from '@tabler/icons-react'
import { Avatar, Button, Divider, Text } from '@mantine/core';
import { Link } from 'react-router-dom';


const TalentCard = ({ talent }: any) => {
  const profile = talent?.profile || {};
  
  return <div className="bg-blue-50 p-4 w-96 flex flex-col gap-4 rounded-xl hover:shadow-[0_0_5px_blue] !shadow-blue-500">
    <div className="flex justify-between">
      <div className="flex gap-2 items-center ">
        <div className="p-2 bg-blue-100 rounded-full">
          <Avatar size="lg" src={profile.profilePhoto || ''} alt={talent.name} />
        </div>
        <div>
          <div className="font-semibold text-lg">{talent.name}</div>
          <div className="text-sm text-gray-700">{profile.jobTitle || 'Student'} &bull; {profile.currentCompany || 'N/A'}</div>
        </div>
      </div>
      <IconHeart className="text-gray-700 cursor-pointer stroke={1.5}" />
    </div>
    <div className="flex gap-2 flex-wrap">
      {
        profile.skills?.slice(0, 4).map((skill: any, index: any) => (
          <div key={index} className="p-2 py-1 bg-blue-100 text-blue-400 rounded-lg text-xs">{skill}</div>
        ))
      }
    </div>
    <div>
      <Text className="!text-xs text-justify !text-gray-700" lineClamp={3}>
        {profile.bio || 'No bio provided.'}
      </Text>
    </div>
    <Divider size="xs" color="gray.4" />
    <div className="flex justify-between">
      <div className="font-semibold text-gray-700 text-sm">
        {profile.experience ? `Exp: ${profile.experience}` : 'Exp: N/A'}
      </div>
      <div className="flex gap-1 text-xs text-gray-500 items-center">
        <IconMapPin className="h-5 w-5 " stroke={1.5} />{profile.location || 'Location N/A'}
      </div>
    </div>
    <Divider size="xs" color="gray.4" />
    <div className="flex [&>*]:w-1/2 [&>*]:p-1 ">
      <Link to={`/talent-Profile/${talent._id || ''}`}>
        <Button color='blue.4' variant="outline" fullWidth>Profile</Button>
      </Link>
      <Link to={`/messages/${talent._id || ''}`}>
        <Button color="blue.4" variant="light" fullWidth>Message</Button>
      </Link>
    </div>
  </div>
}

export default TalentCard;
