// Helper function to check if two date strings represent the same calendar day.
function isSameDate(dateString1, dateString2) {
    const date1 = new Date(dateString1).toISOString().split('T')[0]; // Extract YYYY-MM-DD
    const date2 = new Date(dateString2).toISOString().split('T')[0];
    return date1 === date2;
}

export { isSameDate };
