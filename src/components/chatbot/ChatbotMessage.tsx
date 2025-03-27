
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChatbotMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
}

const ChatbotMessage = ({ message }: ChatbotMessageProps) => {
  const [isTyping, setIsTyping] = useState(message.sender === 'bot');
  const [displayedText, setDisplayedText] = useState('');
  
  // Typing animation effect for bot messages
  useEffect(() => {
    if (message.sender === 'bot') {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < message.text.length) {
          setDisplayedText(message.text.substring(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 15); // Typing speed
      
      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.text);
    }
  }, [message.text, message.sender]);

  return (
    <div 
      className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-3 rounded-lg max-w-[80%] ${
          message.sender === 'user' 
            ? 'bg-primary text-white rounded-tr-none' 
            : 'bg-background dark:bg-secondary rounded-tl-none'
        }`}
      >
        <p className="text-sm">
          {isTyping ? (
            <>
              {displayedText}
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-current animate-pulse rounded-sm"></span>
            </>
          ) : (
            displayedText
          )}
        </p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </motion.div>
    </div>
  );
};

export default ChatbotMessage;
