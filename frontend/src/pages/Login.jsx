import { React, useContext,useEffect    } from 'react';
import { useNavigate} from 'react-router-dom';
import { CsrfContext } from '../csrf/CsrfContext';
import { validatePassword, validateUsername } from '../validators/credentialValidator.js';

import { checkProperVisit } from '../helpers/checkProper.js';
import '../styling/authStyles.css';

const Login = () => {
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext); 
    useEffect(() => {
        if (!csrfToken) {
              return;
        }
         
         
        const initialize = async () => {
            await checkProperVisit(navigate, refreshCsrfToken);
        }
        initialize();
    }, [csrfToken]);
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior

        // Collect form data
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate the form data
        if (!validateUsername(username) || !validatePassword(password)) {
            alert('Invalid username or password.');
            return;
        }

        try {
            // Perform the login request
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
                











                navigate('/profile');
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            console.error("Login error:", err);
            alert('An error occurred while trying to log in.');
        }
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
