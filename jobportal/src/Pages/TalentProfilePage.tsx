import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../Components/TalentProfile/Profile.tsx"
import { profile } from "../Data/TalentData.tsx";
// import RecommendTalent from "../TalentProfile/RecommendTalent.tsx";


const TalentProfilePage = () => {
  const navigate=useNavigate();
    return (
      <div className="min-h-[90vh] bg-white font-['poppins'] p-4">
       
        
        <Button leftSection={<IconArrowLeft size={20} /> } onClick={()=>navigate(-1)} color='blue.4' variant="light" className="mx-5">Back</Button>
        
        
        <div className="flex gap-5">
            <Profile {...profile}/>
            {/* <RecommendTalent/> */}
        </div>
      </div>
    )
  }
  
  export default TalentProfilePage;
  