import { React, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CsrfContext } from '../csrf/CsrfContext';
import '../styling/authStyles.css';

import { validatePassword, validateUsername,validateEmail } from '../validators/credentialValidator.js';



const Register = () => {
    const navigate = useNavigate();
    const { csrfToken } = useContext(CsrfContext); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Frontend validation
        if (!validateUsername(username)) {
            alert('"Username must be 3-20 characters long and can only contain letters, numbers, and underscores.');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/login/register', {
                method: 'POST',

                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ username, email, password }),

            });

            const data = await res.json();
            

            if (res.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred during registration');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="register">
        <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
        <div className="auth-page">
            <h1>Register</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input type="text" id="username" placeholder="Username" required />
                <input type="email" id="email" placeholder="Email" required />
                <input type="password" id="password" placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
            </div>
        </div>
    );
};

export default Register;
