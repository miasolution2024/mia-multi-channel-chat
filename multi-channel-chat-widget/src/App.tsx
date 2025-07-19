import React, { useState } from "react";
import PreChatForm from "./components/PreChatForm";
import ChatWindow from "./components/ChatWindow";
import "./index.css";

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface AppProps {
  initialOpen?: boolean;
  webhookUrl: string;
}

type ChatState = "form" | "chat";

const App: React.FC<AppProps> = ({ initialOpen = false, webhookUrl }) => {
  const [chatState, setChatState] = useState<ChatState>("form");
  const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(initialOpen);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  // Log webhook URL for future use
  console.log("Webhook URL:", webhookUrl);

  const handleFormSuccess = (data: UserData) => {
    setUserData(data);
    setChatState("chat");
    setIsChatBoxOpen(true);
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
    <div className="min-h-screen bg-neutral-50 font-sans">
      {chatState === "form" && <PreChatForm onSuccess={handleFormSuccess} />}

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
