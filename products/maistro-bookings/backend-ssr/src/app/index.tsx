import React from "react";
import {
    Routes, Route
} from "react-router-dom";

import "./App.scss"

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="*" element={<div>HELLO WORLD</div>} />
        </Routes>
    );
}

export default App
