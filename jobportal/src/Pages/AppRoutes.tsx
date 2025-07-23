import React from 'react'
import { Route, Routes } from 'react-router-dom' 
import Header from '../Components/Header/header.tsx'
import { Divider } from '@mantine/core'
import FindJobs from './FindJobs.tsx'
import PostJobPage from './PostJobPage.tsx'
import JobDescPage from './JobDescPage.tsx'
import SignupPage from './SignupPage.tsx'
import LoginPage from './LoginPage.tsx'
import ProfilePage from './ProfilePage.tsx'
import HomePage from './HomePage.tsx'
import Footer from '../Components/Footer/Footer.tsx'
import CreatCompanies from '../Components/Employer/CreatCompanies.tsx'
import PostCompanies from '../Components/Employer/PostCompanies.tsx'
import CompanySetup from '../Components/Employer/CompanySetup.tsx'
import JobsTable from '../Components/PostJob/JobsTable.tsx'
import Applicants from '../Components/Employer/Applicants.tsx'
import BrowseJob from '../Components/FindJobs/BrowseJob.tsx'
import JobHistoryPage from './JobHistoryPage.tsx'
import ProtectedRoute from '../utils/ProtectedRoute.tsx'
import FindTalentPage from './FindTalentPage.tsx'
import TalentProfilePage from './TalentProfilePage.tsx'

const AppRoutes = () => {
    return (
        <div className="app-container relative">
            <Header />
            <Divider size="xs" mx="md" />

            <div className="content">
                <Routes>
                    <Route path="/jobs" element={<ProtectedRoute role="student"><FindJobs /></ProtectedRoute>} />
                    <Route path="/browse" element={<ProtectedRoute role="student"><BrowseJob /></ProtectedRoute>} />
                    <Route path="/job-desc/:id" element={<JobDescPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProtectedRoute role="student"><ProfilePage /></ProtectedRoute>} />
                    <Route path="/jobhistory" element={<ProtectedRoute role="student"><JobHistoryPage /></ProtectedRoute>} />

                    {/* Employer Page Routes */}
                    <Route path="/companies" element={<ProtectedRoute role="employer"><CreatCompanies /></ProtectedRoute>} />
                    <Route path="/companies-post" element={<ProtectedRoute role="employer"><PostCompanies /></ProtectedRoute>} />
                    <Route path="/companies-post/:id" element={<ProtectedRoute role="employer"><CompanySetup /></ProtectedRoute>} />
                    <Route path="/find-Talent" element={<ProtectedRoute role="employer"><FindTalentPage /></ProtectedRoute>} />
                    <Route path="/talent-Profile" element={<ProtectedRoute role="employer"><TalentProfilePage /></ProtectedRoute>} />


                    {/* Posted Job Table */}
                    <Route path="/post-job" element={<ProtectedRoute role="employer"><PostJobPage /></ProtectedRoute>} />
                    <Route path="/jobs-Table" element={<ProtectedRoute role="employer"><JobsTable /></ProtectedRoute>} />

                    {/* Applicant Table */}
                    <Route path="/jobs-Table/:id/applicants" element={<ProtectedRoute role="employer"><Applicants /></ProtectedRoute>} />
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </div>

            <Footer />
        </div>
    )
}

export default AppRoutes;