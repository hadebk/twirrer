const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

// init express server
const express = require('express');
const app = express();

// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDenJlzVzL0LmDGNhZ6eH6TlZAmqFT4eJU",
    authDomain: "twirrer-app.firebaseapp.com",
    databaseURL: "https://twirrer-app.firebaseio.com",
    projectId: "twirrer-app",
    storageBucket: "twirrer-app.appspot.com",
    messagingSenderId: "714072408637",
    appId: "1:714072408637:web:eb709d07ebb91959a42054",
    measurementId: "G-7B0TRRWSJW"
};

// firebase init
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig)

// get all posts
app.get('/getPosts', (req, res) =>{
    admin.firestore().collection('posts').orderBy('createdAt', 'desc').get()
    .then(data =>{
        let posts=[];
        data.forEach(doc=>{
            posts.push({
                userId: doc.data().userId,
                userName: doc.data().userName,
                userAvatar: doc.data().userAvatar,
                postId: doc.id,
                postContent: doc.data().postContent,
                postImage: doc.data().postImage,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(posts);
    })
    .catch( (e) => console.error(e));
})

// add new post
app.post('/addPost', (req, res) =>{
    const post = {
        userId: req.body.userId,
        userName: req.body.userName,
        userAvatar: req.body.userAvatar,
        postContent: req.body.postContent,
        postImage: req.body.postImage,
        likeCount: req.body.likeCount,
        commentCount: req.body.commentCount,
        createdAt: new Date().toISOString()
    }

    admin.firestore().collection('posts').add(post)
    .then((doc)=>{
        res.json({message: `post ${doc.id} added successfully!`})
    })
    .catch( (e) => {
        res.status(500).json({error : 'something went wrong!'})
        console.error(e)
    });
})

// to tell firebase that app is the container of all routes
exports.api = functions.region('europe-west3').https.onRequest(app);