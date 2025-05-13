import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/homeStyles.css';

import { allowPlayerToContinue } from '../helpers/allowPlayer.js';
import { CsrfContext } from '../csrf/CsrfContext';

const Home = () => {
    const navigate = useNavigate();
    const { csrfToken } = useContext(CsrfContext);
    useEffect(() => {
        if (!csrfToken) {
             return;
        }
        
        
    }, [csrfToken]);

    

    // Handle Play as Guest
    const handleGuestPlay = async () => {
        const response = await allowPlayerToContinue(csrfToken);
        if (response && response.ok) {
            navigate('/game'); // redirect to the game page
        } else {
            alert('Failed to start guest session.');
        }
    };

    // Handle Login
    const handleLogin = async () => {
        const response = await allowPlayerToContinue(csrfToken);
        if (response && response.ok) {
            navigate('/login'); // redirect to login page
        } else {
            alert('Failed to start login session.');
        }
    };

    return (
        <div className="home">
            <h1>Welcome to Wordle</h1>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleGuestPlay}>Play as Guest</button>
        </div>
    );
};

export default Home;
