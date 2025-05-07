import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/homeStyles.css';
import { CsrfContext } from '../csrf/CsrfContext';

const Home = () => {
    const navigate = useNavigate();
    const { csrfToken } = useContext(CsrfContext);
    useEffect(() => {
        if (!csrfToken) {
            console.log("FAILED"); return;
        }
        console.log("CSRF:");
        console.log(csrfToken);
    }, [csrfToken]);

    // function to allow the user to continue using the app. A way to ensure the user uses a proper route
    const allowUserToContinue = async () => {
        console.log("TOKEN:");
        console.log(csrfToken);
        try {
            const response = await fetch('http://localhost:5000/api/login/allow', {
                method: 'POST',
                credentials: 'include', // Ensure the session cookie is sent with the request
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
            });

            const data = await response.json();
            console.log("DATA");
            console.log(data);
            if (response.ok) {
                console.log("User is allowed to continue:", data.success);
                return response;
            } else {
                console.error("Error allowing user to continue:", data.error);
                return null;
            }
        } catch (error) {
            console.error("Error making the request to /allow:", error);
            return null;
        }
    };

    // Handle Play as Guest
    const handleGuestPlay = async () => {
        const response = await allowUserToContinue();
        if (response && response.ok) {
            navigate('/game'); // redirect to the game page
        } else {
            alert('Failed to start guest session.');
        }
    };

    // Handle Login
    const handleLogin = async () => {
        const response = await allowUserToContinue();
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
