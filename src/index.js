import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Error handling untuk debug
console.log('Index.js loaded');

const root = ReactDOM.createRoot(document.getElementById('root'));

// Error boundary sederhana
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Render error:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red; background: #1a1a1a; min-height: 100vh;">
      <h1>Error loading app</h1>
      <pre>${error.message}</pre>
      <p>Check console for more details</p>
    </div>
  `;
}
