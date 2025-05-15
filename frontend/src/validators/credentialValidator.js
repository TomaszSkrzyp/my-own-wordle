/*
Validate a username string.

Ensures the username is 3–20 characters long and contains
only letters, digits, or underscores.
*/
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}
/*
Validate a password string.

Requires at least 8 characters, including one lowercase letter,
one uppercase letter, one digit, and one special character.
*/
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
}
/*
Validate an email address format.

Checks presence of `@`, reasonable length, and a basic email regex.
*/
function validateEmail(email) {
    if (!email || email.length > 150 || !email.includes('@')) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
export { validateEmail, validatePassword, validateUsername };
