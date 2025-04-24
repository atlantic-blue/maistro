import { BrowserRouter } from 'react-router';
import Router from './Routes/router';
import React from 'react';

const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
