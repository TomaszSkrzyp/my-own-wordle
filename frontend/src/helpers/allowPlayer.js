/*
Function to allow the user to continue using the app.
It ensures the user uses a proper route and initiates session handling.
*/
const allowPlayerToContinue = async (csrfToken) => {
    
    
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
        
        
        if (response.ok) {
            
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