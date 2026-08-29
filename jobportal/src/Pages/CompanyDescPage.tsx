import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import CompanyDesc from "../Components/CompanyDesc/CompanyDesc.tsx";

const CompanyDescPage = () => {
 
 const navigate = useNavigate();

    return (
      <div className="min-h-[90vh] bg-white font-['poppins'] p-4 ">
        
        <Button leftSection={<IconArrowLeft size={20}/>} onClick={() => navigate(-1)} color='blue.4' variant="light" className="mx-5 sm-mx:mx-0">Back</Button>
        
        <div className="flex gap-5 justify-around">
           <CompanyDesc />
        </div>
      </div>
    )
  }
  
  export default CompanyDescPage;
