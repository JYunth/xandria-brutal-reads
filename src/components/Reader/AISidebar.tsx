import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as GlassCard } from "@/components/ui/card";
import { getUserData, updateUserData, ChatMessage } from "@/utils/localStorage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SendIcon } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log(GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const AISidebar = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const userData = getUserData();
    let updatedHistory = userData.chatHistory;

    // Clear chat history on refresh
    if (!localStorage.getItem('chatHistory')) {
      updatedHistory = [];
    }

    if (!updatedHistory) {
      updatedHistory = [];
    }

    if (updatedHistory.length === 0) {
      const initialAiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai-init`,
        sender: 'ai',
        message: "Hi there! I'm Xandria, your e-book reader AI assistant. We will help to make your reading experience much better.",
        timestamp: new Date().toISOString()
      };
      updatedHistory = [...updatedHistory, initialAiMessage];
      updateUserData('chatHistory', updatedHistory);
    }

    setMessages(updatedHistory);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchAIResponse = async (systemPrompt: string, history: ChatMessage[]): Promise<{ success: boolean; message: string }> => {
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.message }]
    }));

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...formattedHistory,
    ];

    const result = await model.generateContent({
      contents: contents,
    });

    const responseText = await result.response.text();
    return responseText
      ? { success: true, message: responseText }
      : { success: false, message: "Sorry, I received an empty response." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Sorry, I could not process that request: ${errorMessage}`,
    };
  }
};

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateUserData('chatHistory', updatedMessages);
    setNewMessage('');
    setIsTyping(true);

    const userData = getUserData();
    const currency = userData.settings?.currency ?? 'USD';
    const balance = userData.balance ?? 0;
    const expenseBudgets = userData.expenseBudgets ?? {};
    const financialGoals = userData.financialGoals ?? [];

    const financialSummary = `
Current Balance: ${currency} ${balance.toFixed(2)}
Top Budgets: ${Object.entries(expenseBudgets).slice(0, 3).map(([cat, val]) => `${cat}: ${currency} ${val}`).join(', ')}
Primary Goal: ${financialGoals.length > 0 ? financialGoals[0].type : 'Not set'} 
Risk Tolerance Score: ${userData.riskToleranceScore ?? 'Not set'}
Financial Health Score: ${userData.financialHealthScore ?? 'Not set'}
    `.trim();

    const baseSystemPrompt = "You are Xandria, an e-book reader AI assistant. Your goal is to provide concise, helpful assistance related to the user's e-book reading experience.";
    const systemPromptWithData = `${baseSystemPrompt}`;

    const aiResponseResult = await fetchAIResponse(systemPromptWithData, updatedMessages); 
    
    if (aiResponseResult.success) {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        message: aiResponseResult.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      updateUserData('chatHistory', [...updatedMessages, aiMessage]);
      setError(null);
    } else {
      setError(aiResponseResult.message); 
    }

    setIsTyping(false);
  };

  return (
    <div className="mx-auto flex flex-col flex-grow h-full">
      <GlassCard className="h-full flex-1 flex flex-col overflow-hidden relative min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={`skel-${i}`} className={`flex animate-pulse ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  {i % 2 !== 0 && <div className="mr-3 h-8 w-8 rounded-full bg-subtle-gray/20"></div>}
                  <div className={`max-w-[70%] rounded-xl p-4 space-y-2 ${i % 2 === 0 ? 'bg-soft-gold/10' : 'bg-subtle-gray/20'}`}>
                    <div className="h-3 bg-current opacity-30 rounded w-3/4"></div>
                    <div className="h-3 bg-current opacity-30 rounded w-1/2"></div>
                  </div>
                  {i % 2 === 0 && <div className="ml-3 h-8 w-8 rounded-full bg-soft-gold/10"></div>}
                </div>
              ))}
            </>
          ) : (
            <>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <Avatar className="mr-3 h-8 w-8">
                        <AvatarImage src="/ai.png" alt="AI Avatar" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-xl ${isUser ? 'bg-soft-gold/10' : 'bg-subtle-gray/20'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <span className="text-xs opacity-50 block text-right mt-1">{formatTime(msg.timestamp)}</span>
                    </div>
                    {isUser && (
                      <Avatar className="ml-3 h-8 w-8">
                        <AvatarImage src="/user.png" alt="User Avatar" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <Avatar className="mr-3 h-8 w-8">
                    <AvatarImage src="/ai.png" alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] p-3 rounded-xl bg-subtle-gray/20">
                    <p className="text-sm animate-pulse">Typing...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background flex gap-2">
          <Input
            placeholder="Ask Xandria anything..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || isTyping}>
            Send
          </Button>
        </form>
        <Button onClick={() => {
          localStorage.removeItem('chatHistory');
          setMessages([]);
        }}>Clear</Button>
      </GlassCard>
    </div>
  );
};

export default AISidebar;
