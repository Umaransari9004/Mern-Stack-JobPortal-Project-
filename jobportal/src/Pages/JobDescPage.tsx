import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import JobDesc from "../Components/JobDesc/JobDesc.tsx";



const JobDescPage = () => {
 
 const navigate=useNavigate();
 const location = useLocation();
 const fromTab = location.state?.fromTab;

 const handleBack = () => {
    if (fromTab) {
      navigate('/jobhistory', { state: { activeTab: fromTab } });
    } else {
      navigate(-1);
    }
 };

    return (
      <div className="min-h-[90vh] bg-white font-['poppins'] p-4 ">
        
        
        <Button leftSection={<IconArrowLeft size={20}/> } onClick={handleBack} color='blue.4' variant="light" className="mx-5 sm-mx:mx-0">Back</Button>
        
        
        <div className="flex gap-5 justify-around">
           <JobDesc />
        </div>
      </div>
    )
  }
  
  export default JobDescPage;
  