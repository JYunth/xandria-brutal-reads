
import { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { useBooks } from '@/context/BookContext';

const AISidebar = () => {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([
    { type: 'ai', content: 'Hello! I\'m your reading assistant. Ask me anything about the book or request summaries and analysis.' }
  ]);
  const [input, setInput] = useState('');
  const { currentBook } = useBooks();

  const handleSendMessage = () => {
    if (input.trim()) {
      // Add user message
      setMessages(prev => [...prev, { type: 'user', content: input }]);
      
      // Simulate AI response
      setTimeout(() => {
        let response = '';
        if (input.toLowerCase().includes('summary')) {
          response = `Here's a brief summary of "${currentBook?.title}": ${currentBook?.description}`;
        } else if (input.toLowerCase().includes('author')) {
          response = `${currentBook?.author} is known for their unique perspective on ${currentBook?.genre.join(', ')} themes.`;
        } else {
          response = "That's an interesting question about the book. Based on my analysis, the text explores themes of knowledge preservation and cultural heritage.";
        }
        
        setMessages(prev => [...prev, { type: 'ai', content: response }]);
      }, 1000);
      
      setInput('');
    }
  };

  return (
    <div className="bg-card border-l border-border h-full flex flex-col">
      <div className="p-4 border-b font-serif">
        <h3 className="font-medium">Reading Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about the book..."
            className="flex-1 border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button 
            onClick={handleSendMessage}
            className="p-2 bg-primary text-primary-foreground rounded-md"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISidebar;
