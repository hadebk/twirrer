const functions = require('firebase-functions');

// init express server
const express = require('express');
const app = express();

const {
    db
} = require('./util/admin');

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
// TODO: Upload image with post
app.delete('/post/:postId/delete', firebaseAuth, deletePost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/post/:postId/comment', firebaseAuth, commentOnPost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/post/:postId/like', firebaseAuth, likePost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/post/:postId/unlike', firebaseAuth, unlikePost) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
// TODO: Add Friend

// user routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/uploadProfileImage', firebaseAuth, uploadProfileImage) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
// TODO: Upload Cover Image
app.post('/user/addUserDetails', firebaseAuth, addUserDetails) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/user/getAuthenticatedUser', firebaseAuth, getAuthenticatedUser) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.

/**
 * ****************************************************************
 * to tell firebase that app is the container of all routes
 * ****************************************************************
 */
exports.api = functions.region('europe-west3').https.onRequest(app);

/***********************************************************************************************************************
/***********************************************************************************************************************
 *                                          // Notifications //
 * To implement the notifications part, i use 'Firebase Database Triggers',
 * when any change occur to any collection some event will fire.
 * ex: when add like/comment to any post => notification collection will be updates automatically 'event will be fire!' 
 ***********************************************************************************************************************
 ***********************************************************************************************************************/

// 1- create notification when someone like any post
/**
 * snapshot: have data of sender
 * doc: have data of receiver's post
 */
exports.createNotificationOnLike = functions
    .region('europe-west3')
    .firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    //          receiver                    sender
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderProfilePicture: snapshot.data().profilePicture,
                        type: 'like',
                        read: false,
                        postId: doc.id
                    });
                }
            })
            .catch((err) => console.error(err));
    });

// 2- delete notification when someone unlike any post
exports.deleteNotificationOnUnLike = functions
    .region('europe-west3')
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
                return;
            });
    });

// 3- create notification when someone comment on any post
exports.createNotificationOnComment = functions
    .region('europe-west3')
    .firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderProfilePicture: snapshot.data().profilePicture,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });