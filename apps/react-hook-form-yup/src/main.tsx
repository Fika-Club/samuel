import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Application Entry Point
 * Sets up React 18 root API and mounts the App component
 */

// Get the root DOM element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

// Create React 18 root
const root = createRoot(container);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Development environment configuration
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 React Hook Form + Yup 앱이 개발 모드로 시작되었습니다');
  
  // Enable React DevTools in development
  if (typeof window !== 'undefined') {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot;
  }
}