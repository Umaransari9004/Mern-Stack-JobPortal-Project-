import React, { useEffect } from 'react'
import Jobs from "../Components/Landingpage/Jobs.tsx";
import Companies from "../Components/Landingpage/Companies.tsx";
import JobCategory from "../Components/Landingpage/JobCategory.tsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const HomePage=()=>{
    const { user } = useSelector((store:any) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'employer') {
      navigate("/companies");
    }
  }, []);
    return (
        <div className="min-h-[90vh] bg-white font-['poppins']">
            <Jobs/>
            <Companies/>
            <JobCategory/>
        </div>
    )

}
export default HomePage;