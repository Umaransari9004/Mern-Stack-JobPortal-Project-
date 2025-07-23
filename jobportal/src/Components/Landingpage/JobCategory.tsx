import React from 'react';
import { Carousel } from '@mantine/carousel';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { jobCategory } from '../../Data/Data.tsx';

const JobCategory = () => {
  return (
    <div className="mt-20 xs-mx:mt-10 pb-5">
      <div className="text-4xl font-semibold text-center md-mx:text-3xl sm-mx:text-2xl xs-mx:text-xl mb-3">
        Browse <span className="text-blue-400">Job</span> Categories
      </div>
      <div className="text-lg sm-mx:text-base xs-mx:text-sm text-gray-400 text-center w-1/2 mx-auto sm-mx:w-11/12">Explore diverse job opportunities tailored to your skills. start your career journey today!</div>
      <Carousel slideSize="22%" slideGap="md"  loop className="focus-visible:[&_button]:!outline-none [&_button]:!bg-blue-400 [&_button]:!border-none [&_button]:hover:opacity-75 [&_button]:opacity-0 hover:[&_button]:opacity-100"
      nextControlIcon={<IconArrowRight className="w-8 h-8" />}
      previousControlIcon={<IconArrowLeft className="w-8 h-8" />}
      >
        {jobCategory.map((category, index) => (
          <Link to="/jobs">
          <Carousel.Slide key={index}>
            <div className="flex flex-col items-center w-64 sm-mx:w-56 xs-mx:48 gap-2 border border-blue-400 p-5 rounded-xl hover:cursor-pointer hover:shadow-[0_0_5px_2px_black] my-5 translate duration-300 ease-in-out  !shadow-blue-300 ">
              <div className="p-2 bg-blue-300 rounded-full">
                {/* Fixed the dynamic src issue */}
                <img
                  className="h-8 w-8 sm-mx:h-6 sm-mx:w-6 xs-mx:h-4 xs-mx:w-4"
                  src={`/Category/${category.name}.png`}
                  alt={category.name}
                />
              </div>
              <div className=" text-lg sm-mx:text-lg xs-mx:text-base font-semibold">
                {category.name}
              </div>
              <div className="text-sm xs-mx:text-xs text-center text-gray-400">{category.desc}</div>
              {/* <div className="text-lg text-blue-400">{category.jobs}+ new job posted</div> */}
            </div>
          </Carousel.Slide>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default JobCategory;

