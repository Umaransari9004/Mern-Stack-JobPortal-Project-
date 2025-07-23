import React from 'react';
import Marquee from "react-fast-marquee";
import { companies } from '../../Data/Data.tsx';


const Companies = () => {
  return (
    <div className="mt-20 xs-mx:mt-10 pb-5">
      <div className="text-4xl md-mx:text-3xl sm-mx:text-2xl xs-mx:text-xl font-semibold mb-10 text-center">
        Trusted By <span className="text-blue-400">1000+</span> Companies
      </div>
      <Marquee pauseOnHover={true}>
        {companies.map((company, index) => (
          <div
            key={index}
            className="mx-8 sm-mx:mx-6 xs-mx:mx-4 xsm-mx:mx-1 px-2 py-1 hover:bg-gray-200 rounded-xl cursor-pointer"
          >
            {/* Fixed the dynamic src issue */}
            <img
              className="h-14"
              src={`/Companies/${company}.png`}
              alt={company}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Companies;
