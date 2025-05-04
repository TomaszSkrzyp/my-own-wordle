// src/csrf/CsrfContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CsrfContext = createContext();

export const CsrfProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/csrf-token', {
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data);
                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.error('Failed to fetch CSRF token', err);
            }
        };

        fetchCsrfToken();
    }, []);

    return (
        <CsrfContext.Provider value={{ csrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
};
