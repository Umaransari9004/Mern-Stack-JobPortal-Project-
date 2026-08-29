import React, { useState, useRef, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Text, Group, Box, Divider, Paper, ActionIcon, Loader } from '@mantine/core';
import { IconPaperclip, IconFile, IconX, IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { APPLICATION_API_END_POINT } from '../../utils/constant.js';

interface ApplyJobModalProps {
    opened: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    companyName: string;
    companyLogo: string;
    daysAgo: string;
    applicantCount: number;
    onApplySuccess: () => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
    opened,
    onClose,
    jobId,
    jobTitle,
    companyName,
    companyLogo,
    daysAgo,
    applicantCount,
    onApplySuccess,
}) => {
    const { user } = useSelector((store: any) => store.auth);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        personalWebsite: '',
        coverLetter: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [existingResume, setExistingResume] = useState({ url: '', name: '' });

    // Auto-fill from profile when modal opens
    useEffect(() => {
        if (opened && user) {
            setFormData({
                fullName: user.name || '',
                email: user.email || '',
                phone: user.profile?.phoneNumber || '',
                personalWebsite: user.profile?.portfolio || '',
                coverLetter: '',
            });
            // Pre-fill resume from profile
            if (user.profile?.resume) {
                setExistingResume({
                    url: user.profile.resume,
                    name: user.profile.resumeOriginalName || 'Resume',
                });
            }
            setResumeFile(null);
            setIsPreview(false);
        }
    }, [opened, user]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            setExistingResume({ url: '', name: '' }); // clear existing
        }
    };

    const removeFile = () => {
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getResumeDisplayName = () => {
        if (resumeFile) return resumeFile.name;
        if (existingResume.name) return existingResume.name;
        return '';
    };

    const hasResume = !!(resumeFile || existingResume.url);

    const handlePreview = () => {
        // Validate required fields
        if (!formData.fullName.trim()) {
            notifications.show({ message: 'Full Name is required', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        if (!formData.email.trim()) {
            notifications.show({ message: 'Email is required', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        if (!formData.phone.trim()) {
            notifications.show({ message: 'Phone Number is required', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        if (!hasResume) {
            notifications.show({ message: 'Resume/CV is required', color: 'red', withBorder: true, className: '!border-red-500' });
            return;
        }
        setIsPreview(true);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('personalWebsite', formData.personalWebsite);
            data.append('coverLetter', formData.coverLetter);

            if (resumeFile) {
                data.append('resume', resumeFile);
            } else if (existingResume.url) {
                data.append('existingResumeUrl', existingResume.url);
                data.append('existingResumeName', existingResume.name);
            }

            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                notifications.show({
                    message: res.data.message,
                    withBorder: true,
                    className: '!border-blue-500',
                });
                onApplySuccess();
                onClose();
            }
        } catch (error: any) {
            notifications.show({
                message: error?.response?.data?.message || 'Something went wrong',
                color: 'red',
                withBorder: true,
                className: '!border-red-500',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="xl"
            radius="lg"
            centered
            title={null}
            withCloseButton={false}
            padding={0}
            styles={{
                body: { padding: 0 },
                content: { borderRadius: 16, overflow: 'hidden', minHeight: '90vh' },
            }}
        >
            {/* Job Header */}
            <Box px="xl" pt="lg" pb="md" style={{ borderBottom: '1px solid #e9ecef' }}>
                <Group justify="space-between" align="flex-start">
                    <Group>
                        {companyLogo ? (
                            <img
                                src={companyLogo}
                                alt={companyName}
                                style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1px solid #e9ecef' }}
                            />
                        ) : (
                            <Box
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: '#e9ecef',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: '#868e96',
                                }}
                            >
                                {companyName?.charAt(0) || 'C'}
                            </Box>
                        )}
                        <div>
                            <Text fw={700} size="lg">{jobTitle}</Text>
                            <Text size="sm" c="dimmed">
                                {companyName} &bull; {daysAgo} &bull; {applicantCount} Applicants
                            </Text>
                        </div>
                    </Group>
                    <ActionIcon variant="subtle" color="gray" onClick={onClose} size="lg">
                        <IconX size={20} />
                    </ActionIcon>
                </Group>
            </Box>

            <Box px="xl" py="lg" style={{ flex: 1 }}>
                <Text fw={700} size="lg" mb="lg">
                    {isPreview ? 'Review Your Application' : 'Submit Your Application'}
                </Text>

                {!isPreview ? (
                    /* =================== FORM VIEW =================== */
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <TextInput
                                label={<>Full Name <Text component="span" c="red">*</Text></>}
                                placeholder="Enter full name"
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                styles={{ input: { borderRadius: 8 } }}
                            />
                            <TextInput
                                label={<>Email <Text component="span" c="red">*</Text></>}
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                styles={{ input: { borderRadius: 8 } }}
                            />
                            <TextInput
                                label={<>Phone Number <Text component="span" c="red">*</Text></>}
                                placeholder="Enter phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                styles={{ input: { borderRadius: 8 } }}
                            />
                            <TextInput
                                label="Personal Website"
                                placeholder="Enter url"
                                value={formData.personalWebsite}
                                onChange={(e) => handleChange('personalWebsite', e.target.value)}
                                styles={{ input: { borderRadius: 8 } }}
                            />
                        </div>

                        {/* Resume/CV */}
                        <Box mt="md">
                            <Text fw={500} size="sm" mb={4}>Resume/CV <Text component="span" c="red">*</Text></Text>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                style={{ display: 'none' }}
                            />
                            {hasResume ? (
                                <Paper
                                    withBorder
                                    p="sm"
                                    radius="md"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <Group gap="xs">
                                        <IconFile size={18} color="#4C6EF5" />
                                        <Text size="sm" c="dimmed">{getResumeDisplayName()}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Button
                                            size="xs"
                                            variant="subtle"
                                            color="blue"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Change
                                        </Button>
                                        <ActionIcon variant="subtle" color="gray" size="sm" onClick={removeFile}>
                                            <IconX size={14} />
                                        </ActionIcon>
                                    </Group>
                                </Paper>
                            ) : (
                                <Paper
                                    withBorder
                                    p="sm"
                                    radius="md"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                                >
                                    <IconPaperclip size={18} color="#868e96" />
                                    <Text size="sm" c="dimmed">Attach Resume/CV</Text>
                                </Paper>
                            )}
                        </Box>

                        {/* Cover Letter */}
                        <Textarea
                            label="Cover Letter"
                            placeholder="Type something about yourself"
                            value={formData.coverLetter}
                            onChange={(e) => handleChange('coverLetter', e.target.value)}
                            mt="md"
                            minRows={4}
                            autosize
                            styles={{ input: { borderRadius: 8 } }}
                        />

                        {/* Preview Button */}
                        <Button
                            fullWidth
                            mt="xl"
                            size="md"
                            radius="md"
                            color="blue.4"
                            onClick={handlePreview}
                            style={{ fontWeight: 600 }}
                        >
                            Preview
                        </Button>
                    </>
                ) : (
                    /* =================== PREVIEW VIEW =================== */
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <Text fw={500} size="sm" mb={4}>Full Name <Text component="span" c="red">*</Text></Text>
                                <Paper withBorder p="sm" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
                                    <Text size="sm">{formData.fullName}</Text>
                                </Paper>
                            </div>
                            <div>
                                <Text fw={500} size="sm" mb={4}>Email <Text component="span" c="red">*</Text></Text>
                                <Paper withBorder p="sm" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
                                    <Text size="sm">{formData.email}</Text>
                                </Paper>
                            </div>
                            <div>
                                <Text fw={500} size="sm" mb={4}>Phone Number <Text component="span" c="red">*</Text></Text>
                                <Paper withBorder p="sm" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
                                    <Text size="sm">{formData.phone}</Text>
                                </Paper>
                            </div>
                            <div>
                                <Text fw={500} size="sm" mb={4}>Personal Website</Text>
                                <Paper withBorder p="sm" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
                                    <Text size="sm" c={formData.personalWebsite ? undefined : 'dimmed'}>
                                        {formData.personalWebsite || '—'}
                                    </Text>
                                </Paper>
                            </div>
                        </div>

                        <Box mt="md">
                            <Text fw={500} size="sm" mb={4}>Resume/CV <Text component="span" c="red">*</Text></Text>
                            <Paper withBorder p="sm" radius="md" style={{ backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IconFile size={18} color="#4C6EF5" />
                                <Text size="sm">{getResumeDisplayName()}</Text>
                            </Paper>
                        </Box>

                        <Box mt="md">
                            <Text fw={500} size="sm" mb={4}>Cover Letter</Text>
                            <Paper withBorder p="sm" radius="md" style={{ backgroundColor: '#f8f9fa', minHeight: 80 }}>
                                <Text size="sm" c={formData.coverLetter ? undefined : 'dimmed'} style={{ whiteSpace: 'pre-wrap' }}>
                                    {formData.coverLetter || '—'}
                                </Text>
                            </Paper>
                        </Box>

                        {/* Edit / Submit Buttons */}
                        <Group mt="xl" grow>
                            <Button
                                variant="outline"
                                size="md"
                                radius="md"
                                color="blue.4"
                                leftSection={<IconArrowLeft size={18} />}
                                onClick={() => setIsPreview(false)}
                                style={{ fontWeight: 600 }}
                            >
                                Edit
                            </Button>
                            <Button
                                size="md"
                                radius="md"
                                color="blue.4"
                                loading={submitting}
                                onClick={handleSubmit}
                                leftSection={!submitting ? <IconCheck size={18} /> : undefined}
                                style={{ fontWeight: 600 }}
                            >
                                Submit
                            </Button>
                        </Group>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ApplyJobModal;
