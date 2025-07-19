import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

interface InitChatWidgetProps {
    initialOpen?: boolean;
    webhookUrl: string;
}

function initChatWidget(containerId: string, props: InitChatWidgetProps): () => void {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found. Chat widget cannot be initialized.`);
        return () => {};
    }

    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <App {...props} />
        </React.StrictMode>
    );

    return () => root.unmount();
}

export { initChatWidget };

// declare global {
//     interface Window {
//         MyChatWidget: {
//             initChatWidget: ((containerId: string, props: InitChatWidgetProps) => () => void) | undefined;
//         };
//     }
// }

// if (typeof window !== 'undefined') {
//     window.MyChatWidget = window.MyChatWidget || {} as Window['MyChatWidget'];
//     window.MyChatWidget.initChatWidget = initChatWidget;
// }

// For local development, this part will run
if (import.meta.env.DEV) {
  const devContainer = document.getElementById('root');
  if (devContainer) {
    initChatWidget('root', { initialOpen: true, webhookUrl: 'https://your.n8n.webhook.url/dev' }); // Use a dev webhook
  }
}