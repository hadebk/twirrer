const {
    db,
    admin
} = require('../util/admin');

// firebase init
const firebase = require('firebase');
const config = require('../util/config');
firebase.initializeApp(config)

// import validators
const {
    validateSignupData,
    validateLoginData,
    reduceUserDetails
} = require('../util/validators');
const e = require('express');
const {
    user
} = require('firebase-functions/lib/providers/auth');

/**
 * ****************************************************************
 * signup function
 * ****************************************************************
 */
exports.signup = (req, res) => {
    let userIdToken, userId;

    let defaultProfilePicture = 'default_pp.png';
    let defaultCoverPicture = 'default_cp.png';

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
                friendsCount: 0,
                profilePicture: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfilePicture}?alt=media`,
                coverPicture: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultCoverPicture}?alt=media`,
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
                    general: 'Something went wrong, please try again'
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
            // code 403 => unauthorized user
            // auth/wrong-password
            // auth/user-not-found
            return res.status(403).json({
                "general": "Wrong credentials, please try again."
            })
        });
};

/**
 * ****************************************************************
 * upload user profile picture
 * ****************************************************************
 */
exports.uploadProfileImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({
        headers: req.headers
    });

    let imageToBeUploaded = {};
    let imageFileName;
    // String for image token
    //let generatedToken = uuid();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        // handle upload file type, must by image format only!
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            // wrong file format!
            return res.status(400).json({
                error: "Wrong file type submitted"
            });
        }
        // ex: my.image.png => ['my', 'image', 'png'] => imageExtension = 'png'
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // ex: imageFileName = 51546132131561.png
        imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;
        // get file path
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {
            filepath,
            mimetype
        };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
        // here will upload the file
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                        //Generate token to be appended to imageUrl
                        //firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
            .then(() => {
                // Append token to url
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                // override default profile picture with uploaded picture 'uploaded by user'
                return db.doc(`/users/${req.user.userName}`).update({
                    profilePicture: imageUrl
                });
            })
            .then(() => {
                return res.json({
                    message: "Profile picture uploaded successfully"
                });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    error: "something went wrong"
                });
            });
    });
    busboy.end(req.rawBody);
};

/**
 * ****************************************************************
 * upload user cover picture
 * ****************************************************************
 */
exports.uploadCoverImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({
        headers: req.headers
    });

    let imageToBeUploaded = {};
    let imageFileName;
    // String for image token
    //let generatedToken = uuid();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        // handle upload file type, must by image format only!
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            // wrong file format!
            return res.status(400).json({
                error: "Wrong file type submitted"
            });
        }
        // ex: my.image.png => ['my', 'image', 'png'] => imageExtension = 'png'
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // ex: imageFileName = 51546132131561.png
        imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;
        // get file path
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {
            filepath,
            mimetype
        };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
        // here will upload the file
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                        //Generate token to be appended to imageUrl
                        //firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
            .then(() => {
                // Append token to url
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                // override default profile picture with uploaded picture 'uploaded by user'
                return db.doc(`/users/${req.user.userName}`).update({
                    coverPicture: imageUrl
                });
            })
            .then(() => {
                return res.json({
                    message: "Cover picture uploaded successfully"
                });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    error: "something went wrong"
                });
            });
    });
    busboy.end(req.rawBody);
};

/**
 * ****************************************************************
 * upload image to post
 * ****************************************************************
 */
exports.uploadPostImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({
        headers: req.headers
    });

    let imageToBeUploaded = {};
    let imageFileName;
    // String for image token
    //let generatedToken = uuid();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        // handle upload file type, must by image format only!
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            // wrong file format!
            return res.status(400).json({
                error: "Wrong file type submitted"
            });
        }
        // ex: my.image.png => ['my', 'image', 'png'] => imageExtension = 'png'
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // ex: imageFileName = 51546132131561.png
        imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;
        // get file path
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {
            filepath,
            mimetype
        };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
        // here will upload the file
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                        //Generate token to be appended to imageUrl
                        //firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
            .then(() => {
                // Append token to url
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                // override default profile picture with uploaded picture 'uploaded by user'
                return res.json({
                    postImage: imageUrl
                })
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    error: "something went wrong"
                });
            });
    });
    busboy.end(req.rawBody);
}

/**
 * ****************************************************************
 * add extra data to user record in db, (bio ,location, website)
 * ****************************************************************
 */
exports.addUserDetails = (req, res) => {
    // data validation
    let userDetails = reduceUserDetails(req.body);

    // db query to add this extra data to that user's record in db
    db.doc(`/users/${req.user.userName}`).update(userDetails)
        .then(() => {
            return res.json({
                message: 'Extra user details added successfully'
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error.code
            })
        })
}

