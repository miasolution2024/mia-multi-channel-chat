import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

interface InitChatWidgetProps {
    initialOpen?: boolean;
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

// For local development, this part will run
if (import.meta.env.DEV) {
  const devContainer = document.getElementById('root');
  if (devContainer) {
    initChatWidget('root', { initialOpen: true }); // Use a dev webhook
  }
}