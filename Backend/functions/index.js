const functions = require("firebase-functions");
const { db, admin } = require("./util/admin");
const express = require("express");
const cors = require("cors");
const usersRouter = require("./routers/users");
const postsRouter = require("./routers/posts");

// init express server
const app = express();

// fix cross origin problem. Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Register app routers
app.use(postsRouter);
app.use(usersRouter);

const defaultStorage = admin.storage();

/**
 * ****************************************************************
 * to tell firebase that app is the container of all routes
 * ****************************************************************
 */
//exports.api = functions.region("europe-west3").https.onRequest(app);

/***********************************************************************************************************************
 ***********************************************************************************************************************
 *                                          // Notifications //
 * 
 * To implement the notifications part, i use 'Firebase Database Triggers',
 * when any change occur to any collection some event will fire.
 * ex: when add like/comment to any post => notification collection will be updates automatically 'event will be fire!' 
 * snapshot: have data of => firestore.document('likes/{id}' or 'comments/{id}' or ...) 
 * doc: have data of query
 * ex: snapshot of comments => 
 * snapshot.data() = 
    {
        "userName": "user",
        "profilePicture": "https://firebasestorage.googleapis.com/v0/b/twirrer-app.appspot.com/o/431236775041.png?alt=media",
        "createdAt": "2020-06-27T10:34:07.671Z",
        "postId": "ZVB7IMT19I58z5LFcfEr",
        "commentContent": "hello!"
    }
***********************************************************************************************************************
***********************************************************************************************************************/
/*
// 1- create notification when someone like any post
exports.createNotificationOnLike = functions
  .region("europe-west3")
  .firestore.document("likes/{id}")
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
            type: "like",
            read: false,
            postId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

// 2- delete notification when someone unlike any post
exports.deleteNotificationOnUnLike = functions
  .region("europe-west3")
  .firestore.document("likes/{id}")
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
  .region("europe-west3")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().userName !== snapshot.data().userName) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userName,
            sender: snapshot.data().userName,
            senderProfilePicture: snapshot.data().profilePicture,
            type: "comment",
            read: false,
            postId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// 4- when user update his profile image => delete old profile picture,
// then update it in posts, likes, comments, notifications and friends and  collections
exports.onUserImageChange = functions
  .region("europe-west3")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (
      change.before.data().profilePicture !== change.after.data().profilePicture
    ) {
      console.log("image has changed");
      // delete old profile picture, except 'default_pp.png'
      let imageUrl = change.before.data().profilePicture;
      let imageName = imageUrl.substr(
        imageUrl.indexOf("/o/") + 3,
        imageUrl.indexOf("?") - (imageUrl.indexOf("/o/") + 3)
      );
      console.log(imageName);
      if (imageName !== "default_pp.png") {
        let bucket = defaultStorage.bucket();
        file = bucket.file(imageName);
        file.delete();
      }
      const batch = db.batch();
      // update profile image in posts collection
      return (
        db
          .collection("posts")
          .where("userName", "==", change.before.data().userName)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              const post = db.doc(`/posts/${doc.id}`);
              batch.update(post, {
                profilePicture: change.after.data().profilePicture,
              });
            });
            return db
              .collection("likes")
              .where("userName", "==", change.before.data().userName)
              .get();
          })
          // update profile image in likes collection
          .then((data) => {
            data.forEach((doc) => {
              const like = db.doc(`/likes/${doc.id}`);
              batch.update(like, {
                profilePicture: change.after.data().profilePicture,
              });
            });
            return db
              .collection("comments")
              .where("userName", "==", change.before.data().userName)
              .get();
          })
          // update profile image in comments collection
          .then((data) => {
            data.forEach((doc) => {
              const comment = db.doc(`/comments/${doc.id}`);
              batch.update(comment, {
                profilePicture: change.after.data().profilePicture,
              });
            });
            return db
              .collection("notifications")
              .where("sender", "==", change.before.data().userName)
              .get();
          })
          // update profile image in notifications collection
          .then((data) => {
            data.forEach((doc) => {
              const notification = db.doc(`/notifications/${doc.id}`);
              batch.update(notification, {
                senderProfilePicture: change.after.data().profilePicture,
              });
            });
            return db.collection("friends").get();
          })
          // update profile image in friends collection
          .then((data) => {
            // data contain all documents, loop on all doc
            data.forEach((doc) => {
              // loop on all fields in doc
              for (key in doc.data()) {
                // @value: contain data of each field.
                var value = doc.data()[key];
                if (value.userName == change.before.data().userName) {
                  db.collection("friends")
                    .doc(doc.id)
                    .update({
                      [`${value.userName}.profilePicture`]: change.after.data()
                        .profilePicture,
                    });
                }
              }
            });
            return batch.commit();
          })
      );
    } else return true;
  });

// 5- when user update his cover image => delete old cover image from storage
exports.onUserCoverImageChange = functions
  .region("europe-west3")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (
      change.before.data().coverPicture !== change.after.data().coverPicture
    ) {
      console.log("cover picture has changed");
      // delete old cover picture, except 'default_cp.png'
      let imageUrl = change.before.data().coverPicture;
      let imageName = imageUrl.substr(
        imageUrl.indexOf("/o/") + 3,
        imageUrl.indexOf("?") - (imageUrl.indexOf("/o/") + 3)
      );
      console.log(imageName);
      if (imageName !== "default_cp.png") {
        let bucket = defaultStorage.bucket();
        file = bucket.file(imageName);
        return file.delete();
      } else return true;
    } else return true;
  });

// 6- when delete a post delete all likes, comments and notifications on this post
exports.onPostDelete = functions
  .region("europe-west3")
  .firestore.document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("postId", "==", postId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("postId", "==", postId)
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

// 7- when delete a post > delete image of this post from storage
exports.removePostImageOnPostDelete = functions
  .region("europe-west3")
  .firestore.document("posts/{postId}")
  .onDelete((snap, context) => {
    let imageUrl = snap.data().postImage;
    if (imageUrl) {
      let imageName = imageUrl.substr(
        imageUrl.indexOf("/o/") + 3,
        imageUrl.indexOf("?") - (imageUrl.indexOf("/o/") + 3)
      );
      console.log(snap.data(), imageName);
      let bucket = defaultStorage.bucket();
      file = bucket.file(imageName);
      return file.delete();
    }
  });
*/
