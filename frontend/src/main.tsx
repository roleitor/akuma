import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { syncManager } from './services/sync/syncManager';
import './index.css';

// Register Service Worker
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New content available, updating...');
    updateSW();
  },
  onOfflineReady() {
    console.log('[PWA] App ready to work offline');
    showOfflineNotification();
  },
  onRegisterError(error: unknown) {
    console.error('[PWA] Service worker registration failed:', error);
  },
});

function showOfflineNotification() {
  const notification = document.createElement('div');
  notification.className = 'pwa-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e40af;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      animation: slideUp 0.3s ease-out;
    ">
      App lista para funcionar offline
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize sync manager
syncManager.init().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
