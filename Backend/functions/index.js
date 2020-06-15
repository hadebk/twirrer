const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

exports.helloWorld = functions.region('europe-west3').https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// get posts
exports.get = functions.region('europe-west3').https.onRequest((req, res) =>{
    admin.firestore().collection('posts').get()
    .then(data =>{
        let posts=[];
        data.forEach(doc=>{
            posts.push(doc.data());
        });
        return res.json(posts);
    })
    .catch( (e) => console.error(e));
});

// add post 
exports.add = functions.region('europe-west3').https.onRequest((req, res) =>{
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
});
