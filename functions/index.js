const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

exports.helloWorld = functions.region('europe-west3').https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

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
})

