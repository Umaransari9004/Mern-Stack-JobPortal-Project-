import React from 'react'
// import Sort from '../FindJobs/Sort.tsx';
import TalentCard from './TalentCard.tsx';
import { talents } from '../../Data/TalentData.tsx'



const Talents = () => {
  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div className="text-2xl font-semibold ">Talents</div>
        {/* <Sort/> */}
      </div>
      <div className="mt-10 flex flex-wrap gap-5 justify-evenly">
        {
            talents.map((talent, index) => <TalentCard key={index} {...talent} />)
            }
        
      </div>
    </div>
  )
}

export default Talents;
