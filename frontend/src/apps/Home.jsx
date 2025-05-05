import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/homeStyles.css'; 
import { CsrfContext } from '../csrf/CsrfContext';

const Home= () => {
    const navigate = useNavigate();

    const { csrfToken } = useContext(CsrfContext);
    const handleGuestPlay = async () => {
        const response = await fetch('http://localhost:5000/api/login/guest', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
        });

        if (response.ok) {
            navigate('/game');
        } else {
            alert('Failed to start guest session.');
        }
    };

    const handleLogin = () => {
        navigate('/login');
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
