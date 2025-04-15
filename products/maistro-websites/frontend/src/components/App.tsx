import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            React + TypeScript + Tailwind + Sass
          </h1>
        </div>
      </header>
      <main>
        <div className="custom-container">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>React for UI components</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS for utility classes</li>
              <li>Sass for custom styling</li>
              <li>Webpack configured in TypeScript</li>
            </ul>
            <div className="mt-6">
              <button className="btn-primary">
                Custom Button
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;