import { React, useContext,useEffect    } from 'react';
import { useNavigate} from 'react-router-dom';
import { CsrfContext } from '../csrf/CsrfContext';
import { validatePassword, validateUsername } from '../validators/credentialValidator.js';

import { checkProperVisit } from '../helpers/checkProper.js';
import '../styling/authStyles.css';
/* 
  Login Component - Handles user authentication by providing a login form.
  - Presents input fields for username and password.
  - Validates input before submitting.
  - Sends credentials to backend API for authentication.
  - On success, redirects the user to their profile page.
  - Allows navigation to registration or to go back to the previous page.
*/
const Login = () => {
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext);

    /*
      useEffect - Runs when csrfToken changes.
      Ensures that the user has a proper visit/session by calling checkProperVisit.
      Redirects or refreshes token as needed.
    */
    useEffect(() => {
        if (!csrfToken) {
            return;
        }

        const initialize = async () => {
            await checkProperVisit(navigate, refreshCsrfToken);
        };
        initialize();
    }, [csrfToken]);

    /*
      handleSubmit - Handles form submission for login.
      Prevents default form behavior, validates inputs,
      sends login request to backend,
      handles success or error responses.
    */
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission

        // Retrieve form input values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate username and password before sending
        if (!validateUsername(username) || !validatePassword(password)) {
            alert('Invalid username or password.');
            return;
        }

        try {
            // Send POST request with credentials and CSRF token
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
                // Login successful: navigate to profile page
                navigate('/profile');
            } else {
                // Show backend error message or generic failure alert
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            // Catch network or unexpected errors
            console.error("Login error:", err);
            alert('An error occurred while trying to log in.');
        }
    };

    /*
      handleRegister - Navigates user to the registration page.
    */
    const handleRegister = () => {
        navigate('/register');
    };

    /*
      handleGoBack - Navigates back to the previous page in history.
    */
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="login">
            <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
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
