// src/csrf/CsrfContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CsrfContext = createContext();

export const CsrfProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);

    // Fetch the CSRF token initially when the app mounts
    useEffect(() => {
        fetchCsrfToken();
    }, []);

    // function to fetch CSRF token from the backend
    const fetchCsrfToken = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/csrf-token', {
                credentials: 'include', 
            });
            const data = await response.json();
            setCsrfToken(data.csrfToken);





        } catch (err) {
            console.error('Failed to fetch CSRF token:', err);
        }
    };

    const refreshCsrfToken = async () => {
        await fetchCsrfToken();
    };

    return (
        <CsrfContext.Provider value={{ csrfToken, refreshCsrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
};