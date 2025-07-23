import { Divider } from '@mantine/core';
import SearchBar from '../Components/FindTalent/SearchBar.tsx'
import Talents from '../Components/FindTalent/Talents.tsx';

const FindTalentPage = () => {
  return (
    <div className="min-h-[90vh] bg-white font-['poppins']">
      <SearchBar/>
      <Divider size="xs"mx="md" />
      <Talents/>
        </div>
  )
}

export default FindTalentPage;
