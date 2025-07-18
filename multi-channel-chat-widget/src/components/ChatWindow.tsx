// src/components/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

// Define types for user info (same as in PreChatForm)
interface UserInfo {
    name: string;
    email: string;
    whatsapp: string;
}

// Define props for the ChatWindow component
interface ChatWindowProps {
    userInfo: UserInfo | null; // UserInfo can be null initially
    onSendMessage: (message: string, userInfo: UserInfo | null) => void;
}

const initialMessages: Message[] = [ // Type the array
    { id: 1, text: "Hello Vo! 👋 What can A Dong Silk do for you today?", sender: 'bot' }
];

function ChatWindow({ userInfo, onSendMessage }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputMessage, setInputMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null); // Type the ref

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputMessage.trim()) {
            const newMessage: Message = { // Type the new message
                id: messages.length + 1,
                text: inputMessage.trim(),
                sender: 'user'
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            onSendMessage(inputMessage.trim(), userInfo);
            setInputMessage('');

            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { id: prevMessages.length + 1, text: "Thank you for your message! Our team will get back to you shortly.", sender: 'bot' }
                ]);
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { // Type the event
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <div className="my-chat-header">Hello {userInfo?.name || 'Guest'}!</div>
            <div className="my-chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`my-chat-message-bubble my-chat-message-${msg.sender}`}>
                        {msg.text}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="my-chat-send-button" onClick={handleSend}>Send</button>
            </div>
        </>
    );
}

export default ChatWindow;