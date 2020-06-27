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
    uploadCoverImage,
    uploadPostImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsAsRead
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

// user routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/uploadProfileImage', firebaseAuth, uploadProfileImage) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/user/uploadCoverImage', firebaseAuth, uploadCoverImage) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/uploadPostImage', firebaseAuth, uploadPostImage) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.post('/user/addUserDetails', firebaseAuth, addUserDetails) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/user/getAuthenticatedUser', firebaseAuth, getAuthenticatedUser) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.get('/user/:userName', getUserDetails)
app.post('/notifications', firebaseAuth, markNotificationsAsRead) // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
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
 * 
   snapshot.data() = 
        {
            "userName": "user",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/431236775041.png?alt=media",
            "createdAt": "2020-06-27T10:34:07.671Z",
            "postId": "ZVB7IMT19I58z5LFcfEr",
            "commentContent": "hello!"
        }
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
                        postId: doc.id
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });

// 4- when user update his profile image => then update it in posts, likes and comments collections
exports.onUserImageChange = functions
    .region('europe-west3')
    .firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().profilePicture !== change.after.data().profilePicture) {
            console.log('image has changed');
            const batch = db.batch();
            // update profile image in posts collection
            return db
                .collection('posts')
                .where('userName', '==', change.before.data().userName)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const post = db.doc(`/posts/${doc.id}`);
                        batch.update(post, {
                            profilePicture: change.after.data().profilePicture
                        });
                    });
                    return db
                        .collection('likes')
                        .where('userName', '==', change.before.data().userName)
                        .get();
                })
                // update profile image in likes collection
                .then((data) => {
                    data.forEach((doc) => {
                        const like = db.doc(`/likes/${doc.id}`);
                        batch.update(like, {
                            profilePicture: change.after.data().profilePicture
                        });
                    });
                    return db
                        .collection('comments')
                        .where('userName', '==', change.before.data().userName)
                        .get();
                })
                // update profile image in comments collection
                .then((data) => {
                    data.forEach((doc) => {
                        const comment = db.doc(`/comments/${doc.id}`);
                        batch.update(comment, {
                            profilePicture: change.after.data().profilePicture
                        });
                    });
                    return db
                        .collection('notifications')
                        .where('sender', '==', change.before.data().userName)
                        .get();
                })
                // update profile image in notifications collection
                .then((data) => {
                    data.forEach((doc) => {
                        const notification = db.doc(`/notifications/${doc.id}`);
                        batch.update(notification, {
                            senderProfilePicture: change.after.data().profilePicture
                        });
                    });
                    return batch.commit();
                })
        } else return true;
    });

// 5- when delete a post delete all likes, comments and notifications on this post
//TODO: delete image of this post from storage
exports.onPostDelete = functions
    .region('europe-west3')
    .firestore.document('/posts/{postId}')
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = db.batch();
        return db
            .collection('comments')
            .where('postId', '==', postId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db
                    .collection('likes')
                    .where('postId', '==', postId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                });
                return db
                    .collection('notifications')
                    .where('postId', '==', postId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                });
                return batch.commit();
            })
            .catch((err) => console.error(err));
    });