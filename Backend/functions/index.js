const functions = require('firebase-functions');

// init express server
const express = require('express');
const app = express();

// import operations of the routes
const {
    getAllPosts,
    addNewPost,
    deletePost,
    getOnePost,
    commentOnPost,
    likePost,
    unlikePost
} = require('./handlers/posts');
const {
    signup,
    login,
    uploadProfileImage,
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
app.get('/post/:postId/get', getOnePost);
app.post('/addNewPost', firebaseAuth, addNewPost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.delete('/post/:postId/delete', firebaseAuth, deletePost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/post/:postId/comment', firebaseAuth, commentOnPost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/post/:postId/like', firebaseAuth, likePost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/post/:postId/unlike', firebaseAuth, unlikePost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.

// TODO: Add Friend
// TODO: Upload Cover Image

// user routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/uploadProfileImage', firebaseAuth, uploadProfileImage) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/user/addUserDetails', firebaseAuth, addUserDetails) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/user/getAuthenticatedUser', firebaseAuth, getAuthenticatedUser) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.

/**
 * ****************************************************************
 * to tell firebase that app is the container of all routes
 * ****************************************************************
 */
exports.api = functions.region('europe-west3').https.onRequest(app);