import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <StoreProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </StoreProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
