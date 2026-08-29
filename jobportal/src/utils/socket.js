import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import { setConversations } from '../Slices/ChatSlice.tsx';

const MESSAGE_API_END_POINT = "http://localhost:8000/api/v1/message";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    // Fetch conversations to update global unread count
    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get(`${MESSAGE_API_END_POINT}/conversations`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setConversations(res.data.conversations));
            }
        } catch (e) {
            // Silently fail
        }
    };

    useEffect(() => {
        if (user) {
            const socketInstance = io('http://localhost:8000', {
                query: { userId: user._id },
                withCredentials: true,
            });

            socketInstance.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });

            // Global listener: update unread count on new messages
            socketInstance.on('newMessage', () => {
                fetchUnreadCount();
            });

            // Also fetch on initial connection
            fetchUnreadCount();

            setSocket(socketInstance);

            return () => {
                socketInstance.off('newMessage');
                socketInstance.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
