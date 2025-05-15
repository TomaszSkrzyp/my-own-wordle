
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CsrfProvider } from './csrf/CsrfContext';

import App from './pages/App';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import UserHome from './pages/UserHome';

/*
  Entry point of the React application.
  - Uses ReactDOM to render the root component into the HTML.
  - Wraps the entire app with CsrfProvider to provide CSRF token context globally.
  - Uses BrowserRouter to enable client-side routing.
  - Defines routes for key pages:
      "/"         -> Home page (landing)
      "/game"     -> Main game component
      "/profile"  -> User profile/dashboard page
      "/login"    -> Login page
      "/register" -> User registration page
  This setup is crucial to manage navigation and provide security context (CSRF tokens)
  throughout the app, ensuring smooth user experience and safe API interactions.
*/

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
