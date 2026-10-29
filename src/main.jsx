import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { EnquiryBasketProvider } from './context/EnquiryBasketContext.jsx';
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <EnquiryBasketProvider>
          <App />
        </EnquiryBasketProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
