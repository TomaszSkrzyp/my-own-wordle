const checkProperVisit = async (navigate, refreshCsfr) => {
    console.log("STARTING CHECK");
    try {
        const response = await fetch('http://localhost:5000/api/login/checkIfAllowed', {
            method: 'GET',
            credentials: 'include',
        });
        console.log("ENDING CHECK");

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