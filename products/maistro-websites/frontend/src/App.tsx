import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Button
} from '@maistro/ui';

import './styles/global.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
      <div className="p-4 m-4 bg-blue-500 text-white rounded-lg shadow-lg">
      <div>
      If you see this with blue background and white text, Tailwind is working!
      </div>
      <Button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-red-600 transition-colors">
        TEST
        </Button>
    </div>

        <h1 className="text-3xl font-bold text-blue-600">Maistro Websites</h1>
      </header>
      
      <main>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome to Maistro Websites</h2>
        </div>
      </main>
    </div>
  );
};

// Mount the React application
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}