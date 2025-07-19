/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
} from "./icons";
import type {
  Message,
  MessageCreateRequest,
  UserInfo,
  websocketMessage,
} from "../model";
import { CONFIG } from "../config-global";
import {
  getConversationById,
  sendCustomerMessage,
  sendWelcomeMessage,
  updateConversationLastMessageDataAsync,
} from "../actions/conversation";

interface ChatWindowProps {
  isOpen: boolean;
  onToggle: () => void;
  onBackToForm?: () => void;
  userData?: UserInfo;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onToggle,
  onBackToForm,
  userData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${
        userData?.customer_name || "you"
      }! 👋 What can A Dong Silk do for you today?`,
      sender_type: "CHATBOT",
      sender_id: userData?.customer_id || "chatbot",
      type: "TEXT",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  // Scroll to bottom when new message added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetMessages = async () => {
    if (!userData?.access_token || !userData?.conversation_id) {
      console.error("Missing access token or conversation ID");
      return;
    }
    try {
      const response = await getConversationById(userData?.conversation_id);
      if (!response.messages || response.messages.length === 0) {
        const message = await sendWelcomeMessage({
          content: `Hello ${
            userData?.customer_name || "you"
          }! 👋 What can A Dong Silk do for you today?`,
          sender_type: "CHATBOT",
          sender_id: "369f20d5-7c17-4217-a718-75133fb1f78b",
          type: "TEXT",
          conversation: userData?.conversation_id || "",
        });

        await updateConversationLastMessageDataAsync(
          userData?.conversation_id || "",
          `Hello ${
            userData?.customer_name || "you"
          }! 👋 What can A Dong Silk do for you today?`
        );

        setMessages([message]);
      } else {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    handleGetMessages();
  }, [userData?.conversation_id, userData?.access_token]);

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

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: MessageCreateRequest = {
        content: newMessage,
        sender_id: userData?.customer_id || "user",
        sender_email: userData?.customer_email || "",
        sender_name: userData?.customer_name || "User",
        sender_phone: userData?.customer_phone || "",
        sender_type: "CUSTOMER",
        type: "TEXT",
        conversation: userData?.conversation_id || "",
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");

      await sendCustomerMessage(userMessage);
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

  useEffect(() => {
    if (!userData?.access_token || !userData?.conversation_id) {
      if (websocketRef.current) {
        console.log("Closing existing connection due to missing dependencies.");
        websocketRef.current.close();
        websocketRef.current = null;
      }
      return;
    }

    console.log(
      `Attempting to subscribe to conversation ${userData.conversation_id}`
    );

    // Close any existing connection before opening a new one
    if (websocketRef.current) {
      console.log(
        `Closing old connection for conversation ${userData.conversation_id}`
      );
      websocketRef.current.close();
      websocketRef.current = null; // Clear the ref
    }

    const connection = new WebSocket(CONFIG.websocketUrl);

    const sendAuth = () => {
      connection.send(
        JSON.stringify({
          type: "auth",
          access_token: userData?.access_token,
        })
      );
    };

    const sendSubscribeMessages = () => {
      connection.send(
        JSON.stringify({
          type: "subscribe",
          event: "create",
          collection: "mc_messages",
          query: {
            fields: ["id,conversation,sender_id"],
            filter: {
              conversation: {
                _eq: userData.conversation_id,
              },
              sender_id: {
                _neq: userData.customer_id,
              },
            },
          },
        })
      );
    };

    const handleOpen = () => {
      websocketRef.current = connection;

      console.log(
        `WebSocket connection opened for conversation ${userData.conversation_id}`
      );
      sendAuth();
    };

    const handleMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data) as websocketMessage;

      if (data.type == "auth" && data.status == "ok") {
        sendSubscribeMessages();
      }

      if (data.event === "create") {
        console.log(
          "New message received, potentially refetching conversation details."
        );
        handleGetMessages();
      }
      if (data.type === "ping") {
        connection.send(JSON.stringify({ type: "pong" }));
      }
    };

    const handleClose = () => {
      console.log(
        `WebSocket connection closed for conversation ${userData.conversation_id}`
      );
      websocketRef.current = null; // Clear the ref when connection closes
    };

    const handleError = (error: Event) => {
      console.error({
        event: "onerror",
        error,
        message: `WebSocket error for conversation ${userData.conversation_id}`,
      });
      websocketRef.current = null; // Clear the ref on error
    };

    connection.addEventListener("open", handleOpen);
    connection.addEventListener("message", handleMessage);
    connection.addEventListener("close", handleClose);
    connection.addEventListener("error", handleError);

    return () => {
      if (websocketRef.current) {
        console.log(
          `Cleaning up: Closing WebSocket connection for conversation ${userData.conversation_id}`
        );
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [
    userData?.access_token,
    userData?.conversation_id,
    userData?.customer_id,
  ]);

  return (
    <div className="relative m-6">
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
                  <h3 className="text-lg text-white font-bold">
                    Hello {userData?.customer_name || "you"}!
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
                    message.sender_type === "CUSTOMER"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender_type === "CUSTOMER"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-800 border border-neutral-200"
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
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
