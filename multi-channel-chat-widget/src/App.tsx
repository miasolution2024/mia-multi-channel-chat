import React, { useState } from "react";
import PreChatForm from "./components/PreChatForm";
import ChatWindow from "./components/ChatWindow";
import "./index.css";
import type { UserInfo } from "./model";

interface AppProps {
  initialOpen?: boolean;
}

type ChatState = "form" | "chat";

const App: React.FC<AppProps> = ({ initialOpen = false }) => {
  const [chatState, setChatState] = useState<ChatState>("form");
  const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(initialOpen);
  const [userData, setUserData] = useState<UserInfo | undefined>(undefined);

  const handleFormSuccess = (data: UserInfo) => {
    setUserData(data);
  };

  const handleOpenChatWindow = () => {
    setIsChatBoxOpen(true);
    setChatState("chat");
  };

  const handleChatBoxToggle = () => {
    setIsChatBoxOpen(!isChatBoxOpen);
  };

  const handleBackToForm = () => {
    setChatState("form");
    setUserData(undefined);
    setIsChatBoxOpen(true);
  };

  return (
    <div className="chat-widget-container">
      {chatState === "form" && (
        <PreChatForm
          onSuccess={handleFormSuccess}
          openChatWindow={handleOpenChatWindow}
        />
      )}

      {chatState === "chat" && (
        <ChatWindow
          isOpen={isChatBoxOpen}
          onToggle={handleChatBoxToggle}
          onBackToForm={handleBackToForm}
          userData={userData}
        />
      )}
    </div>
  );
};

export default App;
