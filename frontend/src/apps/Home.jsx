import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/homeStyles.css'; 

const Home= () => {
    const navigate = useNavigate();

    const handleGuestPlay = () => {
        navigate('/game');
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