/**
 * ****************************************************************
 * get data of current authenticated user (name, bio, pp, ets..)
 * ****************************************************************
 */
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.userName}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db
                    .collection("likes")
                    .where("userName", "==", req.user.userName)
                    .get();
            }
        })
        .then((data) => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });
            //return res.json(userData);
            return db
                .collection("notifications")
                .where("recipient", "==", req.user.userName)
                .orderBy("createdAt", "desc")
                .limit(10)
                .get();
        })
        .then((data) => {
            userData.notifications = [];
            data.forEach((doc) => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    senderProfilePicture: doc.data().senderProfilePicture,
                    createdAt: doc.data().createdAt,
                    postId: doc.data().postId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id,
                });
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: err.code
            });
        });
}

/**
 * ****************************************************************
 * get any user details (name, bio, pp, ets.. + posts of this user + friends of this user)
 * this data will be used when open any user profile
 * ****************************************************************
 */
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.userName}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data();
                return db
                    .collection("posts")
                    .where("userName", "==", req.params.userName)
                    .orderBy("createdAt", "desc")
                    .get();
            } else {
                return res.status(404).json({
                    error: "User not found"
                });
            }
        })
        .then((data) => {
            userData.posts = [];
            data.forEach((doc) => {
                userData.posts.push({
                    postContent: doc.data().postContent,
                    postImage: doc.data().postImage,
                    createdAt: doc.data().createdAt,
                    userName: doc.data().userName,
                    profilePicture: doc.data().profilePicture,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postId: doc.id,
                });
            });
            return db
                .doc(`/friends/${req.params.userName}`)
                .get();
        })
        .then((doc) => {
            userData.friends = [];
            if(doc.exists){
                userData.friends.push(doc.data())
            }
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: err.code
            });
        });
}

/**
 * *******************************************************************
 * when click on notifications icon => mark the notifications as read
 * *******************************************************************
 */
exports.markNotificationsAsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {
            read: true
        });
    });
    batch
        .commit()
        .then(() => {
            return res.json({
                message: "Notifications marked read"
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: err.code
            });
        });
};

/**
 * ****************************************************************
 * Add friend , just for authorized user.
 *                       // logic //
 * - check if this user, that will be added as friend exist or not.
 * - then check if this user have added this another user before or not.
 * - if not added before, this friend will be added to friends of this user in 'friends' collection.
 * ****************************************************************
 */
exports.addFriend = (req, res) => {
    // first, get friend (that would be added) of this user (would be to add another user)
    // to check if that user added before by this user or not
    const friendsOfAdderUser = db.doc(`/friends/${req.user.userName}`)

    // second, get the user, that this user want to add as friend
    // to check if this user exist or nit
    const userToBeAdded = db.doc(`/users/${req.params.userName}`);
    const userWantToAdd = db.doc(`/users/${req.user.userName}`);

    // have data that will be added to friends collection
    let userToBeAddedData = {};
    let userWantToAddData = {};

    // have all details of both users
    let userToBeAddedAllData;
    let userWantToAddAllData;

    let isUser = false

    userToBeAdded
        .get()
        .then((doc) => {
            if (doc.exists) {
                // the user that another user want to add is exist, coll! go ahead 
                // get user (to be added) data
                isUser = true;
                console.log(doc.data())
                userToBeAddedAllData = doc.data();
                userToBeAddedData.userName = doc.data().userName;
                userToBeAddedData.profilePicture = doc.data().profilePicture;
                console.log(userToBeAddedData)
                return friendsOfAdderUser.get();
            } else {
                return res.status(404).json({
                    error: 'user to be added not found'
                });
            }
        })
        .then((doc) => {
            // doc hold => all friends of adder user
            /**
             * ex: user
             *        |_ userName: user
             *        |_ profilePicture: 'url'
             */
            console.log('doc------', doc.get(req.params.userName))
            //              user 
            if (doc.get(req.params.userName) != null) {
                // user already added as friend 
                return res.status(400).json({
                    error: 'user already added'
                });
            } else {
                if (isUser && req.user.userName !== req.params.userName) {
                    // the user is exist, and the user not was added before > so add this user as friend

                    // add that user to friends of this user to friends collection in db
                    return db
                        .doc(`friends/${req.user.userName}`)
                        .set({
                             [req.params.userName]:userToBeAddedData
                        }, {
                            merge: true
                        })
                        .then(() => {
                            // increment friends count of added user
                            userToBeAddedAllData.friendsCount++;
                            return userToBeAdded.update({
                                friendsCount: userToBeAddedAllData.friendsCount
                            });
                        })
                        .then(() => {
                            // increment friends count of adder user
                            userWantToAdd.get()
                                .then((doc) => {
                                    userWantToAddData.userName = doc.data().userName;
                                    userWantToAddData.profilePicture = doc.data().profilePicture;
                                    return userWantToAddAllData = doc.data()
                                })
                                .then(() => {
                                    userWantToAddAllData.friendsCount++;
                                    return userWantToAdd.update({
                                        friendsCount: userWantToAddAllData.friendsCount
                                    });
                                })
                                .then(() => {
                                    // add this user to friends of that user to friends collection in db
                                    return db
                                        .doc(`friends/${req.params.userName}`)
                                        .set({
                                            [req.user.userName]:userWantToAddData
                                        }, {
                                            merge: true
                                        })
                                }).catch((err) => {
                                    console.error(err);
                                });
                        })
                        .then(() =>{
                            // fire notification when user add another user as friend
                            return db.collection('notifications').add({
                                createdAt: new Date().toISOString(),
                                recipient: req.params.userName,
                                sender: req.user.userName,
                                senderProfilePicture: req.user.profilePicture,
                                type: 'addFriend',
                                read: false
                            });
                        })
                        .then(() => {
                            return res.json({
                                userToBeAddedData
                            });
                        });
                } else {
                    res.json({
                        error: 'You cant add yourself!'
                    });
                }
            }

        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: err.code
            });
        });
}

