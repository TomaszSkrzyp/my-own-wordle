

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CsrfProvider } from './csrf/CsrfContext';

import App from './pages/App';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import UserHome from './pages/UserHome';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CsrfProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<App />} />

                <Route path="/profile" element={<UserHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                </Routes>
        </BrowserRouter>
    </CsrfProvider>
);

