import React, { useState, useRef, useEffect } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
} from "./icons";

const senderType = {
  USER: "USER",
  BOT: "BOT",
} as const;

type SenderType = (typeof senderType)[keyof typeof senderType];

interface Message {
  id: number;
  text: string;
  sender: SenderType;
  timestamp: string;
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onToggle: () => void;
  onBackToForm?: () => void;
  userData?: UserData;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onToggle,
  onBackToForm,
  userData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello ${
        userData?.name || "you"
      }! 👋 What can A Dong Silk do for you today?`,
      sender: senderType.BOT,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new message added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset to 40px default height
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = newHeight + "px";

      // Change border-radius based on height
      if (newHeight > 40) {
        textarea.style.borderRadius = "12px";
      } else {
        textarea.style.borderRadius = "9999px"; // rounded-full
      }
    }
  };

  useEffect(() => {
    autoResize();
  }, [newMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: senderType.USER,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");

      // Auto reply after 1 second
      setTimeout(() => {
        const botReply: Message = {
          id: messages.length + 2,
          text: "Thank you for contacting us! We will respond as soon as possible.",
          sender: senderType.BOT,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botReply]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter: new line (default behavior)
        return;
      } else {
        // Enter only: send message
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  // Suppress unused parameter warning
  console.log(onBackToForm);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Icon */}
      <div className={isOpen ? "" : "animate-shake hover:animate-none"}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="group relative bg-primary-500 
                     text-white p-4 rounded-full shadow-lg 
                     hover:shadow-xl hover:bg-primary-600 transform transition-all duration-300
                     hover:scale-105 
                     focus:outline-none focus:ring-4 focus:ring-transparent"
          aria-label="Toggle chat"
        >
          {isOpen ? (
            <ChevronDownIcon className="h-8 w-8" />
          ) : (
            <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 max-w-sm">
          <div
            ref={chatBoxRef}
            className="bg-white rounded-2xl shadow-2xl border border-neutral-200 
                       overflow-hidden transform transition-all duration-300 
                       animate-in slide-in-from-bottom-5 h-[500px] flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary-500 text-white p-4 flex justify-between items-center border-b border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Hello {userData?.name || "you"}!
                  </h3>
                  <p className="text-sm font-semibold">
                    A Dong Silk is ready to support you 24/7.
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === senderType.USER
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender === senderType.USER
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-800 border border-neutral-200"
                    }`}
                  >
                    <p className="text-sm break-words">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === senderType.USER
                          ? "text-primary-100"
                          : "text-neutral-500"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-200 ">
              <div className="flex space-x-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your message..."
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-full 
                           focus:ring-[0.5px] focus:ring-primary-500 focus:border-primary-500
                           focus-visible:outline-none
                           transition-colors placeholder-neutral-400
                           resize-none h-10 max-h-[120px] leading-5 text-sm
                           flex items-center"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="disabled:opacity-50 disabled:cursor-not-allowed
                           hover:scale-105 transition-transform duration-200"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-10 w-10 text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
