import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import JobDesc from "../Components/JobDesc/JobDesc.tsx";



const JobDescPage = () => {
 
 const navigate=useNavigate();
    return (
      <div className="min-h-[90vh] bg-white font-['poppins'] p-4 ">
        
        
        <Button leftSection={<IconArrowLeft size={20}/> } onClick={()=>navigate(-1)} color='blue.4' variant="light" className="mx-5 sm-mx:mx-0">Back</Button>
        
        
        <div className="flex gap-5 justify-around">
           <JobDesc />
        </div>
      </div>
    )
  }
  
  export default JobDescPage;
  