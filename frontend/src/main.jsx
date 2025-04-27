

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './apps/App';
import Home from './apps/Home';

import Register from './apps/Register';
import Login from './apps/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<App />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
);

