import { useState } from 'react'
// import MultiInput from './MultiInput.tsx'
// import { dropdownData } from '../Data/JobsData.tsx'
import { Button, Collapse, Divider, Input, RangeSlider, TextInput } from '@mantine/core'
import { IconBrain, IconMapPin, IconRecharging, IconSearch } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { updateFilter } from '../../Slices/Filterslice.tsx'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

const SearchBar = () => {

  const matches = useMediaQuery('(max-width: 475px)');
  const [opened, { toggle }] = useDisclosure(false);
  const dispatch = useDispatch();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('');

  const handleChange = (name: string, value: string) => {
    // Update local state
    if (name === "jobTitle") setJobTitle(value);
    if (name === "location") setLocation(value);
    if (name === "experience") setExperience(value);
    if (name === "jobType") setJobType(value);

    // Correct dispatch: send { [name]: value } as payload
    dispatch(updateFilter({ [name]: value }));
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
              value={jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Job Title"
            />
          </div>

          <div className="flex items-center lg-mx:w-[40%]">
            <div className="text-blue-400 rounded-full p-1 mr-2">
              <IconMapPin size={25} />
            </div>
            <TextInput
              name="location"
              value={location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Location"
            />
          </div>
          <div className="flex items-center lg-mx:w-[40%]">
            <div className="text-blue-400 rounded-full p-1 mr-2">
              <IconBrain size={25} />
            </div>
            <Input
              value={experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Experience"
            />
          </div>

          <div className="flex items-center lg-mx:w-[40%]">
            <div className="text-blue-400 rounded-full p-1 mr-2">
              <IconRecharging size={25} />
            </div>
            <TextInput
              value={jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
              className="[&_input]:!placeholder-gray-400 border border-blue-200 p-2 w-64 lg-mx:w-[70%] text-lg"
              variant="unstyled"
              placeholder="Job Type"
            />
          </div>

        </div>
      </Collapse>



      {/* {
        dropdownData.map((item, index) => {
          return <React.Fragment key={index}><div key={index} className='w-1/5'>
            <MultiInput title={item.title} icon={item.icon} options={item.options} />
          </div>
            <Divider mr="xs" size="xs" orientation="vertical" /></React.Fragment>
        })
      } */}
      {/* <div className="w-1/5 [&_.mantine-Slider-label]:!translate-y-10">
      <div className="flex text-sm justify-between">
        <div>Salary</div>
        <div>&#8377;{value[0]} LPA - &#8377;{value[1]} LPA</div>
      </div>
      <RangeSlider  size="xs" value={value} labelTransitionProps={{
          transition: 'skew-down',
          duration: 150,
          timingFunction: 'linear',
        }} onChange={setValue} />
      </div> */}
    </div>

  )
}

export default SearchBar;
