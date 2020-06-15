const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
/*admin.initializeApp({
    credential: admin.credential.applicationDefault()
});*/

// init express server
const express = require('express');
const app = express();

// get all posts
app.get('/getPosts', (req, res) =>{
    admin.firestore().collection('posts').get()
    .then(data =>{
        let posts=[];
        data.forEach(doc=>{
            posts.push(doc.data());
        });
        return res.json(posts);
    })
    .catch( (e) => console.error(e));
})

// add new post
app.get('/addPost', (req, res) =>{
    const post = {
        name: req.body.name
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
exports.api = functions.https.onRequest(app);