import React from "react"
import {
    BrowserRouter
} from "react-router-dom";

import { createRoot } from 'react-dom/client';

import App from "../app";

const container = document.getElementById('main') as HTMLElement;

// TODO: using hydrate collides with BrowserRouter
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
