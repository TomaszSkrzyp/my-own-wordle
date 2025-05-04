
import React, { createContext, useState, useEffect } from 'react';

export const CsrfContext = createContext('');

export function CsrfProvider({ children }) {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('http://localhost:5000/api/csrf-token', {
        credentials: 'include'
      });
      const { csrfToken } = await res.json();
      setCsrfToken(csrfToken);
    })();
  }, []);

  return (
    <CsrfContext.Provider value={csrfToken}>
      {children}
    </CsrfContext.Provider>
  );
}
