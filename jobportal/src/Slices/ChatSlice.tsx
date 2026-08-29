import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    conversations: [] as any[],
    messages: [] as any[],
    selectedConversation: null as any,
    unreadCount: 0
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
            state.unreadCount = action.payload.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            const exists = state.messages.find((m: any) => m._id === action.payload._id);
            if (!exists) {
                state.messages.push(action.payload);
            }
        },
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter((m: any) => m._id !== action.payload);
        },
        updateMessageStatus: (state, action) => {
            const { messageId, status } = action.payload;
            const message = state.messages.find((m: any) => m._id === messageId);
            if (message) {
                message.status = status;
            }
        },
        markConversationMessagesAsSeen: (state, action) => {
            const { conversationId } = action.payload;
            state.messages.forEach((m: any) => {
                if (m.conversationId === conversationId) {
                    m.status = 'seen';
                }
            });
        },
        clearChatState: (state) => {
            state.conversations = [];
            state.messages = [];
            state.selectedConversation = null;
            state.unreadCount = 0;
        },
    }
});

export const {
    setConversations,
    setMessages,
    addMessage,
    setSelectedConversation,
    removeMessage,
    updateMessageStatus,
    markConversationMessagesAsSeen,
    clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
