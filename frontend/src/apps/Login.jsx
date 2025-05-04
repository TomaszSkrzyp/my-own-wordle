import { React, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { CsrfContext } from '../csrf/CsrfContext';
import  {  validatePassword, validateUsername } from '../validators/credentialValidator.js';
import '../styling/authStyles.css';

const Login = () => {
    const navigate = useNavigate();
    const { csrfToken } = useContext(CsrfContext); 
    const handleSubmit = async (e) => {

        handleLogout();
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
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
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
    const handleLogout = async () => {
        await fetch('http://localhost:5000/api/login/logout', {
            method: 'POST',
            credentials: 'include'
        });


    };
    const handleRegister = () => {
        navigate('/register');
    };
    const handleGoBack = () => {
        navigate(-1); 
    };
    
    return (
        <div className="login">
        <button className = "go-back-button" onClick = {handleGoBack } > Go Back</button >
        <div className="auth-page">
            <h1>Login</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input type="text" id="username" placeholder="Username" required />
                <input type="password" id="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <button className="secondary-button" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
};

export default Login;
