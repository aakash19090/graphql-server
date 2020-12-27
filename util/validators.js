// User Register Validation

module.exports.validateRegisterInputs = (
    username,
    email,
    password,
    confirmPassword
) => {

    const errors = {};

    if (username.trim() === '') {
        errors.username = "Username Can't be empty!"
    }

    if (email.trim() === '') {
        errors.email = "Email can't be empty!"
    } else {
        const email_regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(email_regex)) {
            errors.email = "Invalid email address!"
        }
    }

    if (password === '') {
        errors.password = "Password can't be empty!"
    } else if (password !== confirmPassword) {
        errors.password = "Passwords don't match!"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

}

// User Login Validation

module.exports.validateLoginInputs = (username, password) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = "Username Can't be empty!"
    }

    if (password.trim() === '') {
        errors.password = "Password can't be empty!"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

}