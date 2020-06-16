const {
    db
} = require('../util/admin');

// firebase init
const firebase = require('firebase');
const config = require('../util/config');
firebase.initializeApp(config)

// import validators
const {
    validateSignupData,
    validateLoginData
} = require('../util/validators');

/**
 * ****************************************************************
 * signup function
 * ****************************************************************
 */
exports.signup = (req, res) => {
    let userIdToken, userId;

    const newUser = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    // input validators
    const {
        errors,
        valid
    } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors)

    // to make user name unique
    db.doc(`/users/${newUser.userName}`).get()
        .then(doc => {
            if (doc.exists) {
                // code 400 => client error
                return res.status(400).json({
                    userName: 'this user name is already taken'
                })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => { // if you get here, means the user was created 
            // get access token of the user that has been created
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            // return token
            userIdToken = token
            const userCredential = {
                userName: newUser.userName,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            // create new record to this new user in database in users table
            return db.doc(`/users/${newUser.userName}`).set(userCredential);
        })
        .then(() => {
            // code 201 => recurse created successfully
            return res.status(201).json({
                "userToken": userIdToken
            });
        })
        .catch(error => {
            console.log(error);
            if (error.code === "auth/email-already-in-use") {
                return res.status(400).json({
                    email: 'Email is already in use'
                })
            } else {
                return res.status(500).json({
                    error: error.code
                })
            }
        })
}

/**
 * ****************************************************************
 * login function
 * ****************************************************************
 */
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    // input validators
    const {
        errors,
        valid
    } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors)

    // login the user
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            // login is done => retrieve the token
            return res.status(201).json({
                "userToken": token
            });
        })
        .catch(error => {
            console.log(error);
            if (error.code === "auth/wrong-password") {
                // code 403 => unauthorized user
                return res.status(403).json({
                    "general": "Wrong credentials, please try again."
                })
            } else return res.status(500).json({
                error: error.code
            })
        })
}