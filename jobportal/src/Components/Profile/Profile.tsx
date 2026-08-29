import { Avatar, FileInput, Overlay, Divider } from '@mantine/core'
import {
    IconEdit, IconMail, IconPhone, IconMapPin, IconBriefcase,
    IconBuilding, IconClock, IconSchool, IconCoin,
    IconBrandLinkedin, IconBrandGithub, IconWorld,
    IconFileText, IconCertificate, IconCheck, IconX, IconLoader2,
    IconUpload, IconTrash, IconExternalLink, IconPlus, IconCode, IconDownload
} from '@tabler/icons-react'
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHover } from '@mantine/hooks'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { setUser } from '../../Slices/Userslice.tsx'
import { notifications } from '@mantine/notifications'
import useGetAppliedJobs from '../../hooks/useGetAppliedJob.tsx'

const Profile = () => {

    useGetAppliedJobs();
    const { user } = useSelector((store: any) => store.auth);
    const dispatch = useDispatch();
    const { hovered, ref } = useHover();

    // ── Section editing states ──
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // ── Header form (Job Title, Company, Location, Experience, Phone, Expected CTC) ──
    const [headerForm, setHeaderForm] = useState({
        jobTitle: '', currentCompany: '', location: '', experience: '', phoneNumber: '', expectedCtc: ''
    });

    // ── About ──
    const [aboutValue, setAboutValue] = useState('');

    // ── Skills ──
    const [skillsList, setSkillsList] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');

    // ── Social links ──
    const [socialForm, setSocialForm] = useState({ linkedIn: '', github: '', portfolio: '' });

    // ── Experience ──
    const [expEditMode, setExpEditMode] = useState(false);
    const [showAddExp, setShowAddExp] = useState(false);
    const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
    const emptyExpForm = { jobTitle: '', company: '', location: '', summary: '', startDate: '', endDate: '', currentlyWorking: false };
    const [expForm, setExpForm] = useState(emptyExpForm);

    // ── Education ──
    const [eduEditMode, setEduEditMode] = useState(false);
    const [showAddEdu, setShowAddEdu] = useState(false);
    const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
    const emptyEduForm = { school: '', degree: '', startDate: '', endDate: '', description: '' };
    const [eduForm, setEduForm] = useState(emptyEduForm);

     // ── Projects ──
    const [projEditMode, setProjEditMode] = useState(false);
    const [showAddProj, setShowAddProj] = useState(false);
    const [editingProjIndex, setEditingProjIndex] = useState<number | null>(null);
    const emptyProjForm = { title: '', technologies: '', link: '', description: '' };
    const [projForm, setProjForm] = useState(emptyProjForm);


    // ── File refs ──
    const resumeInputRef = useRef<HTMLInputElement>(null);
    const certInputRef = useRef<HTMLInputElement>(null);


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   HEADER SECTION HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startHeaderEdit = () => {
        setHeaderForm({
            jobTitle: user?.profile?.jobTitle || '',
            currentCompany: user?.profile?.currentCompany || '',
            location: user?.profile?.location || '',
            experience: user?.profile?.experience || '',
            phoneNumber: user?.profile?.phoneNumber || '',
            expectedCtc: user?.profile?.expectedCtc || '',
        });
        setEditingSection('header');
    };

    const saveHeader = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('jobTitle', headerForm.jobTitle);
            formData.append('currentCompany', headerForm.currentCompany);
            formData.append('location', headerForm.location);
            formData.append('experience', headerForm.experience);
            formData.append('phoneNumber', headerForm.phoneNumber);
            formData.append('expectedCtc', headerForm.expectedCtc);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess('Profile info updated');
            }
        } catch (e: any) { showError(e); }
        finally { setSaving(false); setEditingSection(null); }
    };


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   ABOUT SECTION HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startAboutEdit = () => {
        setAboutValue(user?.profile?.bio || '');
        setEditingSection('about');
    };

    const saveAbout = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('bio', aboutValue);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Bio updated'); }
        } catch (e: any) { showError(e); }
        finally { setSaving(false); setEditingSection(null); }
    };


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   SKILLS SECTION HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startSkillsEdit = () => {
        setSkillsList([...(user?.profile?.skills || [])]);
        setNewSkill('');
        setEditingSection('skills');
    };

    const removeSkill = (index: number) => {
        setSkillsList(prev => prev.filter((_, i) => i !== index));
    };

    const addSkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !skillsList.includes(trimmed)) {
            setSkillsList(prev => [...prev, trimmed]);
            setNewSkill('');
        }
    };

    const saveSkills = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('skills', skillsList.join(','));
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Skills updated'); }
        } catch (e: any) { showError(e); }
        finally { setSaving(false); setEditingSection(null); }
    };


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   SOCIAL LINKS HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startSocialEdit = () => {
        setSocialForm({
            linkedIn: user?.profile?.linkedIn || '',
            github: user?.profile?.github || '',
            portfolio: user?.profile?.portfolio || '',
        });
        setEditingSection('social');
    };

    const saveSocial = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('linkedIn', socialForm.linkedIn);
            formData.append('github', socialForm.github);
            formData.append('portfolio', socialForm.portfolio);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Social links updated'); }
        } catch (e: any) { showError(e); }
        finally { setSaving(false); setEditingSection(null); }
    };


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   EXPERIENCE CRUD HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startAddExp = () => {
        setExpForm(emptyExpForm);
        setEditingExpIndex(null);
        setShowAddExp(true);
    };

    const startEditExp = (index: number) => {
        const exp = user?.profile?.experiences?.[index];
        if (!exp) return;
        setExpForm({
            jobTitle: exp.jobTitle || '', company: exp.company || '', location: exp.location || '',
            summary: exp.summary || '', startDate: exp.startDate || '', endDate: exp.endDate || '',
            currentlyWorking: exp.currentlyWorking || false
        });
        setEditingExpIndex(index);
        setShowAddExp(true);
    };

    const saveExperience = async () => {
        if (!expForm.jobTitle || !expForm.company) {
            notifications.show({ message: 'Job Title and Company are required.', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        setSaving(true);
        try {
            let res;
            if (editingExpIndex !== null) {
                res = await axios.put(`${USER_API_END_POINT}/profile/experience/${editingExpIndex}`, expForm, { withCredentials: true });
            } else {
                res = await axios.post(`${USER_API_END_POINT}/profile/experience`, expForm, { withCredentials: true });
            }
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess(editingExpIndex !== null ? 'Experience updated' : 'Experience added');
            }
        } catch (e: any) { showError(e); }
        finally {
            setSaving(false); setShowAddExp(false); setEditingExpIndex(null); setExpForm(emptyExpForm);
        }
    };

    const deleteExperience = async (index: number) => {
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/profile/experience/${index}`, { withCredentials: true });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Experience deleted'); }
        } catch (e: any) { showError(e); }
    };

    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   EDUCATION CRUD HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startAddEdu = () => {
        setEduForm(emptyEduForm);
        setEditingEduIndex(null);
        setShowAddEdu(true);
    };

    const startEditEdu = (index: number) => {
        const edu = user?.profile?.educations?.[index];
        if (!edu) return;
        setEduForm({
            school: edu.school || '', degree: edu.degree || '',
            startDate: edu.startDate || '', endDate: edu.endDate || '',
            description: edu.description || ''
        });
        setEditingEduIndex(index);
        setShowAddEdu(true);
    };

    const saveEducation = async () => {
        if (!eduForm.school || !eduForm.degree) {
            notifications.show({ message: 'School and Degree are required.', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        setSaving(true);
        try {
            let res;
            if (editingEduIndex !== null) {
                res = await axios.put(`${USER_API_END_POINT}/profile/education/${editingEduIndex}`, eduForm, { withCredentials: true });
            } else {
                res = await axios.post(`${USER_API_END_POINT}/profile/education`, eduForm, { withCredentials: true });
            }
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess(editingEduIndex !== null ? 'Education updated' : 'Education added');
            }
        } catch (e: any) { showError(e); }
        finally {
            setSaving(false); setShowAddEdu(false); setEditingEduIndex(null); setEduForm(emptyEduForm);
        }
    };

    const deleteEducation = async (index: number) => {
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/profile/education/${index}`, { withCredentials: true });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Education deleted'); }
        } catch (e: any) { showError(e); }
    };

    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   PROJECT CRUD HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startAddProj = () => {
        setProjForm(emptyProjForm);
        setEditingProjIndex(null);
        setShowAddProj(true);
    };

    const startEditProj = (index: number) => {
        const proj = user?.profile?.projects?.[index];
        if (!proj) return;
        setProjForm({
            title: proj.title || '', technologies: proj.technologies || '',
            link: proj.link || '', description: proj.description || ''
        });
        setEditingProjIndex(index);
        setShowAddProj(true);
    };

    const saveProject = async () => {
        if (!projForm.title) {
            notifications.show({ message: 'Project title is required.', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        setSaving(true);
        try {
            let res;
            if (editingProjIndex !== null) {
                res = await axios.put(`${USER_API_END_POINT}/profile/project/${editingProjIndex}`, projForm, { withCredentials: true });
            } else {
                res = await axios.post(`${USER_API_END_POINT}/profile/project`, projForm, { withCredentials: true });
            }
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess(editingProjIndex !== null ? 'Project updated' : 'Project added');
            }
        } catch (e: any) { showError(e); }
        finally {
            setSaving(false); setShowAddProj(false); setEditingProjIndex(null); setProjForm(emptyProjForm);
        }
    };

    const deleteProject = async (index: number) => {
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/profile/project/${index}`, { withCredentials: true });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Project deleted'); }
        } catch (e: any) { showError(e); }
    };


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   FILE UPLOAD HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const photoChangeHandler = async (file: File | null) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("profilePhoto", file);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Photo updated'); }
        } catch (e: any) { showError(e); }
    };

    const resumeUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("resume", file);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Resume uploaded'); }
        } catch (e: any) { showError(e); }
    };

    const certUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append("certificates", files[i]);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Certificate uploaded'); }
        } catch (e: any) { showError(e); }
    };

    const deleteCertHandler = async (index: number) => {
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/profile/certificate/${index}`, { withCredentials: true });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Certificate deleted'); }
        } catch (e: any) { showError(e); }
    };


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   NOTIFICATION HELPERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const showSuccess = (message: string) => notifications.show({ message, withBorder: true, className: '!border-blue-500' });
    const showError = (e: any) => notifications.show({ message: e?.response?.data?.message || 'Something went wrong', color: 'red', withBorder: true, className: '!border-red-500' });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   DOWNLOAD RESUME PDF
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const [downloading, setDownloading] = useState(false);

    const downloadResumePDF = async () => {
        setDownloading(true);
        try {
            const p = user?.profile;

            // ── Build contact line ──
            const contactParts: string[] = [];
            if (user?.email) contactParts.push(user.email);
            if (p?.phoneNumber) contactParts.push(`+91 ${p.phoneNumber}`);
            if (p?.location) contactParts.push(p.location);

            // ── Divider (div-based for reliable html2pdf rendering) ──
            const divider = '<div style="border-bottom:1.5px solid #000;margin:0 0 0 0;"></div>';

            // ── Section builder ──
            const section = (title: string, content: string) => `
                <div style="margin-bottom:10px;">
                    ${divider}
                    <div style="font-size:13px;font-weight:700;color:#000;text-transform:uppercase;letter-spacing:1.5px;margin:10px 0 8px 0;">${title}</div>
                    ${content}
                </div>
            `;

            let html = `
            <div id="resume-pdf" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:35px 45px;max-width:800px;line-height:1.55;">
                <div style="text-align:center;margin-bottom:4px;">
                    <div style="font-size:24px;font-weight:700;color:#000;margin:0 0 5px 0;">${user?.name || ''}</div>
                    <div style="font-size:11px;color:#333;margin:0 0 8px 0;">${contactParts.join(' &nbsp; | &nbsp; ')}</div>
                </div>
                ${divider}
            `;

            // ── Career Objective ──
            if (p?.bio) {
                html += section('Career Objective', '<div style="font-size:11.5px;color:#000;">' + p.bio + '</div>');
            }

            // ── Work Experience ──
            if (p?.experiences?.length > 0) {
                let c = '';
                for (const exp of p.experiences) {
                    const s = exp.startDate || '';
                    const e = exp.currentlyWorking ? 'Present' : (exp.endDate || '');
                    const dr = (s || e) ? s + ' - ' + e : '';
                    c += '<div style="margin-bottom:8px;">';
                    c += '<div style="display:flex;justify-content:space-between;">';
                    c += '<div style="font-size:11.5px;color:#000;">' + (exp.jobTitle || '') + (exp.company ? ' \u2022 ' + exp.company : '') + '</div>';
                    c += '<div style="font-size:11px;color:#333;white-space:nowrap;">' + dr + '</div>';
                    c += '</div>';
                    if (exp.location) c += '<div style="font-size:11px;color:#333;">' + exp.location + '</div>';
                    if (exp.summary) c += '<div style="font-size:11px;color:#333;margin-top:2px;">' + exp.summary + '</div>';
                    c += '</div>';
                }
                html += section('Work Experience', c);
            }

            // ── Education ──
            if (p?.educations?.length > 0) {
                let c = '';
                for (const edu of p.educations) {
                    const s = edu.startDate || '';
                    const e = edu.endDate || '';
                    const dr = (s || e) ? s + ' - ' + e : '';
                    c += '<div style="margin-bottom:8px;">';
                    c += '<div style="display:flex;justify-content:space-between;">';
                    c += '<div style="font-size:11.5px;color:#000;">' + (edu.degree || '') + '</div>';
                    c += '<div style="font-size:11px;color:#333;white-space:nowrap;">' + dr + '</div>';
                    c += '</div>';
                    if (edu.school) c += '<div style="font-size:11px;color:#333;">' + edu.school + '</div>';
                    if (edu.description) c += '<div style="font-size:11px;color:#333;margin-top:2px;">' + edu.description + '</div>';
                    c += '</div>';
                }
                html += section('Education', c);
            }

            // ── Skills ──
            if (p?.skills?.length > 0) {
                html += section('Skills', '<div style="font-size:11.5px;color:#000;">' + p.skills.join(', ') + '</div>');
            }

            // ── Projects ──
            if (p?.projects?.length > 0) {
                let c = '';
                for (const proj of p.projects) {
                    c += '<div style="margin-bottom:8px;">';
                    c += '<div style="font-size:11.5px;color:#000;"><strong>Title: ' + (proj.title || '') + '</strong>' + (proj.link ? ' &nbsp;|&nbsp; <strong>Github:</strong> ' + proj.link : '') + '</div>';
                    if (proj.description) c += '<div style="font-size:11px;color:#333;margin-top:2px;">' + proj.description + '</div>';
                    if (proj.technologies) c += '<div style="font-size:11px;color:#333;margin-top:2px;font-style:italic;">Technologies: ' + proj.technologies + '</div>';
                    c += '</div>';
                }
                html += section('Project', c);
            }

            // ── Certifications ──
            if (p?.certificates?.length > 0) {
                let c = '';
                for (const cert of p.certificates) {
                    c += '<div style="font-size:11px;color:#333;margin-bottom:3px;">\u2022 ' + (cert.originalName || 'Certificate') + '</div>';
                }
                html += section('Certifications', c);
            }

            // ── Social Links ──
            const socialParts: string[] = [];
            if (p?.linkedIn) socialParts.push('LinkedIn: ' + p.linkedIn);
            if (p?.github) socialParts.push('GitHub: ' + p.github);
            if (p?.portfolio) socialParts.push('Portfolio: ' + p.portfolio);
            if (socialParts.length > 0) {
                html += section('Links', '<div style="font-size:11px;color:#333;">' + socialParts.join(' &nbsp;|&nbsp; ') + '</div>');
            }

            html += '</div>';

            // ── Create temp element & generate PDF ──
            const container = document.createElement('div');
            container.innerHTML = html;
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const resumeElement = container.querySelector('#resume-pdf') as HTMLElement;

            const opt: any = {
                margin: 8,
                filename: ((user?.name || 'Resume').replace(/\\s+/g, '_')) + '_Resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;
            await html2pdf().set(opt).from(resumeElement).save();
            document.body.removeChild(container);
            showSuccess('Resume PDF downloaded!');
        } catch (err) {
            console.error(err);
            notifications.show({ message: 'Failed to generate PDF. Make sure html2pdf.js is installed.', color: 'red', withBorder: true, className: '!border-red-500' });
        } finally {
            setDownloading(false);
        }
    };

    // ── Styled input class ──
    const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400";


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   RENDER
    // ━━━━━━━━━━━━━━━━━═════════════════════════════════════════
    return (
        <div className="w-3/4 lg-mx:w-full mx-auto pb-2">

            {/* ═══════════════════════════════════════════════
                BANNER + AVATAR
            ═══════════════════════════════════════════════ */}
            <div className="relative px-3">
                <img className="rounded-t-2xl xs-mx:h-32 w-full object-cover h-48" src="/Profile/banner.jpg" alt="" />
                <div ref={ref} className="!rounded-full -bottom-1/3 md-mx:-bottom-10 sm-mx:-bottom-14 absolute left-6 flex items-center justify-center">
                    <Avatar className="!w-48 !h-48 md-mx:!w-40 md-mx:!h-40 border-white border-[6px] rounded-full sm-mx:!w-36 sm-mx:!h-36 xs-mx:!w-32 xs-mx:!h-32 shadow-lg" src={user?.profile?.profilePhoto || '/avatar.png'} alt="" />
                    {hovered && <Overlay className="!rounded-full" color="#000" backgroundOpacity={0.50} />}
                    {hovered && <IconEdit className="absolute z-[300] !w-16 !h-16 text-white" />}
                    {hovered && <FileInput id="file" name="file" accept="image/*" onChange={photoChangeHandler} className="absolute z-[301] w-full [&_*]:!rounded-full [&_*]:!h-full" variant="transparent" />}
                </div>
            </div>


            {/* ═══════════════════════════════════════════════
                HEADER: NAME + INFO / EDIT FORM
            ═══════════════════════════════════════════════ */}
            <div className="px-6 lg:mt-20 lg-mx:mt-16">
                <div className="flex items-start justify-between">
                    <h1 className="text-3xl xs-mx:text-xl font-bold text-gray-950">{user?.name}</h1>

                    {editingSection === 'header' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveHeader} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                {saving ? <IconLoader2 size={20} className="animate-spin" /> : <IconCheck size={20} />}
                            </button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <IconX size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button onClick={startHeaderEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                                <IconEdit size={20} stroke={1.5} />
                            </button>
                        </div>
                    )}
                </div>

                {editingSection === 'header' ? (
                    /* ── Header Edit Form (2-column grid) ── */
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Job Title <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <IconBriefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={headerForm.jobTitle} onChange={(e) => setHeaderForm({ ...headerForm, jobTitle: e.target.value })} placeholder="Enter Job Title" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Company <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <IconBuilding size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={headerForm.currentCompany} onChange={(e) => setHeaderForm({ ...headerForm, currentCompany: e.target.value })} placeholder="Enter Company Name" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Location <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <IconMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={headerForm.location} onChange={(e) => setHeaderForm({ ...headerForm, location: e.target.value })} placeholder="Enter Job Location" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Experience <span className="text-red-500">*</span></label>
                            <input value={headerForm.experience} onChange={(e) => setHeaderForm({ ...headerForm, experience: e.target.value })} placeholder="e.g. 3 Years" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                            <div className="relative">
                                <IconPhone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={headerForm.phoneNumber} onChange={(e) => setHeaderForm({ ...headerForm, phoneNumber: e.target.value })} placeholder="e.g. 9004583988" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Expected CTC</label>
                            <div className="relative">
                                <IconCoin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={headerForm.expectedCtc} onChange={(e) => setHeaderForm({ ...headerForm, expectedCtc: e.target.value })} placeholder="e.g. ₹48 - 60LPA" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Header Display ── */
                    <div className="mt-2 space-y-1">
                        {(user?.profile?.jobTitle || user?.profile?.currentCompany) && (
                            <div className="flex items-center gap-1.5">
                                <IconBriefcase size={16} className="shrink-0" stroke={1.5} />
                                <span>{user?.profile?.jobTitle}{user?.profile?.currentCompany && ` • ${user.profile.currentCompany}`}</span>
                            </div>
                        )}
                        {user?.profile?.location && (
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <IconMapPin size={16} className="text-gray-500 shrink-0" stroke={1.5} />
                                <span>{user.profile.location}</span>
                            </div>
                        )}
                        {user?.profile?.experience && (
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <IconClock size={16} className="text-gray-500 shrink-0" stroke={1.5} />
                                <span>Experience: {user.profile.experience}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <IconMail size={16} className="text-gray-500 shrink-0" stroke={1.5} />
                            <span>{user?.email}</span>
                        </div>
                        {user?.profile?.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <IconPhone size={16} className="text-gray-500 shrink-0" stroke={1.5} />
                                <span>{user.profile.phoneNumber}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Divider mx="md" my="xl" />


            {/* ═══════════════════════════════════════════════
                ABOUT
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-950">About</h2>
                    {editingSection === 'about' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveAbout} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><IconCheck size={20} /></button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconX size={20} /></button>
                        </div>
                    ) : (
                        <button onClick={startAboutEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconEdit size={18} stroke={1.5} /></button>
                    )}
                </div>
                {editingSection === 'about' ? (
                    <textarea value={aboutValue} onChange={(e) => setAboutValue(e.target.value)} rows={4} placeholder="Write a short bio about yourself..."
                        className={`${inputClass} resize-none border-blue-300`} autoFocus />
                ) : (
                    <p className="text-sm text-gray-600 text-justify leading-relaxed">
                        {user?.profile?.bio || <span className="text-gray-400 italic">No bio added yet. Click the edit icon to add one.</span>}
                    </p>
                )}
            </div>

            <Divider mx="md" my="xl" />


            {/* ═══════════════════════════════════════════════
                SKILLS
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-950">Skills</h2>
                    {editingSection === 'skills' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveSkills} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><IconCheck size={20} /></button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconX size={20} /></button>
                        </div>
                    ) : (
                        <button onClick={startSkillsEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconEdit size={18} stroke={1.5} /></button>
                    )}
                </div>
                {editingSection === 'skills' ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {skillsList.map((skill, i) => (
                            <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                                {skill}
                                <button onClick={() => removeSkill(i)} className="ml-1 text-gray-500 hover:text-red-500"><IconX size={14} /></button>
                            </span>
                        ))}
                        <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill"
                            className="px-3 py-1.5 text-sm border-none outline-none bg-transparent text-gray-700 placeholder-gray-400 min-w-[100px]"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {user?.profile?.skills?.length > 0 ? (
                            user.profile.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-400 text-sm font-medium rounded-full">{skill}</span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">No skills added yet</span>
                        )}
                    </div>
                )}
            </div>

            <Divider mx="md" my="xl" />


            {/* ═══════════════════════════════════════════════
                EXPERIENCE (Work History)
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-950">Experience</h2>
                    <div className="flex items-center gap-1">
                        <button onClick={startAddExp} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconPlus size={20} stroke={2} /></button>
                        {expEditMode ? (
                            <button onClick={() => setExpEditMode(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconX size={20} /></button>
                        ) : (
                            <button onClick={() => setExpEditMode(true)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconEdit size={18} stroke={1.5} /></button>
                        )}
                    </div>
                </div>

                {/* ── Experience Entries ── */}
                {user?.profile?.experiences?.length > 0 ? (
                    <div className="space-y-1">
                        {user.profile.experiences.map((exp: any, i: number) => (
                            <div key={i} className="border-b border-gray-100 last:border-b-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <IconBriefcase size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                                            <p className="text-sm text-gray-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium shrink-0 mt-1">
                                        {exp.startDate || '—'} – {exp.currentlyWorking ? 'Present' : (exp.endDate || '—')}
                                    </span>
                                </div>
                                {exp.summary && <p className="text-sm text-gray-600 mt-2 ml-[52px]">{exp.summary}</p>}
                                {expEditMode && (
                                    <div className="flex items-center gap-3 mt-5 ml-[52px]">
                                        <button onClick={() => startEditExp(i)} className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">Edit</button>
                                        <button onClick={() => deleteExperience(i)} className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : !showAddExp && (
                    <p className="text-sm text-gray-400 italic">No experience added yet. Click + to add your work history.</p>
                )}

                {/* ── Add / Edit Experience Form ── */}
                {showAddExp && (
                    <div className="mt-6 pt-5 border-t border-gray-200">
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                            {editingExpIndex !== null ? 'Edit Experience' : 'Add Experience'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Job Title <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <IconBriefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input value={expForm.jobTitle} onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })} placeholder="Enter Job Title" className={`${inputClass} !pl-9`} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Company <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <IconBuilding size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} placeholder="Enter Company Name" className={`${inputClass} !pl-9`} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Location</label>
                            <div className="relative">
                                <IconMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={expForm.location} onChange={(e) => setExpForm({ ...expForm, location: e.target.value })} placeholder="Enter Job Location" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Summary</label>
                            <textarea value={expForm.summary} onChange={(e) => setExpForm({ ...expForm, summary: e.target.value })} rows={3} placeholder="Enter Summary" className={`${inputClass} resize-none`} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Start Date <span className="text-red-500">*</span></label>
                                <input type="month" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">End Date <span className="text-red-500">*</span></label>
                                <input type="month" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} className={inputClass} disabled={expForm.currentlyWorking} />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 mt-3 cursor-pointer">
                            <input type="checkbox" checked={expForm.currentlyWorking} onChange={(e) => setExpForm({ ...expForm, currentlyWorking: e.target.checked, endDate: '' })}
                                className="w-4 h-4 rounded border-gray-300 text-blue-400 focus:ring-blue-400" />
                            <span className="text-sm text-gray-600">Currently working here</span>
                        </label>
                        <div className="flex items-center gap-3 mt-5">
                            <button onClick={saveExperience} disabled={saving} 
                                className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => { setShowAddExp(false); setEditingExpIndex(null); setExpForm(emptyExpForm); }} 
                                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Divider mx="md" my="xl" />

            {/* ═══════════════════════════════════════════════
                EDUCATION
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-950">Education</h2>
                    <div className="flex items-center gap-1">
                        <button onClick={startAddEdu} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconPlus size={20} stroke={2} /></button>
                        {eduEditMode ? (
                            <button onClick={() => setEduEditMode(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconX size={20} /></button>
                        ) : (
                            <button onClick={() => setEduEditMode(true)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconEdit size={18} stroke={1.5} /></button>
                        )}
                    </div>
                </div>

                {/* ── Education Entries ── */}
                {user?.profile?.educations?.length > 0 ? (
                    <div className="space-y-1">
                        {user.profile.educations.map((edu: any, i: number) => (
                            <div key={i} className="pb-5 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <IconSchool size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                                            <p className="text-sm text-gray-600">{edu.school}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium shrink-0 mt-1">
                                        {edu.startDate || '—'} – {edu.endDate || '—'}
                                    </span>
                                </div>
                                {edu.description && <p className="text-sm text-gray-600 mt-2 ml-[52px]">{edu.description}</p>}
                                {eduEditMode && (
                                    <div className="flex items-center gap-2 mt-5 ml-[52px]">
                                        <button onClick={() => startEditEdu(i)} className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">Edit</button>
                                        <button onClick={() => deleteEducation(i)} className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : !showAddEdu && (
                    <p className="text-sm text-gray-400 italic">No education added yet. Click + to add your education.</p>
                )}

                {/* ── Add / Edit Education Form ── */}
                {showAddEdu && (
                    <div className="mt-6 pt-5 border-t border-gray-200">
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                            {editingEduIndex !== null ? 'Edit Education' : 'Add Education'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">College / School Name <span className="text-red-500">*</span></label>
                                <input value={eduForm.school} onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })} placeholder="e.g. MIT" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Degree / Certificate <span className="text-red-500">*</span></label>
                                <input value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} placeholder="e.g. B.Tech in Computer Science" className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Start Date</label>
                                <input type="month" value={eduForm.startDate} onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">End Date</label>
                                <input type="month" value={eduForm.endDate} onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })} placeholder="MM/YYYY or Present" className={inputClass} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description (Optional)</label>
                            <textarea value={eduForm.description} onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })} rows={3} placeholder="GPA, honors, relevant coursework, etc." className={`${inputClass} resize-none`} />
                        </div>
                        <div className="flex items-center gap-3 mt-5">
                            <button onClick={saveEducation} disabled={saving}
                                className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => { setShowAddEdu(false); setEditingEduIndex(null); setEduForm(emptyEduForm); }}
                                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Divider mx="md" my="xl" />

             {/* ═══════════════════════════════════════════════
                PROJECTS
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-950">Projects</h2>
                    <div className="flex items-center gap-1">
                        <button onClick={startAddProj} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconPlus size={20} stroke={2} /></button>
                        {projEditMode ? (
                            <button onClick={() => setProjEditMode(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconX size={20} /></button>
                        ) : (
                            <button onClick={() => setProjEditMode(true)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconEdit size={18} stroke={1.5} /></button>
                        )}
                    </div>
                </div>

                {/* ── Project Entries ── */}
                {user?.profile?.projects?.length > 0 ? (
                    <div className="space-y-1">
                        {user.profile.projects.map((proj: any, i: number) => (
                            <div key={i} className="pb-5 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <IconCode size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                                            {proj.technologies && <p className="text-sm text-gray-600">{proj.technologies}</p>}
                                        </div>
                                    </div>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noopener noreferrer"
                                            className="text-sm text-blue-500 hover:underline font-medium flex items-center gap-1 shrink-0 mt-1">
                                            View Project <IconExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                                {proj.description && <p className="text-sm text-gray-600 mt-2 ml-[52px]">{proj.description}</p>}
                                {projEditMode && (
                                    <div className="flex items-center gap-2 mt-3 ml-[52px]">
                                        <button onClick={() => startEditProj(i)} className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">Edit</button>
                                        <button onClick={() => deleteProject(i)} className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : !showAddProj && (
                    <p className="text-sm text-gray-400 italic">No projects added yet. Click + to add your projects.</p>
                )}

                {/* ── Add / Edit Project Form ── */}
                {showAddProj && (
                    <div className="mt-6 pt-5 border-t border-gray-200">
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                            {editingProjIndex !== null ? 'Edit Project' : 'Add Project'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Project Title <span className="text-red-500">*</span></label>
                                <input value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} placeholder="e.g. E-Commerce Platform" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Technologies Used</label>
                                <input value={projForm.technologies} onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })} placeholder="e.g. React, Node.js, MongoDB" className={inputClass} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Project Link (Optional)</label>
                            <input value={projForm.link} onChange={(e) => setProjForm({ ...projForm, link: e.target.value })} placeholder="https://github.com/yourproject" className={inputClass} />
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                            <textarea value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} rows={3} placeholder="Describe what the project does, key features, your role..." className={`${inputClass} resize-none`} />
                        </div>
                        <div className="flex items-center gap-3 mt-5">
                            <button onClick={saveProject} disabled={saving}
                                className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => { setShowAddProj(false); setEditingProjIndex(null); setProjForm(emptyProjForm); }}
                                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Divider mx="md" my="xl" />

            {/* ═══════════════════════════════════════════════
                DOCUMENTS (Resume + Certificates)
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <h2 className="text-xl font-bold text-gray-950 mb-4">Documents</h2>

                {/* Resume */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <IconFileText size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Resume</div>
                            {user?.profile?.resume ? (
                                <a href={user.profile.resume} target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:underline font-medium flex items-center gap-1">
                                    {user.profile.resumeOriginalName || 'View Resume'} <IconExternalLink size={14} />
                                </a>
                            ) : (
                                <span className="text-sm text-gray-400 italic">No resume uploaded</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <input ref={resumeInputRef} type="file" accept="application/pdf" onChange={resumeUploadHandler} className="hidden" />
                        <button onClick={() => resumeInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                            <IconUpload size={14} /> {user?.profile?.resume ? 'Replace' : 'Upload'}
                        </button>
                    </div>
                </div>

                <Divider my="sm" />

                {/* Certificates */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <IconCertificate size={20} className="text-blue-400" />
                            </div>
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Certificates</div>
                        </div>
                        <div>
                            <input ref={certInputRef} type="file" accept="application/pdf,image/*" multiple onChange={certUploadHandler} className="hidden" />
                            <button onClick={() => certInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                                <IconUpload size={14} /> Add
                            </button>
                        </div>
                    </div>
                    {user?.profile?.certificates?.length > 0 ? (
                        <div className="space-y-2 ml-[52px]">
                            {user.profile.certificates.map((cert: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 group">
                                    <a href={cert.url} target="_blank" rel="noopener noreferrer"
                                        className="text-sm text-blue-400 hover:underline font-medium flex items-center gap-1">
                                        <IconCertificate size={14} /> {cert.originalName || `Certificate ${i + 1}`} <IconExternalLink size={12} />
                                    </a>
                                    <button onClick={() => deleteCertHandler(i)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                                        <IconTrash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="ml-[52px] text-sm text-gray-400 italic">No certificates uploaded</p>
                    )}
                </div>
            </div>

            <Divider mx="md" my="xl" />


            {/* ═══════════════════════════════════════════════
                SOCIAL LINKS
            ═══════════════════════════════════════════════ */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-950">Social Links</h2>
                    {editingSection === 'social' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveSocial} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><IconCheck size={20} /></button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconX size={20} /></button>
                        </div>
                    ) : (
                        <button onClick={startSocialEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><IconEdit size={18} stroke={1.5} /></button>
                    )}
                </div>
                {editingSection === 'social' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">LinkedIn</label>
                            <div className="relative">
                                <IconBrandLinkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={socialForm.linkedIn} onChange={(e) => setSocialForm({ ...socialForm, linkedIn: e.target.value })} placeholder="https://linkedin.com/in/yourname" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">GitHub</label>
                            <div className="relative">
                                <IconBrandGithub size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={socialForm.github} onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })} placeholder="https://github.com/yourname" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Portfolio</label>
                            <div className="relative">
                                <IconWorld size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={socialForm.portfolio} onChange={(e) => setSocialForm({ ...socialForm, portfolio: e.target.value })} placeholder="https://yourportfolio.com" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {[
                            { icon: IconBrandLinkedin, label: 'LinkedIn', value: user?.profile?.linkedIn },
                            { icon: IconBrandGithub, label: 'GitHub', value: user?.profile?.github },
                            { icon: IconWorld, label: 'Portfolio', value: user?.profile?.portfolio },
                        ].map(({ icon: Icon, label, value }, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Icon size={18} className="text-gray-500 shrink-0" stroke={1.5} />
                                {value ? (
                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline font-medium">{value}</a>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">{label} not added</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
                        <div className="flex justify-center mt-6">
                            <button onClick={downloadResumePDF} disabled={downloading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-400 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-sm" title="Download as Resume PDF">
                                {downloading ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
                                {downloading ? 'Generating...' : 'Save as PDF'}
                            </button>
                        </div>
        </div>
    );
};

export default Profile;
