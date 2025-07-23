import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavLinks = () => {
  // Call hooks unconditionally at the top
  const location = useLocation();
  const { user } = useSelector((store:any) => store.auth); // Destructure user from store.auth
  
  const nonRecruiterLinks = [
    { name: "Home", url: "" },
    { name: "Jobs", url: "jobs" },
    { name: "Job History", url: "jobhistory" },
  ];
  // Define links after hooks
  const recruiterLinks = [
    { name: "Companies", url: "companies" },
    { name: "Post Job", url: "jobs-Table" },
    { name: "Find Talent", url: "find-Talent" },
  ];


  const allLinks = [...nonRecruiterLinks, ...recruiterLinks];

  // Determine which links to display based on the user's role or login status
  const links = user
    ? user.role === 'employer'
      ? recruiterLinks
      : nonRecruiterLinks
    : allLinks;

  return (
    <ul className="flex bs-mx:hidden font-medium items-center gap-2 list-none font-['poppins']">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            to={`/${link.url}`}
            className={`${
              location.pathname === `/${link.url}` ? "text-blue-400" : ""
            }`}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;