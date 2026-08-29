import { Button, Collapse, Input, TextInput } from '@mantine/core'
import { IconMapPin, IconRecharging, IconSearch } from '@tabler/icons-react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

const SearchBar = ({ searchParams, setSearchParams }: any) => {
  const matches = useMediaQuery('(max-width: 475px)');
  const [opened, { toggle }] = useDisclosure(false);

  const handleChange = (name: string, value: string) => {
    setSearchParams((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="lg:flex justify-center p-5 ">
      <div className='flex xs-mx:justify-end py-2'>
        {matches && <Button onClick={toggle} variant='outline' radius="lg" className='align' autoContrast>{opened ? "close" : "Filter"}</Button>}
      </div>
      <Collapse in={(opened || !matches)}>
        <div className="flex items-center lg-mx:flex-wrap gap-6">
          <div className="flex items-center lg-mx:w-[40%]">
            <div className="text-blue-400 rounded-full p-1 mr-2">
              <IconSearch size={25} />
            </div>
            <Input
              value={searchParams.jobTitle}
              onChange={(e: any) => handleChange("jobTitle", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Talent Name or Role"
            />
          </div>

          <div className="flex items-center lg-mx:w-[40%]">
            <div className="text-blue-400 rounded-full p-1 mr-2">
              <IconMapPin size={25} />
            </div>
            <TextInput
              name="location"
              value={searchParams.location}
              onChange={(e: any) => handleChange("location", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Location"
            />
          </div>
          <div className="flex items-center lg-mx:w-[40%]">
            <div className="text-blue-400 rounded-full p-1 mr-2">
              <IconRecharging size={25} />
            </div>
            <Input
              value={searchParams.skills}
              onChange={(e: any) => handleChange("skills", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Skills (e.g. React, Node)"
            />
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default SearchBar;






















// import React, { useState } from 'react'

// import { Divider, Input, RangeSlider } from '@mantine/core'
// import { searchFields } from '../../Data/TalentData.tsx'
// // import MultiInput from '../FindJobs/MultiInput.tsx';
// import { IconUserCircle } from '@tabler/icons-react';

// const SearchBar = () => {

//   const [value, setValue] = useState<[number, number]>([1, 100]);
//   return (
//     <div className='flex px-5 py-8 items-center'>
//         <div className="flex items-center">
//             <div className="text-blue-400  rounded-full p-1 mr-2"><IconUserCircle size={25}/></div>
//             <Input className="[&_input]:!placeholder-gray-400" variant="unstyled" placeholder="Talent Name" />
//         </div>
//       {
//         searchFields.map((item, index) =><> <div key={index} className='w-1/5'>
//         {/* <MultiInput {...item}/>  */}
//           </div>
//           <Divider mr="xs" size="xs" orientation="vertical" />
//           </>)
//       }
//       <div className="w-1/5 [&_.mantine-Slider-label]:!translate-y-10">
//       <div className="flex text-sm justify-between">
//         <div>Salary</div>
//         <div>&#8377;{value[0]} LPA - &#8377;{value[1]} LPA</div>
//       </div>
//       <RangeSlider  size="xs" value={value} labelTransitionProps={{
//           transition: 'skew-down',
//           duration: 150,
//           timingFunction: 'linear',
//         }} onChange={setValue} />
//       </div>
//     </div>
//   )
// }

// export default SearchBar;