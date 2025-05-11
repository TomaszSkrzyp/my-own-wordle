// helper function to check if the date is today
function isSameDate(dateString1, dateString2) {
    console.log("DATES");
    console.log(dateString1);
    console.log(dateString2);
    const date1 = new Date(dateString1).toISOString().split('T')[0];
    const date2 = new Date(dateString2).toISOString().split('T')[0];
    console.log("DATES");
    console.log(date1);
    console.log(date2);
    return date1 === date2;
}
export {isSameDate }