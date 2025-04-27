import React from 'react';
import { useNavigate } from 'react-router-dom';
import  {  validatePassword, validateUsername } from '../validators/credentialValidator.js';
import '../styling/authStyles.css';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        console.log(username);
        if (!validateUsername(username) || !validatePassword(password)) {
            alert('Invalid username or password.');
            return;
        }
        
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',

                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.ok) {
               
                navigate('/game'); // Login successful
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Login failed');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="auth-page">
            <h1>Login</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input type="text" id="username" placeholder="Username" required />
                <input type="password" id="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <button className="secondary-button" onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Login;
