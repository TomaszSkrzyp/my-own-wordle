/* 
Function to check if the user accessed a route properly.
 If not, redirects them to the home page.
 */
const checkProperVisit = async (navigate, refreshCsfr) => {
    try {
        const response = await fetch('http://localhost:5000/api/login/checkIfAllowed', {
            method: 'GET',
            credentials: 'include',
        });
         
        // It means that the user is not allowed to be on this page since they did not visit home page first
        if (response.status === 403) {
            console.warn("Access denied. Redirecting to home.");
            await refreshCsfr();
            navigate('/');
        }
    } catch (err) {
        console.error("Fetch failed in checkProperVisit:", err);
    }
}
export {checkProperVisit }