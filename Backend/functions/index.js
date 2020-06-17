const functions = require('firebase-functions');

// init express server
const express = require('express');
const app = express();

// import operations of the routes
const {
    getAllPosts,
    addNewPost,
    getOnePost,
    commentOnPost
} = require('./handlers/posts');
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require('./handlers/users');

// import middleware authentication
const firebaseAuth = require('./util/firebaseAuth');

/**
 * ****************************************************************
 * all routes in our app
 * ****************************************************************
 */
// posts routes
app.get('/getAllPosts', getAllPosts)
app.get('/post/:postId', getOnePost);
app.post('/post/:postId/comment', firebaseAuth, commentOnPost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/addNewPost', firebaseAuth, addNewPost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
// TODO: Delete Post
// TODO: Like a Post
// TODO: Unlike a Post
// DONE: Comment on Post
// TODO: Add Friend
// TODO: Upload Cover Image

// user routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/uploadProfileImage', firebaseAuth, uploadImage) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/user/addUserDetails', firebaseAuth, addUserDetails) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/user/getAuthenticatedUser', firebaseAuth, getAuthenticatedUser) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.

/**
 * ****************************************************************
 * to tell firebase that app is the container of all routes
 * ****************************************************************
 */
exports.api = functions.region('europe-west3').https.onRequest(app);