import React from 'react';
import { Avatar, Indicator, Text, Badge, Menu, SegmentedControl, ActionIcon, ScrollArea, Group, Box } from '@mantine/core';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';

interface ConversationListProps {
    conversations: any[];
    selectedConversation: any;
    onSelectConversation: (conv: any) => void;
    onDeleteConversation: (conversationId: string) => void;
    onlineUsers: string[];
    currentUserId: string;
    filter: 'all' | 'unread';
    onFilterChange: (filter: 'all' | 'unread') => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    selectedConversation,
    onSelectConversation,
    onDeleteConversation,
    onlineUsers,
    currentUserId,
    filter,
    onFilterChange
}) => {
    const formatTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'selected': return 'teal';
            case 'rejected': return 'red';
            case 'in-touch': return 'blue';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'selected': return '⚡';
            case 'rejected': return '⚡';
            case 'in-touch': return '💬';
            default: return '';
        }
    };

    const filteredConversations = conversations.filter(conv => {
        if (filter === 'unread') {
            return (conv.unreadCount || 0) > 0;
        }
        return true;
    });

    const unreadTotal = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

    return (
        <div style={{ width: 350, height: '100%', borderRight: '1px solid #e9ecef', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                <SegmentedControl
                    value={filter}
                    onChange={(value) => onFilterChange(value as 'all' | 'unread')}
                    data={[
                        { label: 'All messages', value: 'all' },
                        { label: `Unread (${unreadTotal})`, value: 'unread' }
                    ]}
                    fullWidth
                    color="blue"
                    radius="md"
                    size="sm"
                />
            </div>

            <ScrollArea style={{ flex: 1 }}>
                {filteredConversations.length === 0 ? (
                    <Text ta="center" c="dimmed" mt="xl" size="sm">No conversations yet</Text>
                ) : (
                    filteredConversations.map((conv) => {
                        const otherParticipant = conv.participants?.find((p: any) => p._id !== currentUserId) || {};
                        const isOnline = onlineUsers.includes(otherParticipant._id);
                        const isSelected = selectedConversation?._id === conv._id;
                        
                        // User's name (always the other participant)
                        const userName = otherParticipant.name || 'Unknown User';
                        
                        // Job-linked conversation data
                        const jobCompanyName = conv.jobId?.company?.name || '';
                        const jobTitle = conv.jobId?.jobTitle || '';
                        const hasJobContext = !!(conv.jobId && (jobCompanyName || jobTitle));

                        return (
                            <div
                                key={conv._id}
                                onClick={() => onSelectConversation(conv)}
                                className="group"
                                style={{
                                    padding: '14px 16px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f1f3f5',
                                    backgroundColor: isSelected ? '#EDF2FF' : 'white',
                                    borderLeft: isSelected ? '4px solid #4C6EF5' : '4px solid transparent',
                                    transition: 'background-color 0.15s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'white'; }}
                            >
                                <Group wrap="nowrap" align="flex-start" gap="sm">
                                    <Indicator disabled={!isOnline} color="green" size={10} offset={4} withBorder>
                                        <Avatar src={otherParticipant.profile?.profilePhoto || null} radius="xl" size="md" color="blue">
                                            {userName.charAt(0)}
                                        </Avatar>
                                    </Indicator>
                                    
                                    <Box flex={1} style={{ overflow: 'hidden' }}>
                                        <Group justify="space-between" wrap="nowrap">
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                {hasJobContext ? (
                                                    <>
                                                        {/* Job-linked: Company Name bold */}
                                                        <Text fw={conv.unreadCount > 0 ? 700 : 600} size="sm" truncate>
                                                            {jobCompanyName || userName}
                                                        </Text>
                                                        {/* Job Title as gray subtitle */}
                                                        <Text size="xs" c="dimmed" truncate>
                                                            {jobTitle}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    /* Find Talent / General: just show user name */
                                                    <Text fw={conv.unreadCount > 0 ? 700 : 600} size="sm" truncate>
                                                        {userName}
                                                    </Text>
                                                )}
                                            </div>
                                            <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                                                {formatTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                                            </Text>
                                        </Group>
                                        
                                        {/* Last message preview */}
                                        <Text size="xs" c={conv.unreadCount > 0 ? 'dark' : 'dimmed'} fw={conv.unreadCount > 0 ? 500 : 400} truncate mt={2}>
                                            {conv.lastMessage?.text || (conv.lastMessage?.attachment ? '📎 Attachment' : 'No messages yet')}
                                        </Text>

                                        {/* Status badge */}
                                        {conv.applicationStatus && (
                                            <Badge 
                                                color={getStatusColor(conv.applicationStatus)} 
                                                variant="light" 
                                                size="xs" 
                                                mt={6}
                                                leftSection={getStatusIcon(conv.applicationStatus)}
                                            >
                                                {conv.applicationStatus}
                                            </Badge>
                                        )}
                                    </Box>

                                    {/* Unread count badge */}
                                    {conv.unreadCount > 0 && (
                                        <Badge size="sm" circle color="blue" variant="filled" style={{ minWidth: 22 }}>
                                            {conv.unreadCount}
                                        </Badge>
                                    )}

                                    {/* Delete menu */}
                                    <div 
                                        className="opacity-0 group-hover:opacity-100 transition-opacity" 
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Menu position="bottom-end" shadow="md">
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray" size="sm">
                                                    <IconDotsVertical size={14} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                                                <Menu.Item 
                                                    color="red" 
                                                    leftSection={<IconTrash size={14} />}
                                                    onClick={() => onDeleteConversation(conv._id)}
                                                >
                                                    Delete Chat
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </div>
                                </Group>
                            </div>
                        );
                    })
                )}
            </ScrollArea>
        </div>
    );
};

export default ConversationList;
