import { Conversation } from '../modles/conversationModel.js';
import { Message } from '../modles/messageModel.js';
import { Application } from '../modles/applicationModle.js';
import { Job } from '../modles/jobsModel.js';
import { getReceiverSocketId, io } from '../socket.js';
import cloudinary from '../config/cloudinary.js';
import getDataUri from '../config/datauri.js';

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.receiverId;
    const { text, jobId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        jobId: jobId || undefined,
      });
    } else if (jobId && !conversation.jobId) {
      conversation.jobId = jobId;
      await conversation.save();
    }

    let attachment = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: 'chat_attachments',
        resource_type: 'auto',
      });
      let fileType = 'other';
      if (req.file.mimetype.startsWith('image/')) fileType = 'image';
      else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
      else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
      else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) fileType = 'document';

      attachment = {
        url: cloudResponse.secure_url,
        fileName: req.file.originalname,
        fileType,
      };
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text: text || '',
      attachment: attachment || undefined,
      status: 'sent',
    });

    await newMessage.save();

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      newMessage.status = 'delivered';
      await newMessage.save();
      io.to(receiverSocketId).emit('newMessage', newMessage);
      
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messageStatusUpdate', { messageId: newMessage._id, status: 'delivered' });
      }
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.userId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email profile.profilePhoto profile.jobTitle profile.company role')
      .populate('lastMessage')
      .populate({
        path: 'jobId',
        select: 'jobTitle company',
        populate: {
          path: 'company',
          select: 'name logo',
        },
      })
      .sort({ updatedAt: -1 });

    // Also populate profile.company for each participant (for employer company info)
    await Conversation.populate(conversations, {
      path: 'participants.profile.company',
      select: 'name logo',
    });

    const conversationData = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: userId,
          status: { $ne: 'seen' },
        });

        let applicationStatus = 'In-touch';
        if (conv.jobId) {
          const otherParticipant = conv.participants.find(p => p._id.toString() !== userId.toString());
          if (otherParticipant) {
            const application = await Application.findOne({
              job: conv.jobId._id,
              applicant: otherParticipant.role === 'student' ? otherParticipant._id : userId,
            });

            if (application) {
              if (application.status === 'accepted') {
                applicationStatus = 'Selected';
              } else if (application.status === 'rejected') {
                applicationStatus = 'Rejected';
              }
            }
          }
        }

        return {
          ...conv.toObject(),
          unreadCount,
          applicationStatus,
        };
      })
    );

    res.status(200).json({ success: true, conversations: conversationData });
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const receiverId = req.id;
    const senderId = req.params.senderId;

    const conversation = await Conversation.findOne({
      participants: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    await Message.updateMany(
      { conversationId: conversation._id, senderId, receiverId, status: { $ne: 'seen' } },
      { $set: { status: 'seen' } }
    );

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('messagesSeen', { conversationId: conversation._id, receiverId });
    }

    res.status(200).json({ success: true, message: 'Messages marked as seen' });
  } catch (error) {
    console.error('Error in markAsSeen:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const conversationId = message.conversationId;
    await Message.findByIdAndDelete(messageId);

    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.lastMessage?.toString() === messageId.toString()) {
      const newLastMessage = await Message.findOne({ conversationId }).sort({ createdAt: -1 });
      conversation.lastMessage = newLastMessage ? newLastMessage._id : null;
      await conversation.save();
    }

    const otherUserId = message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId;
    const otherUserSocketId = getReceiverSocketId(otherUserId);
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit('messageDeleted', { messageId, conversationId });
    }

    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    const otherUserId = conversation.participants.find(p => p.toString() !== userId.toString());
    const otherUserSocketId = getReceiverSocketId(otherUserId);
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit('conversationDeleted', { conversationId });
    }

    res.status(200).json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
