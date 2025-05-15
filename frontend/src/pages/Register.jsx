/*
  Register Component - Handles new user registration.
  - Collects username, email, and password inputs.
  - Performs frontend validation on inputs.
  - Sends POST request to backend to create a new user.
  - Displays success or error alerts based on server response.
  - Allows navigation back or to the login page.
*/
const Register = () => {
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext);

    /*
      useEffect - Runs when csrfToken changes.
      Checks if the visit/session is valid by calling checkProperVisit.
      Redirects or refreshes CSRF token as necessary.
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
      handleSubmit - Handles the form submission event.
      Prevents default form action.
      Collects input values and validates them.
      If valid, sends registration request to backend.
      Shows alerts for success or failure.
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gather form data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate inputs
        if (!validateUsername(username)) {
            alert('Username must be 3-20 characters long and can only contain letters, numbers, and underscores.');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            return;
        }

        try {
            // Send registration data to backend API
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
                handleLogin();  // Redirect to login page after successful registration
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred during registration');
        }
    };

    /*
      handleLogin - Navigates user to login page.
    */
    const handleLogin = () => {
        navigate('/login');
    };

    /*
      handleGoBack - Navigates user back to the previous page.
    */
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
