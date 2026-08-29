import { Button, Divider } from '@mantine/core'
import { IconBriefcase, IconMapPin, IconCircleCheck, IconCircleX, IconPhoneCall, IconMail } from '@tabler/icons-react'
import React from 'react'
import ExpCard from './ExpCard.tsx'
import CertiCard from './CertiCard.tsx'
import { useNavigate } from 'react-router-dom'


const Profile = (props: any) => {
  const navigate = useNavigate();
  return (
    <div className="w-3/4 lg-mx:w-full mx-auto pb-2">
      <div className="relative">
        <img className="rounded-t-2xl" src="/Profile/banner.jpg" alt="" />
        <img
          className="w-44 h-44 rounded-full -bottom-1/3 absolute left-3 border-white border-[6px] object-cover"
          src={props.profilePhoto || '/avatar.png'}
          alt={props.name}
        />
      </div>
      <div className="px-3 mt-16 pt-4">
        <div className="text-3xl font-semibold flex justify-between items-center">{props.name}
          <div className="flex gap-3">
             {props.applicationId && (
                <>
                  <Button 
                      color="green.4" 
                      leftSection={<IconCircleCheck size={18} />}
                      onClick={() => props.statusHandler("Accepted")}
                      disabled={props.applicationStatus === "Accepted"}
                  >
                      Accept
                  </Button>
                  <Button 
                      color="red.4" 
                      variant="outline"
                      leftSection={<IconCircleX size={18} />}
                      onClick={() => props.statusHandler("Rejected")}
                      disabled={props.applicationStatus === "Rejected"}
                  >
                      Reject
                  </Button>
                </>
             )}
             <Button color="blue.4" variant="light" onClick={() => navigate(`/messages/${props.userId}`, { state: { jobId: props.jobId } })} >Message</Button>
          </div>
        </div>
        {(props.role || props.company) && (
          <div className="text-xl flex gap-1 items-center">
            <IconBriefcase className="h-5 w-5" stroke={1.5} />
            {props.role}{props.company && props.company !== 'N/A' ? ` • ${props.company}` : ''}
          </div>
        )}
        {props.location && props.location !== 'N/A' && (
          <div className="text-lg flex gap-1 text-gray-500 items-center">
            <IconMapPin className="h-5 w-5" stroke={1.5} />{props.location}
          </div>
        )}
        {props.phoneNumber && (
          <div className="text-sm flex gap-1 text-gray-500 mt-1 items-center">
            <IconPhoneCall className="h-4 w-4" stroke={1.5} /> {props.phoneNumber}
          </div>
        )}
        {props.email && (
          <div className="text-sm flex gap-1 text-gray-500 items-center mt-1">
            <IconMail className="h-4 w-4" stroke={1.5} /> {props.email}
          </div>
        )}
      </div>

      {/* About */}
      {props.about && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3">
            <div className="text-2xl font-semibold mb-3">About</div>
            <div className="text-sm text-gray-700 text-justify">{props.about}</div>
          </div>
        </>
      )}

      {/* Skills */}
      {props.skills && props.skills.length > 0 && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3">
            <div className="text-2xl font-semibold mb-3">Skills</div>
            <div className="flex flex-wrap gap-2">
              {props.skills.map((skill: any, index: any) => (
                <div key={index} className="bg-blue-400 text-sm font-medium bg-opacity-15 rounded-3xl text-blue-400 px-3 py-1">{skill}</div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Experience */}
      {props.experience && props.experience.length > 0 && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3">
            <div className="text-2xl font-semibold mb-5">Experience</div>
            <div className="flex flex-col gap-8">
              {props.experience.map((exp: any, index: any) => <ExpCard key={index} {...exp} />)}
            </div>
          </div>
        </>
      )}

      {/* Education */}
      {props.education && props.education.length > 0 && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3">
            <div className="text-2xl font-semibold mb-5">Education</div>
            <div className="flex flex-col gap-8">
              {props.education.map((edu: any, index: any) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="p-2 bg-blue-100 rounded-md">
                        <span className="text-xl">🎓</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold">{edu.degree}</div>
                        <div className="text-sm text-gray-700">{edu.school}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                    </div>
                  </div>
                  {edu.description && (
                    <div className="text-gray-700 text-justify">{edu.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Projects */}
      {props.projects && props.projects.length > 0 && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3">
            <div className="text-2xl font-semibold mb-5">Projects</div>
            <div className="flex flex-col gap-8">
              {props.projects.map((proj: any, index: any) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
                      <div className="p-2 bg-blue-100 rounded-md">
                        <span className="text-xl">📁</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold">{proj.title}</div>
                        {proj.technologies && (
                          <div className="text-sm text-gray-700">{proj.technologies}</div>
                        )}
                      </div>
                    </div>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <div className="text-gray-700 text-justify">{proj.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Certifications */}
      {props.certifications && props.certifications.length > 0 && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3">
            <div className="text-2xl font-semibold mb-5">Certifications</div>
            <div className="flex flex-col gap-8">
              {props.certifications.map((certi: any, index: any) => <CertiCard key={index} {...certi} />)}
            </div>
          </div>
        </>
      )}

      {/* Social Links */}
      {(props.linkedIn || props.github || props.portfolio) && (
        <>
          <Divider mx="xs" my="xl" />
          <div className="px-3 pb-5">
            <div className="text-2xl font-semibold mb-3">Links</div>
            <div className="flex flex-wrap gap-4">
              {props.linkedIn && (
                <a href={props.linkedIn} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                  🔗 LinkedIn
                </a>
              )}
              {props.github && (
                <a href={props.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                  🐙 GitHub
                </a>
              )}
              {props.portfolio && (
                <a href={props.portfolio} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                  🌐 Portfolio
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile;

