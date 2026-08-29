import { Button, Loader } from "@mantine/core";
import { IconArrowLeft, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Profile from "../Components/TalentProfile/Profile.tsx"
import useGetTalentById from "../hooks/useGetTalentById.tsx";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { APPLICATION_API_END_POINT } from "../utils/constant.js";



const TalentProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { talent, loading, error } = useGetTalentById(id);

  const applicationId = state?.applicationId;
  const applicationStatus = state?.applicationStatus;
  const jobId = state?.jobId;

  const statusHandler = async (status: string) => {
      try {
          axios.defaults.withCredentials = true;
          const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status });
          if (res.data.success) {
              notifications.show({
                  message: res.data.message,
                  withBorder: true,
                  className: '!border-blue-500',
              });
              // optionally navigate back or update state
              navigate(-1);
          }
      } catch (error: any) {
          notifications.show({
              message: error.response?.data?.message || "Something went wrong",
              color: "red",
              withBorder: true,
              className: '!border-red-500',
          });
      }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-white flex justify-center items-center">
        <Loader size="xl" />
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-[90vh] bg-white flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-500">{error || "Talent not found"}</div>
        <Button onClick={() => navigate(-1)} color="blue.4">Go Back</Button>
      </div>
    );
  }

  // Map the API data structure to what Profile.tsx expects
  const mappedProfileData = {
    name: talent.name,
    email: talent.email,
    profilePhoto: talent.profile?.profilePhoto,
    phoneNumber: talent.profile?.phoneNumber,
    role: talent.profile?.jobTitle || "Student",
    company: talent.profile?.currentCompany,
    location: talent.profile?.location,
    about: talent.profile?.bio,
    skills: talent.profile?.skills || [],
    experience: talent.profile?.experiences?.map((exp: any) => ({
      title: exp.jobTitle,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.currentlyWorking ? 'Present' : exp.endDate,
      description: exp.summary
    })) || [],
    education: talent.profile?.educations?.map((edu: any) => ({
      degree: edu.degree,
      school: edu.school,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description
    })) || [],
    projects: talent.profile?.projects?.map((proj: any) => ({
      title: proj.title,
      technologies: proj.technologies,
      link: proj.link,
      description: proj.description
    })) || [],
    certifications: talent.profile?.certificates?.map((cert: any) => ({
      name: cert.originalName,
      issuer: "Certificate",
      issueDate: "",
      certificateId: cert.url
    })) || [],
    linkedIn: talent.profile?.linkedIn,
    github: talent.profile?.github,
    portfolio: talent.profile?.portfolio,
  };

  return (
    <div className="min-h-[90vh] bg-white font-['poppins'] p-4 max-w-7xl mx-auto">
      <div className="mx-5 mb-5">
        <Button leftSection={<IconArrowLeft size={20} />} onClick={() => navigate(-1)} color='blue.4' variant="light">Back</Button>
      </div>

      <div className="flex gap-5">
        <Profile 
          {...mappedProfileData}
          userId={id} 
          applicationId={applicationId} 
          applicationStatus={applicationStatus} 
          jobId={jobId}
          statusHandler={statusHandler} 
        />
        {/* <RecommendTalent/> */}
      </div>
    </div>
  )
}

export default TalentProfilePage;
  