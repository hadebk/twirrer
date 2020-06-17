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
const { user } = require('firebase-functions/lib/providers/auth');

/**
 * ****************************************************************
 * signup function
 * ****************************************************************
 */
exports.signup = (req, res) => {
    let userIdToken, userId;

    let defaultProfilePicture = 'default_pp.png';

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
                profilePicture: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfilePicture}?alt=media`,
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

/**
 * ****************************************************************
 * upload user profile picture
 * ****************************************************************
 */
exports.uploadImage = (req, res) => {
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
          return res.status(400).json({ error: "Wrong file type submitted" });
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
                /**
                 *  TODO: delete the old profile image from firebase storage.
                 *  NOTE: but check if this old image it is default image do not delete it.
                 * */            
            })
            .then(() => {
                return res.json({
                    message: "image uploaded successfully"
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
 * add extra data to user record in db, (bio ,location, website)
 * ****************************************************************
 */
exports.addUserDetails = (req, res) => {
    // data validation
    let userDetails =  reduceUserDetails(req.body);

    // db query to add this extra data to that user's record in db
    db.doc(`/users/${req.user.userName}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Extra user details added successfully'})
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error.code})
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
      return res.json(userData);
      /*return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();*/
    })
    /*.then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })*/
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}