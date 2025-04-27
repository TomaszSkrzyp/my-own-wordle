document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login data to the server using fetch
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Send the data in the request body
    })
        .then(response => {
            if (response.redirected) {
                // If the server responds with a redirect, handle it
                window.location.href = response.url;  // Follow the redirect
            } else {
                return response.json();  // Process failure message
            }
        })
        .then(data => {
            if (data && !data.success) {
                // If login fails, show an error message
                alert(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred');
        });
});
