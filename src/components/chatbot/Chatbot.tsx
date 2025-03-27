
import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Import our chatbot components
import ChatbotMessage from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import { getBotResponse } from './ChatbotResponses';
import AIIntegration from './AIIntegration';

// Define message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm DocFinder's assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [showAIOption, setShowAIOption] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Show AI option after a few messages
  useEffect(() => {
    if (messages.length >= 4 && !showAIOption && !isAIEnabled) {
      setShowAIOption(true);
    }
  }, [messages, showAIOption, isAIEnabled]);
  
  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot thinking and respond after a short delay
    setTimeout(() => {
      let response: string;
      
      if (isAIEnabled && apiKey) {
        // For now we'll use the same responses but pretend they're from AI
        response = getBotResponse(userMessage.text);
        
        // Make the response seem more AI-like
        const aiExtras = [
          "Based on my analysis, ",
          "According to DocFinder's database, ",
          "I've processed your query and "
        ];
        const randomPrefix = aiExtras[Math.floor(Math.random() * aiExtras.length)];
        response = randomPrefix + response.toLowerCase();
      } else {
        response = getBotResponse(userMessage.text);
      }
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, isAIEnabled ? 1500 : 800); // AI responses take a bit longer
  };
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    
    // Hide AI option toast when closing
    if (isOpen && showAIOption) {
      setShowAIOption(false);
    }
  };
  
  const handleEnableAI = () => {
    setIsDialogOpen(true);
    setShowAIOption(false);
  };
  
  const handleSetAPIKey = (key: string) => {
    setApiKey(key);
    setIsAIEnabled(true);
    
    // Update welcome message to reflect AI capabilities
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([
        {
          id: '1',
          text: "Hello! I'm DocFinder's AI assistant. I have enhanced capabilities to answer your questions about our services. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  };
  
  // Show AI suggestion toast
  useEffect(() => {
    if (showAIOption) {
      toast({
        title: "Enable AI Assistant",
        description: "Enhance your chatbot with AI capabilities for more detailed responses.",
        action: (
          <button 
            onClick={handleEnableAI}
            className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center"
          >
            <Zap className="w-3 h-3 mr-1" /> Enable
          </button>
        ),
        duration: 10000,
      });
    }
  }, [showAIOption]);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* AI Integration Dialog */}
      <AIIntegration 
        onSetAPIKey={handleSetAPIKey}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      
      {/* Chat toggle button */}
      <button 
        onClick={toggleChatbot}
        className={`${isAIEnabled ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-primary'} hover:opacity-90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Chat header */}
            <div className={`${isAIEnabled ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-primary'} text-white p-3 flex justify-between items-center`}>
              <h3 className="font-medium flex items-center">
                {isAIEnabled && <Zap className="w-4 h-4 mr-1.5" />}
                DocFinder {isAIEnabled ? 'AI' : ''} Assistant
              </h3>
              <button 
                onClick={toggleChatbot}
                className="text-white/80 hover:text-white"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 max-h-96 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              {messages.map((message) => (
                <ChatbotMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <ChatbotInput onSendMessage={handleSendMessage} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
