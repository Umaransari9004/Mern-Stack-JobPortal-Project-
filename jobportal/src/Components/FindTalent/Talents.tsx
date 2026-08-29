import React, { useState } from 'react';
import TalentCard from './TalentCard.tsx';
import useGetAllTalents from '../../hooks/useGetAllTalents.tsx';
import { Loader, Pagination } from '@mantine/core';

const ITEMS_PER_PAGE = 8;

const Talents = ({ searchParams }: any) => {
  // Combine jobTitle and skills into the general keyword search expected by the backend
  const keyword = [searchParams?.jobTitle, searchParams?.skills].filter(Boolean).join(' ');

  const { talents, loading, error } = useGetAllTalents(keyword, searchParams?.location);

  const [activePage, setActivePage] = useState(1);

  // Reset to page 1 when search params change
  React.useEffect(() => {
    setActivePage(1);
  }, [searchParams]);

  const totalPages = Math.ceil((talents?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedTalents = talents?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold">Talents</div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader size="xl" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-20">{error}</div>
      ) : talents.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">No talents found.</div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mt-10 flex flex-wrap gap-5 justify-evenly w-full">
            {paginatedTalents.map((talent: any) => (
              <TalentCard key={talent._id} talent={talent} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 mb-5">
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setActivePage}
                color="blue"
                radius="xl"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Talents;
