// src/components/ChatWindow.tsx
import React, { useState, useEffect, useRef } from "react";
import { getConversationById } from "../actions/conversation";
import type { Message, UserInfo } from "../model";

interface ChatWindowProps {
  userInfo: UserInfo | null;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello Vo! 👋 What can A Dong Silk do for you today?",
    sender_id: "",
    sender_type: "CHATBOT",
    type: "TEXT",
  },
];

function ChatWindow({ userInfo }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getConversationById("17");
        console.log(response);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        content: inputMessage.trim(),
        sender_id: userInfo?.customerId || "guest",
        sender_type: "CUSTOMER",
        type: "TEXT",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <div className="my-chat-header">Hello {userInfo?.name || "Guest"}!</div>
      <div className="my-chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-chat-message-bubble my-chat-message-${msg.sender_id}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="my-chat-input-area">
        <input
          type="text"
          className="my-chat-input"
          placeholder="Your question..."
          value={inputMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputMessage(e.target.value)
          }
          onKeyPress={handleKeyPress}
        />
        <button className="my-chat-send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </>
  );
}

export default ChatWindow;
