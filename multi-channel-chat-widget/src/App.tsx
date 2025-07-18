import  { useState } from 'react';
import PreChatForm from './components/PreChatForm';
import ChatWindow from './components/ChatWindow';
import './index.css';

// Define UserInfo type (consistent with PreChatForm)
interface UserInfo {
    name: string;
    email: string;
    whatsapp: string;
}

// Define props for the App component (which is your main widget component)
interface AppProps {
    initialOpen?: boolean; // Optional prop
    webhookUrl: string; // Required prop for your n8n webhook
}

function App({ initialOpen = false, webhookUrl }: AppProps) {
    const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
    const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // userInfo can be null

    const handleStartChat = (data: UserInfo) => {
        setUserInfo(data);
        setIsChatStarted(true);
        console.log("User Info collected:", data);
        // Example of sending to a webhook (replace with actual n8n webhook call)
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'user_init', userInfo: data })
        })
        .then(response => response.json())
        .then(data => console.log('Webhook response:', data))
        .catch(error => console.error('Error sending user info to webhook:', error));
    };

    const handleSendMessage = (message: string, senderInfo: UserInfo | null) => {
        console.log("Message sent:", message, "from:", senderInfo);
        // This is where you'd send the message to your n8n workflow
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'message', message: message, userInfo: senderInfo })
        })
        .then(response => response.json())
        .then(data => console.log('Webhook response:', data))
        .catch(error => console.error('Error sending message to webhook:', error));
    };

    return (
        <>
            <div
                className={`my-chat-widget-container ${isOpen ? 'is-open' : ''}`}
                id="my-chat-widget"
            >
                <button className="my-chat-widget-close-button" onClick={() => setIsOpen(false)}>×</button>
                {isChatStarted ? (
                    <ChatWindow userInfo={userInfo} onSendMessage={handleSendMessage} />
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