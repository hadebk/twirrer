/**
 * ****************************************************************
 * helper functions
 * ****************************************************************
 */
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true
    else return false
}

const isEmpty = (string) => {
    if (string.trim() === "") return true; // string is either empty or has space only 
    else return false
}

/**
 * ****************************************************************
 * signup data validation
 * ****************************************************************
 */
exports.validateSignupData = (data) => {
    let errors = {}

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email'
    }

    if (isEmpty(data.password) || data.password.length < 6) errors.password = 'Must be 6 char or more'

    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be match'

    if (isEmpty(data.userName)) errors.userName = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

/**
 * ****************************************************************
 * login data validation
 * ****************************************************************
 */
exports.validateLoginData = (data) => {
    let errors = {}

    if (isEmpty(data.email)) errors.email = 'Must not be empty'
    if (isEmpty(data.password)) errors.password = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}