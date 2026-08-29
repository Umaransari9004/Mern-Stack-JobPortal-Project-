import { useState } from 'react';
import { Divider } from '@mantine/core';
import SearchBar from '../Components/FindTalent/SearchBar.tsx'
import Talents from '../Components/FindTalent/Talents.tsx';

const FindTalentPage = () => {
  const [searchParams, setSearchParams] = useState({ jobTitle: '', location: '', skills: '' });
  return (
   <div className="min-h-[90vh] bg-white font-['poppins']">
      <SearchBar searchParams={searchParams} setSearchParams={setSearchParams} />
      <Divider size="xs" mx="md" />
      <Talents searchParams={searchParams} />
    </div>
  )
}

export default FindTalentPage;
