import React, { useEffect, useState } from 'react';
import { Box, Paper, Text, Center } from '@mantine/core';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { MESSAGE_API_END_POINT, USER_API_END_POINT, JOB_API_END_POINT } from '../utils/constant.js';
import { useSocket } from '../utils/socket.js';
import { 
    setConversations, 
    setMessages, 
    addMessage, 
    setSelectedConversation, 
    removeMessage, 
    updateMessageStatus, 
    markConversationMessagesAsSeen 
} from '../Slices/ChatSlice.tsx';
import ConversationList from '../Components/Chat/ConversationList.tsx';
import ChatWindow from '../Components/Chat/ChatWindow.tsx';
import { IconMessageCircle2 } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const MessagesPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { socket, onlineUsers } = useSocket();
    
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [conversationsLoaded, setConversationsLoaded] = useState(false);
    
    const { conversations, messages, selectedConversation } = useSelector((state: any) => state.chat);
    const { user } = useSelector((state: any) => state.auth);

    // Get jobId from route state (passed by ApplicantTable, TalentCard, or Profile)
    const routeJobId = state?.jobId;

    // Fetch conversations on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Handle deep-linking via /messages/:userId
    useEffect(() => {
        if (!userId || !conversationsLoaded || !user) return;

        const existingConv = conversations.find((c: any) => 
            c.participants.some((p: any) => p._id === userId)
        );
        
        if (existingConv) {
            handleSelectConversation(existingConv);
        } else {
            fetchUserDetailsAndCreateTempConv(userId);
        }
    }, [userId, conversationsLoaded, user]);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: any) => {
            dispatch(addMessage(message));
            // If the chat window is open for this conversation, mark as seen
            if (selectedConversation && !selectedConversation._id.startsWith('temp_')) {
                const otherUserId = selectedConversation.participants.find((p: any) => p._id !== user._id)?._id;
                if (message.senderId === otherUserId) {
                    axios.put(`${MESSAGE_API_END_POINT}/seen/${otherUserId}`, {}, { withCredentials: true }).catch(() => {});
                }
            }
            fetchConversations();
        });

        socket.on('messageStatusUpdate', (data: { messageId: string, status: string }) => {
            dispatch(updateMessageStatus(data));
        });

        socket.on('messagesSeen', (data: { conversationId: string }) => {
            dispatch(markConversationMessagesAsSeen(data));
        });

        socket.on('messageDeleted', (data: any) => {
            dispatch(removeMessage(data.messageId || data));
            fetchConversations();
        });

        socket.on('conversationDeleted', (data: any) => {
            const convId = data.conversationId || data;
            if (selectedConversation?._id === convId) {
                dispatch(setSelectedConversation(null));
                dispatch(setMessages([]));
            }
            fetchConversations();
        });

        return () => {
            socket.off('newMessage');
            socket.off('messageStatusUpdate');
            socket.off('messagesSeen');
            socket.off('messageDeleted');
            socket.off('conversationDeleted');
        };
    }, [socket, selectedConversation, dispatch]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${MESSAGE_API_END_POINT}/conversations`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setConversations(res.data.conversations));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setConversationsLoaded(true);
        }
    };

    const fetchUserDetailsAndCreateTempConv = async (id: string) => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/talents/${id}`, { withCredentials: true });
            const userData = res.data.talent || res.data.user || res.data;
            
            const tempConv: any = {
                _id: 'temp_' + id,
                participants: [
                    { _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile },
                    { _id: id, name: userData.name || 'User', email: userData.email || '', role: userData.role || 'student', profile: userData.profile || {} }
                ],
                isNew: true,
                unreadCount: 0
            };

            // Attach jobId from route state if present
            if (routeJobId) {
                tempConv.jobId = { _id: routeJobId };
                // Fetch job details to show company name and title
                try {
                    const jobRes = await axios.get(`${JOB_API_END_POINT}/get/${routeJobId}`, { withCredentials: true });
                    if (jobRes.data?.job) {
                        tempConv.jobId = {
                            _id: routeJobId,
                            jobTitle: jobRes.data.job.jobTitle,
                            company: jobRes.data.job.company
                        };
                    }
                } catch (e) {
                    // Silently fail - job details will be loaded when conversation is created
                    console.log('Could not fetch job details for temp conversation');
                }
            }

            dispatch(setSelectedConversation(tempConv));
            dispatch(setMessages([]));
        } catch (error) {
            console.error('User not found', error);
            const tempConv: any = {
                _id: 'temp_' + id,
                participants: [
                    { _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile },
                    { _id: id, name: 'User', email: '', role: 'student', profile: {} }
                ],
                isNew: true,
                unreadCount: 0
            };
            if (routeJobId) {
                tempConv.jobId = { _id: routeJobId };
            }
            dispatch(setSelectedConversation(tempConv));
            dispatch(setMessages([]));
        }
    };

    const handleSelectConversation = async (conv: any) => {
        dispatch(setSelectedConversation(conv));
        
        if (conv._id.startsWith('temp_') || conv.isNew) {
            dispatch(setMessages([]));
            return;
        }

        try {
            setMessagesLoading(true);
            const otherUserId = conv.participants.find((p: any) => p._id !== user._id)?._id;
            
            // Fetch messages using the OTHER user's ID
            const res = await axios.get(`${MESSAGE_API_END_POINT}/${otherUserId}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setMessages(res.data.messages));
            }
            
            // Mark messages as seen using the OTHER user's ID
            await axios.put(`${MESSAGE_API_END_POINT}/seen/${otherUserId}`, {}, { withCredentials: true });
            fetchConversations();
        } catch (error) {
            console.error(error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSendMessage = async (text: string, file?: File) => {
        if (!selectedConversation) return;
        
        const otherParticipant = selectedConversation.participants.find((p: any) => p._id !== user._id);
        if (!otherParticipant) return;

        try {
            const formData = new FormData();
            if (text) formData.append('text', text);
            if (file) formData.append('attachment', file);
            
            // Pass jobId - from conversation or from route state
            const jobId = selectedConversation.jobId?._id || routeJobId;
            if (jobId) formData.append('jobId', jobId);

            const res = await axios.post(`${MESSAGE_API_END_POINT}/send/${otherParticipant._id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                dispatch(addMessage(res.data.newMessage));
                fetchConversations();
                
                // If it was a temp conversation, refresh to get the real ID
                if (selectedConversation._id.startsWith('temp_') || selectedConversation.isNew) {
                    const newConvRes = await axios.get(`${MESSAGE_API_END_POINT}/conversations`, { withCredentials: true });
                    if (newConvRes.data.success) {
                        dispatch(setConversations(newConvRes.data.conversations));
                        const newConv = newConvRes.data.conversations.find((c: any) => 
                            c.participants.some((p: any) => p._id === otherParticipant._id)
                        );
                        if (newConv) dispatch(setSelectedConversation(newConv));
                    }
                }
            }
        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to send message',
                color: 'red'
            });
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await axios.delete(`${MESSAGE_API_END_POINT}/message/${messageId}`, { withCredentials: true });
            dispatch(removeMessage(messageId));
            fetchConversations();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteConversation = async (conversationId: string) => {
        try {
            await axios.delete(`${MESSAGE_API_END_POINT}/conversation/${conversationId}`, { withCredentials: true });
            dispatch(setSelectedConversation(null));
            dispatch(setMessages([]));
            fetchConversations();
            notifications.show({
                message: 'Conversation deleted',
                color: 'blue'
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Build context info for ChatWindow
    const getConversationContext = () => {
        if (!selectedConversation) return {};
        const otherUser = selectedConversation.participants?.find((p: any) => p._id !== user?._id);
        const jobData = selectedConversation.jobId;
        
        // Company name from job's company (for job-linked conversations)
        const companyName = jobData?.company?.name || '';
        const jobTitle = jobData?.jobTitle || '';
        
        // If no job is linked, get employer's company from their profile
        const employerCompany = otherUser?.profile?.company?.name || otherUser?.profile?.currentCompany || '';
        
        return { otherUser, companyName, jobTitle, employerCompany };
    };

    const ctx = getConversationContext();

    return (
        <Box p="md" bg="#f8f9fa" style={{ height: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center' }} className="font-['poppins']">
            <Paper shadow="sm" radius="lg" style={{ display: 'flex', width: '100%', maxWidth: '1280px', overflow: 'hidden', height: '100%' }}>
                <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={handleSelectConversation}
                    onDeleteConversation={handleDeleteConversation}
                    onlineUsers={onlineUsers}
                    currentUserId={user?._id}
                    filter={filter}
                    onFilterChange={setFilter}
                />
                
                <Box flex={1} style={{ height: '100%' }}>
                    {selectedConversation ? (
                        <ChatWindow
                            messages={messages}
                            currentUserId={user?._id}
                            otherUser={ctx.otherUser}
                            companyName={ctx.companyName}
                            jobTitle={ctx.jobTitle}
                            employerCompany={ctx.employerCompany}
                            onSendMessage={handleSendMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onDeleteConversation={() => handleDeleteConversation(selectedConversation._id)}
                            loading={messagesLoading}
                            onlineUsers={onlineUsers}
                        />
                    ) : (
                        <Center h="100%" bg="#f8f9fa">
                            <Box ta="center">
                                <IconMessageCircle2 size={64} color="#adb5bd" style={{ margin: '0 auto' }} />
                                <Text size="lg" fw={500} mt="md" c="dimmed">Your Messages</Text>
                                <Text size="sm" c="dimmed">Select a conversation to start chatting</Text>
                            </Box>
                        </Center>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default MessagesPage;
