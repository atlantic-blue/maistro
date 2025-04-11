import { createRoot } from 'react-dom/client';

import './styles/global.css';

const App = () => {
  return <div className="min-h-screen bg-gray-100 p-8">Design</div>;
};

// Mount the React application
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
