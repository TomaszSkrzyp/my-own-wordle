
// function to allow the user to continue using the app. A way to ensure the user uses a proper route
const allowPlayerToContinue = async (csrfToken) => {
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
export { allowPlayerToContinue };