/**
 * ****************************************************************
 *  Unfriend , just for authorized user.
 *                       // logic //
 * - check if this user, that will be unfriended exist or not. (more secure!)
 * - then check if this user have added this another user before or not.
 * - if added before, this friend will be removed from friends of this user in 'friends' collection.
 * ****************************************************************
 */
exports.unFriend = (req, res) => {
    // first, get friend (that would be deleted) of this user (would be to delete another user)
    // to check if that user added before by this user or not
    const friendsOfDeleterUser = db.doc(`/friends/${req.user.userName}`)

    // second, get the user, that this user want to delete
    // to check if this user exist or nit
    const userToBeDeleted = db.doc(`/users/${req.params.userName}`);
    const userWantToDelete = db.doc(`/users/${req.user.userName}`);

    // have all details of both users
    let userToBeDeletedAllData;
    let userWantToDeleteAllData;

    let isUser = false

    userToBeDeleted
        .get()
        .then((doc) => {
            if (doc.exists) {
                // the user that another user want to delete is exist, coll! go ahead 
                // get user (to be deleted) data
                isUser = true;
                console.log(doc.data())
                userToBeDeletedAllData = doc.data();
                return friendsOfDeleterUser.get();
            } else {
                return res.status(404).json({
                    error: 'user to be deleted not found'
                });
            }
        })
        .then((doc) => {
            // doc hold => all friends of deleter user
            /**
             * ex: user
             *        |_ userName: user
             *        |_ profilePicture: 'url'
             */
            //              user 
            //console.log('doc------', doc.get(req.params.userName))
            if (doc.get(req.params.userName) != null) {
                // user already added as friend 
                if (isUser) {
                    // the user is exist, and the user not was added before > so delete this user from friends
                    return db
                        .doc(`friends/${req.user.userName}`)
                        .update({
                            // delete that user from friends of this user
                            [req.params.userName]: admin.firestore.FieldValue.delete()
                        })
                        .then(() => {
                            return db
                                .doc(`friends/${req.params.userName}`)
                                .update({
                                    // delete this user from friends of that user
                                    [req.user.userName]: admin.firestore.FieldValue.delete()
                                })
                        })
                        .then(() => {
                            // decrement friends count of deleted user
                            userToBeDeletedAllData.friendsCount--;
                            return userToBeDeleted.update({
                                friendsCount: userToBeDeletedAllData.friendsCount
                            });
                        })
                        .then(() => {
                            // decrement friends count of deleter user
                            userWantToDelete.get()
                                .then((doc) => {
                                    return userWantToDeleteAllData = doc.data()
                                })
                                .then(() => {
                                    userWantToDeleteAllData.friendsCount--;
                                    return userWantToDelete.update({
                                        friendsCount: userWantToDeleteAllData.friendsCount
                                    });
                                })
                        })
                        .then(() =>{
                            // fire notification when user unfriend another user
                            return db.collection('notifications').add({
                                createdAt: new Date().toISOString(),
                                recipient: req.params.userName,
                                sender: req.user.userName,
                                senderProfilePicture: req.user.profilePicture,
                                type: 'unFriend',
                                read: false
                            });
                        })
                        .then(() => {
                            return res.json({
                                'Done': 'user deleted successfully'
                            });
                        });
                } else {
                    return res.json({
                        error: 'user not found also!'
                    });
                }
            } else {
                return res.status(400).json({
                    error: 'user not added before'
                });
            }

        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: err.code
            });
        });
}