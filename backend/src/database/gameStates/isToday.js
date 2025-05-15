/*
Determines whether a given date falls on today’s calendar date.

    Compares year, month, and day components to the current system date.
*/
const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};
export default isToday;