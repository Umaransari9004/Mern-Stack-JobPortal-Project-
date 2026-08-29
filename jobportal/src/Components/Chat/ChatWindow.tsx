import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Text, ScrollArea, TextInput, ActionIcon, Badge, Menu, Group, Box, Anchor, Loader, Tooltip } from '@mantine/core';
import { IconSend, IconCheck, IconChecks, IconTrash, IconDotsVertical, IconPaperclip, IconFile, IconX, IconDownload } from '@tabler/icons-react';

interface ChatWindowProps {
    messages: any[];
    currentUserId: string;
    otherUser: any;
    companyName: string;
    jobTitle: string;
    employerCompany: string;
    onSendMessage: (text: string, file?: File) => void;
    onDeleteMessage: (messageId: string) => void;
    onDeleteConversation: () => void;
    loading: boolean;
    onlineUsers: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    currentUserId,
    otherUser,
    companyName,
    jobTitle,
    employerCompany,
    onSendMessage,
    onDeleteMessage,
    onDeleteConversation,
    loading,
    onlineUsers
}) => {
    const [messageText, setMessageText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isOnline = onlineUsers.includes(otherUser?._id);
    const displayName = otherUser?.name || 'User';
    const isEmployer = otherUser?.role === 'employer';
    const hasJobContext = !!(companyName || jobTitle);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (messageText.trim() || file) {
            onSendMessage(messageText, file || undefined);
            setMessageText('');
            setFile(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Date separator helpers
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };

    const formatDateLabel = (date: Date) => {
        const now = new Date();
        if (isSameDay(date, now)) return 'Today';
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (isSameDay(date, yesterday)) return 'Yesterday';
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderStatusIcon = (status: string) => {
        switch (status) {
            case 'sent': return <Tooltip label="Sent" withArrow><span style={{ display: 'inline-flex' }}><IconCheck size={14} color="gray" /></span></Tooltip>;
            case 'delivered': return <Tooltip label="Delivered" withArrow><span style={{ display: 'inline-flex' }}><IconChecks size={14} color="gray" /></span></Tooltip>;
            case 'seen': return <Tooltip label="Seen" withArrow><span style={{ display: 'inline-flex' }}><IconChecks size={14} color="#339af0" /></span></Tooltip>;
            default: return <IconCheck size={14} color="gray" />;
        }
    };

    const renderAttachment = (attachment: any, isOwn: boolean) => {
        if (!attachment?.url) return null;
        
        if (attachment.fileType === 'image') {
            return (
                <a href={attachment.url} target="_blank" rel="noreferrer">
                    <img 
                        src={attachment.url} 
                        alt={attachment.fileName} 
                        style={{ maxWidth: 250, borderRadius: 8, marginBottom: 4, cursor: 'pointer' }} 
                    />
                </a>
            );
        }
        
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 8, marginBottom: 4,
                backgroundColor: isOwn ? 'rgba(255,255,255,0.2)' : '#f1f3f5'
            }}>
                <IconFile size={20} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Text size="xs" fw={500} truncate>{attachment.fileName}</Text>
                </div>
                <Anchor href={attachment.url} target="_blank" download>
                    <IconDownload size={16} />
                </Anchor>
            </div>
        );
    };


    let lastDate: Date | null = null;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', backgroundColor: 'white', borderBottom: '1px solid #e9ecef' }}>
                <Group justify="space-between">
                    <Group>
                        <Avatar src={otherUser?.profile?.profilePhoto || null} radius="xl" size="md" color="blue">
                            {displayName.charAt(0)}
                        </Avatar>
                        <div>
                            <Text fw={600} size="md">{displayName}</Text>
                            {hasJobContext ? (
                                /* Job-linked: show Company • Job Title | Online */
                                <Text size="xs" c="dimmed">
                                    {[companyName, jobTitle].filter(Boolean).join(' • ')} | <Text component="span" c={isOnline ? 'teal.6' : 'dimmed'} fw={isOnline ? 500 : 400}>{isOnline ? 'Online' : 'Offline'}</Text>
                                </Text>
                            ) : (
                                /* Find Talent: just Online/Offline */
                                <Text size="xs" c={isOnline ? 'teal.6' : 'dimmed'} fw={isOnline ? 500 : 400}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </Text>
                            )}
                            {otherUser?.email && (
                                <Text size="xs" c="dimmed">{otherUser.email}</Text>
                            )}
                        </div>
                    </Group>
                    <Menu position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={20} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={onDeleteConversation}>
                                Delete Chat
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </div>

            {/* Messages Area */}
            <ScrollArea style={{ flex: 1, padding: '0 16px' }} viewportRef={scrollRef}>
                <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                    {loading ? (
                        <Group justify="center" mt="xl"><Loader /></Group>
                    ) : messages.length === 0 ? (
                        <Group justify="center" mt="xl">
                            <Text c="dimmed">Say hi to {displayName.split(' ')[0]}!</Text>
                        </Group>
                    ) : (
                        messages.map((msg: any, index: number) => {
                            const msgDate = new Date(msg.createdAt);
                            const showDate = !lastDate || !isSameDay(msgDate, lastDate);
                            lastDate = msgDate;
                            const isOwn = msg.senderId === currentUserId;

                            return (
                                <div key={msg._id || index}>
                                    {/* Date separator */}
                                    {showDate && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0' }}>
                                            <div style={{ flex: 1, height: 1, backgroundColor: '#dee2e6' }}></div>
                                            <Badge variant="light" color="gray" radius="xl" size="sm" mx="sm">
                                                {formatDateLabel(msgDate)}
                                            </Badge>
                                            <div style={{ flex: 1, height: 1, backgroundColor: '#dee2e6' }}></div>
                                        </div>
                                    )}

                                    {/* Message bubble */}
                                    <div 
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                            marginBottom: 8
                                        }}
                                        onMouseEnter={() => setHoveredMsgId(msg._id)}
                                        onMouseLeave={() => setHoveredMsgId(null)}
                                    >
                                        <div style={{ maxWidth: '70%' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flexDirection: isOwn ? 'row-reverse' : 'row' }}>
                                                <div style={{
                                                    padding: '10px 14px',
                                                    minWidth: 60,
                                                    backgroundColor: isOwn ? '#4C6EF5' : 'white',
                                                    color: isOwn ? 'white' : '#212529',
                                                    borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                                    border: isOwn ? 'none' : '1px solid #e9ecef',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap',
                                                }}>
                                                    {renderAttachment(msg.attachment, isOwn)}
                                                    {msg.text && (
                                                        <span style={{ fontSize: 14 }}>{msg.text}</span>
                                                    )}
                                                </div>

                                                {/* Delete button on hover */}
                                                {isOwn && hoveredMsgId === msg._id && (
                                                    <Tooltip label="Delete" withArrow>
                                                        <ActionIcon variant="subtle" color="red" size="sm" radius="xl" onClick={() => onDeleteMessage(msg._id)}>
                                                            <IconTrash size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </div>

                                            {/* Time + Status */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, paddingLeft: 4, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                                                <Text size="xs" c="dimmed">{formatTime(msg.createdAt)}</Text>
                                                {isOwn && renderStatusIcon(msg.status || 'sent')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>

            {/* File preview chip */}
            {file && (
                <div style={{ padding: '8px 16px', backgroundColor: 'white', borderTop: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge variant="light" color="blue" size="lg" rightSection={
                        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent" onClick={() => setFile(null)}>
                            <IconX size={12} />
                        </ActionIcon>
                    }>
                        📎 {file.name}
                    </Badge>
                </div>
            )}

            {/* Input Area */}
            <div style={{ padding: '12px 16px', backgroundColor: 'white', borderTop: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Hidden file input */}
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
                
                <ActionIcon variant="subtle" color="gray" size="lg" radius="xl" onClick={() => fileInputRef.current?.click()}>
                    <IconPaperclip size={20} />
                </ActionIcon>

                <TextInput
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    radius="xl"
                    size="md"
                    style={{ flex: 1 }}
                    classNames={{
                        input: 'bg-gray-50 border-transparent focus:border-blue-400 focus:bg-white transition-all',
                    }}
                />
                
                <ActionIcon 
                    size="lg" 
                    radius="xl" 
                    color="blue" 
                    variant="filled"
                    onClick={handleSend}
                    disabled={!messageText.trim() && !file}
                >
                    <IconSend size={18} stroke={1.5} />
                </ActionIcon>
            </div>
        </div>
    );
};

export default ChatWindow;
