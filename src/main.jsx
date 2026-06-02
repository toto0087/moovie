import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';

const storedTheme = localStorage.getItem('moovi-theme');
if (storedTheme === 'dark' || storedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', storedTheme);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
