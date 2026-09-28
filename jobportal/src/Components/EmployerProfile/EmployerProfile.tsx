import { Avatar, FileInput, Overlay } from '@mantine/core'
import {
    IconEdit, IconMail, IconPhone, IconMapPin,
    IconBrandLinkedin, IconBrandGithub, IconWorld,
    IconCheck, IconX, IconLoader2,
    IconBuilding, IconUpload, IconPhoto
} from '@tabler/icons-react'
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHover } from '@mantine/hooks'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { setUser } from '../../Slices/Userslice.tsx'
import { notifications } from '@mantine/notifications'

const EmployerProfile = () => {
    const { user } = useSelector((store: any) => store.auth);
    const dispatch = useDispatch();
    const { hovered, ref } = useHover();
    const logoInputRef = useRef<HTMLInputElement>(null);

    // ── Editing states ──
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // ── Personal Info form ──
    const [infoForm, setInfoForm] = useState({
        phoneNumber: '', location: '', currentCompany: ''
    });

    // ── About form ──
    const [aboutValue, setAboutValue] = useState('');

    // ── Social links form ──
    const [socialForm, setSocialForm] = useState({ linkedIn: '', github: '', portfolio: '' });

    // ── Notification helpers ──
    const showSuccess = (message: string) => notifications.show({ message, withBorder: true, className: '!border-blue-500' });
    const showError = (e: any) => notifications.show({ message: e?.response?.data?.message || 'Something went wrong', color: 'red', withBorder: true, className: '!border-red-500' });

    // ── Styled input class ──
    const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400";

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   COMPANY LOGO UPLOAD
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const logoUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Company logo updated'); }
        } catch (e: any) { showError(e); }
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   PERSONAL INFO HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const startInfoEdit = () => {
        setInfoForm({
            phoneNumber: user?.profile?.phoneNumber || '',
            location: user?.profile?.location || '',
            currentCompany: user?.profile?.currentCompany || '',
        });
        setEditingSection('info');
    };

    const saveInfo = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('phoneNumber', infoForm.phoneNumber);
            formData.append('location', infoForm.location);
            formData.append('currentCompany', infoForm.currentCompany);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            });
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('Profile info updated'); }
        } catch (e: any) { showError(e); }
        finally { setSaving(false); setEditingSection(null); }
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   ABOUT HANDLERS
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
            if (res.data.success) { dispatch(setUser(res.data.user)); showSuccess('About updated'); }
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

    const companyLogo = user?.profile?.profilePhoto;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //   RENDER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    return (
        <div className="w-[75%] lg-mx:w-full mx-auto py-8 px-4 space-y-6">

            {/* ═══════════════════════════════════════════════
                PERSONAL INFORMATION CARD
            ═══════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                    {editingSection === 'info' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveInfo} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                {saving ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                            </button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <IconX size={18} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={startInfoEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                            <IconEdit size={18} stroke={1.5} />
                        </button>
                    )}
                </div>

                {/* ── Company Logo Section ── */}
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                    <div ref={ref} className="relative cursor-pointer shrink-0">
                        {companyLogo ? (
                            <img src={companyLogo} alt="Company Logo" className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm" />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <IconBuilding size={28} className="text-gray-400" stroke={1.5} />
                            </div>
                        )}
                        {hovered && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center" onClick={() => logoInputRef.current?.click()}>
                                <IconPhoto size={22} className="text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{companyLogo ? 'Company Logo' : 'Add Company Logo'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Click on the icon to {companyLogo ? 'change' : 'upload'} your logo</p>
                        <input ref={logoInputRef} type="file" accept="image/*" onChange={logoUploadHandler} className="hidden" />
                        <button onClick={() => logoInputRef.current?.click()}
                            className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-blue-50 text-blue-500 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                            <IconUpload size={14} /> {companyLogo ? 'Change Logo' : 'Upload Logo'}
                        </button>
                    </div>
                </div>

                {/* ── Info Fields ── */}
                {editingSection === 'info' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Name</label>
                            <input value={user?.name || ''} disabled className={`${inputClass} !bg-gray-50 !text-gray-400 cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Email</label>
                            <input value={user?.email || ''} disabled className={`${inputClass} !bg-gray-50 !text-gray-400 cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <IconPhone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={infoForm.phoneNumber} onChange={(e) => setInfoForm({ ...infoForm, phoneNumber: e.target.value })} placeholder="e.g. 9876543210" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Location</label>
                            <div className="relative">
                                <IconMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={infoForm.location} onChange={(e) => setInfoForm({ ...infoForm, location: e.target.value })} placeholder="e.g. Mumbai, India" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Company / Organization</label>
                            <div className="relative">
                                <IconBuilding size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={infoForm.currentCompany} onChange={(e) => setInfoForm({ ...infoForm, currentCompany: e.target.value })} placeholder="e.g. Google" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{user?.profile?.phoneNumber || <span className="text-gray-400 italic font-normal">Not added</span>}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                            <p className="text-sm font-medium text-gray-900">{user?.profile?.location || <span className="text-gray-400 italic font-normal">Not added</span>}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Company / Organization</p>
                            <p className="text-sm font-medium text-gray-900">{user?.profile?.currentCompany || <span className="text-gray-400 italic font-normal">Not added</span>}</p>
                        </div>
                    </div>
                )}
            </div>


            {/* ═══════════════════════════════════════════════
                ABOUT CARD
            ═══════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">About</h3>
                    {editingSection === 'about' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveAbout} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                {saving ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                            </button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <IconX size={18} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={startAboutEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                            <IconEdit size={18} stroke={1.5} />
                        </button>
                    )}
                </div>

                {editingSection === 'about' ? (
                    <textarea value={aboutValue} onChange={(e) => setAboutValue(e.target.value)} rows={5}
                        placeholder="Tell applicants about yourself, your hiring philosophy, or your company culture..."
                        className={`${inputClass} resize-none`} autoFocus />
                ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {user?.profile?.bio || <span className="text-gray-400 italic">No bio added yet. Click the edit icon to tell applicants about yourself or your company.</span>}
                    </p>
                )}
            </div>


            {/* ═══════════════════════════════════════════════
                SOCIAL LINKS CARD
            ═══════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
                    {editingSection === 'social' ? (
                        <div className="flex items-center gap-2">
                            <button onClick={saveSocial} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                {saving ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                            </button>
                            <button onClick={() => setEditingSection(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <IconX size={18} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={startSocialEdit} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                            <IconEdit size={18} stroke={1.5} />
                        </button>
                    )}
                </div>

                {editingSection === 'social' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">LinkedIn</label>
                            <div className="relative">
                                <IconBrandLinkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={socialForm.linkedIn} onChange={(e) => setSocialForm({ ...socialForm, linkedIn: e.target.value })} placeholder="https://linkedin.com/in/yourname" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">GitHub</label>
                            <div className="relative">
                                <IconBrandGithub size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={socialForm.github} onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })} placeholder="https://github.com/yourname" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Website / Portfolio</label>
                            <div className="relative">
                                <IconWorld size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={socialForm.portfolio} onChange={(e) => setSocialForm({ ...socialForm, portfolio: e.target.value })} placeholder="https://yourwebsite.com" className={`${inputClass} !pl-9`} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[
                            { icon: IconBrandLinkedin, label: 'LinkedIn', value: user?.profile?.linkedIn, color: 'text-[#0077B5]' },
                            { icon: IconBrandGithub, label: 'GitHub', value: user?.profile?.github, color: 'text-gray-800' },
                            { icon: IconWorld, label: 'Website / Portfolio', value: user?.profile?.portfolio, color: 'text-blue-500' },
                        ].map(({ icon: Icon, label, value, color }, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm ${color}`}>
                                    <Icon size={20} stroke={1.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                                    {value ? (
                                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline font-medium">{value}</a>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Not added</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default EmployerProfile;
