declare global {
  namespace JSX {
      interface IntrinsicElements {
          'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
  }
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './styles/main.scss';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
