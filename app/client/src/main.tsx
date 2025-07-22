import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClientWalletProvider } from './providers/WalletProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientWalletProvider>
      <App />
    </ClientWalletProvider>
  </StrictMode>
);
