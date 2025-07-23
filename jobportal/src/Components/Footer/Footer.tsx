import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBriefcase, IconMail, IconPhone } from '@tabler/icons-react';
import React from 'react';
// import { footerLinks } from '../../Data/Data.tsx';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const shouldShow = !location.pathname.startsWith('/admin') &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login";
    return shouldShow ? (
        <div className="pt-20 w-full flex flex-col bg-white font-['poppins']">
            <div className="flex gap-5 xsm-mx:gap-2 xs:justify-around flex-wrap bg-blue-50 p-4 xsm-mx:p-2  py-5">
                <div className="w-1/4 sm-mx:w-1/3 xs-mx:w-1/2 xsm-mx:w-full flex flex-col gap-4">
                    <div className="flex gap-2 items-center text-blue-400">
                        <IconBriefcase className="h-6 w-6 stroke={2.5}" />
                        <div className="text-xl font-semibold">JobPortal</div>
                    </div>
                    <div className="text-sm xsm-mx:text-xs text-gray-400">
                        Job portal with user profiles, skill updates, certifications, work experience, and admin job postings.
                    </div>
                    <div className="flex gap-3 text-blue-500 [&>div]:bg-blue-100 [&>div]:p-2 [&>div]:rounded-full [&>div]:cursor-pointer hover:[&>div]:bg-blue-200">
                        <div><IconBrandFacebook /></div>
                        <div><IconBrandInstagram /></div>
                        <div><IconBrandX /></div>
                    </div>
                </div>


                <div >
                    <div className="text-lg font-semibold mb-4 text-blue-400">Product</div>
                    <Link to="/jobs">
                        <div className="text-gray-400 text-sm xsm-mx:text-xs hover:text-blue-400 cursor-pointer mb-1 hover:translate-x-2 transition duration-300 ease-in-out">
                            <p>Find job</p>
                        </div>
                    </Link>
                    <div className="text-gray-400 text-sm xsm-mx:text-xs hover:text-blue-400 cursor-pointer mb-1 hover:translate-x-2 transition duration-300 ease-in-out">
                        <p>Companies</p>
                    </div>
                    <div className="text-gray-400 text-sm xsm-mx:text-xs hover:text-blue-400 cursor-pointer mb-1 hover:translate-x-2 transition duration-300 ease-in-out">
                        <p>Post Job</p>
                    </div>


                </div>
                <div >
                    <div className="text-lg font-semibold mb-4 text-blue-400">Contact</div>

                    <div className="text-gray-400 text-sm  cursor-pointer mb-1 hover:translate-x-2 transition duration-300 ease-in-out">
                        <p className="flex items-center"><IconPhone className="text-blue-400" />+91 9004583988</p>
                    </div>
                    <div className="text-gray-400 text-sm  cursor-pointer mb-1 hover:translate-x-2 transition duration-300 ease-in-out">
                        <p className="flex items-center"><IconMail className="text-blue-400" />Umaransari90045@gmail.com</p>
                    </div>


                </div>


            </div>

            {/* Copyright Section */}
            <div className=" bg-blue-400 text-white py-2 text-center">
                <p className="text-sm">© 2025 JobPortal. All rights reserved.</p>
            </div>
        </div>
    ) : null;
}

export default Footer;
