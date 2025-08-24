import React from "react"
import {
    BrowserRouter
} from "react-router-dom";

import { createRoot } from 'react-dom/client';

import AppRoutes from './Routes/router';
import './styles/main.scss';
import { RouteDataProvider } from "./State/DataRoute.context";


const container = document.getElementById('main') as HTMLElement;

// TODO: using hydrate collides with BrowserRouter
const root = createRoot(container);
const data = (window as any).__STATE__

root.render(
    <RouteDataProvider data={data}>
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </RouteDataProvider>
)
