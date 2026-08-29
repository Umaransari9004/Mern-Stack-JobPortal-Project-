import React from 'react';

interface QuickRepliesProps {
  replies: string[];
  onQuickReply: (reply: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onQuickReply }) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 self-start">
      {replies.map((reply, index) => (
        <button
          key={index}
          className="cb-qr-btn bg-transparent border-[1.5px] border-blue-500 text-blue-500 px-3.5 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-blue-500 hover:text-white hover:shadow-md hover:shadow-blue-500/20"
          onClick={() => onQuickReply(reply)}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
