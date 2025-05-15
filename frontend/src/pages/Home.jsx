import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/homeStyles.css';

import { allowPlayerToContinue } from '../helpers/allowPlayer.js';
import { CsrfContext } from '../csrf/CsrfContext';

/* 
  Home Component - Landing page for the Wordle app.
  Provides users with options to either play as a guest or log in.
  Uses CSRF token context to ensure secure backend interactions.
  Redirects users to the appropriate pages based on their choice.
*/
const Home = () => {
    const navigate = useNavigate();
    const { csrfToken } = useContext(CsrfContext);

    /*
     useEffect - React hook that triggers when csrfToken changes.
     Placeholder for any initialization or setup needed once the CSRF token is available.
    */
    useEffect(() => {
        if (!csrfToken) {
            return;
        }
        // Future setup logic can be added here
    }, [csrfToken]);

    /*
     handleGuestPlay - Starts a guest session by calling allowPlayerToContinue API.
     On success, navigates the user to the main game page.
     On failure, shows an alert notifying the user.
    */
    const handleGuestPlay = async () => {
        const response = await allowPlayerToContinue(csrfToken);
        if (response && response.ok) {
            navigate('/game'); // Redirect to game page for guest play
        } else {
            alert('Failed to start guest session.');
        }
    };

    /*
     handleLogin - Initiates login session by calling allowPlayerToContinue API.
     On success, navigates to the login page.
     On failure, shows an alert notifying the user.
    */
    const handleLogin = async () => {
        const response = await allowPlayerToContinue(csrfToken);
        if (response && response.ok) {
            navigate('/login'); // Redirect to login page
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
