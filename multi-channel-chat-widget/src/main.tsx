// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Define the props type for the initChatWidget function
interface InitChatWidgetProps {
    initialOpen?: boolean;
    webhookUrl: string;
}

// This function will be exposed globally by your library
function initChatWidget(containerId: string, props: InitChatWidgetProps): () => void {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found. Chat widget cannot be initialized.`);
        // Return a no-op function to satisfy the type
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

// CORRECTED: Declare the property directly on the Window interface
// This merges with the existing Window interface provided by TypeScript
declare global {
    interface Window {
        MyChatWidget: {
            initChatWidget: ((containerId: string, props: InitChatWidgetProps) => () => void) | undefined;
        };
    }
}

// Ensure the global object exists and then assign the function
if (typeof window !== 'undefined') {
    // Initialize MyChatWidget if it doesn't exist.
    // The `as Window['MyChatWidget']` assertion is often needed here
    // because TypeScript might not know at this exact point that you've
    // extended Window with MyChatWidget.
    window.MyChatWidget = window.MyChatWidget || {} as Window['MyChatWidget'];
    window.MyChatWidget.initChatWidget = initChatWidget;
}

// For local development, this part will run
if (import.meta.env.DEV) {
  const devContainer = document.getElementById('root');
  if (devContainer) {
    initChatWidget('root', { initialOpen: true, webhookUrl: 'https://your.n8n.webhook.url/dev' }); // Use a dev webhook
  }
}