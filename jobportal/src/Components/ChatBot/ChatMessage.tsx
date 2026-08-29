import React from 'react';

interface ChatMessageProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender, timestamp }) => {
  const isBot = sender === 'bot';

  const formatText = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <React.Fragment key={i}>
          {parsedLine}
          {i !== lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`cb-msg flex flex-col max-w-[85%] ${isBot ? 'self-start items-start' : 'self-end items-end'}`}>
      <div className="flex items-end gap-2">
        {isBot && (
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs flex-shrink-0">💼</div>
        )}
        <div className={`px-4 py-3 text-sm leading-relaxed break-words ${
          isBot
            ? 'bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
            : 'bg-blue-500 text-white rounded-2xl rounded-br-sm shadow-md shadow-blue-500/20'
        }`}>
          {formatText(text)}
        </div>
      </div>
      <span className="text-[11px] text-gray-500 mt-1 mx-1">{timestamp}</span>
    </div>
  );
};

export default ChatMessage;
