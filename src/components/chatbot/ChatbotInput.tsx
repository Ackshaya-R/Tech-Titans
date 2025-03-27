
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
}

const ChatbotInput = ({ onSendMessage }: ChatbotInputProps) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 border-t border-border">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Type your message"
        />
        <button
          onClick={handleSendMessage}
          disabled={input.trim() === ''}
          className="bg-primary text-white p-2 rounded-md disabled:bg-primary/50"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatbotInput;
