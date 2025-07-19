import { useState } from "react";
import PreChatForm from "./components/PreChatForm";
import ChatWindow from "./components/ChatWindow";
import "./index.css";
import type { UserInfo } from "./model";

interface AppProps {
  initialOpen?: boolean;
  webhookUrl: string;
}

function App({ initialOpen = false }: AppProps) {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleStartChat = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
    setIsChatStarted(true);
  };
  return (
    <>
      <div
        className={`my-chat-widget-container ${isOpen ? "is-open" : ""}`}
        id="my-chat-widget"
      >
        <button
          className="my-chat-widget-close-button"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
        {isChatStarted ? (
          <ChatWindow userInfo={userInfo}/>
        ) : (
          <PreChatForm onStartChat={handleStartChat} />
        )}
      </div>
      <div
        className="my-chat-widget-launcher"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </div>
    </>
  );
}

export default App;
