// src/csrf/CsrfContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CsrfContext = createContext();

/*
  Provides CSRF protection context to children components.
  Fetches and stores the CSRF token for use in secure API requests.
 */
export const CsrfProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);

    /*
      useEffect runs once when the component mounts.
      It initiates the first fetch of the CSRF token from the server.
     */
    useEffect(() => {
        fetchCsrfToken();
    }, []);

    /*
      Fetches a CSRF token from the backend and stores it in state.
      Called on initial load and when refreshing the token.
     */
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
    /*
      Manually refreshes the CSRF token by calling fetchCsrfToken again.
      Useful after login, logout, or certain session events.
     */
    const refreshCsrfToken = async () => {
        await fetchCsrfToken();
    };

    return (
        <CsrfContext.Provider value={{ csrfToken, refreshCsrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
};