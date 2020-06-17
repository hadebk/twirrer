const { db } = require('../util/admin')

/**
 * **********************************************************
 * retrieve all posts
 * **********************************************************
 */
exports.getAllPosts = (req, res) => {
    db.collection('posts').orderBy('createdAt', 'desc').get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    userId: doc.data().userId,
                    userName: doc.data().userName,
                    postId: doc.id,
                    postContent: doc.data().postContent,
                    postImage: doc.data().postImage,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(posts);
        })
        .catch((e) => console.error(e));
}

/**
 * ****************************************************************
 * add new post
 * ****************************************************************
 */
exports.addNewPost = (req, res) => {

    // if you get here, that is means, that you are authorized user.

    const post = {
        // added automatically
        userId: req.user.uid,
        userName: req.user.userName,
        createdAt: new Date().toISOString(),

        // received from user 
        postContent: req.body.postContent,
        postImage: req.body.postImage
    }

    db.collection('posts').add(post)
        .then((doc) => {
            res.json({
                message: `post ${doc.id} added successfully!`
            })
        })
        .catch((e) => {
            res.status(500).json({
                error: 'something went wrong!'
            })
            console.error(e)
        });
}

/**
 * ****************************************************************
 * get one post by postId
 * ****************************************************************
 */
exports.getOnePost = (req, res) => {
    let postData = {};
    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found'})
            }
            postData = doc.data();
            postData.postId = doc.id;
            return db.collection('comments').orderBy('createdAt', 'desc').where('postId', '==', req.params.postId).get();
        })
        .then((data) => {
            postData.comments = [];
            data.forEach(doc => {
                postData.comments.push(doc.data())
            });
            return res.json(postData);
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: error.code})
        })
}

/**
 * ****************************************************************
 * comment on a post, just for authorized user 
 * ****************************************************************
 */
exports.commentOnPost = (req, res) => {
    // comment input validation
    if(req.body.commentContent.trim() === '') return res.status(400).json({ error: 'Comment must not be empty'});

    const newComment = {
        userName: req.user.userName,
        postId: req.params.postId,
        profilePicture: req.user.profilePicture,
        commentContent: req.body.commentContent,
        createdAt: new Date().toISOString(),
    }

    // First, check if this post already exist or not
    db.doc(`/posts/${req.params.postId}`).get()
        .then( (doc) => {
            if(!doc.exists) return res.status(404).json({ error: 'Post not found'});
            return db.collection('comments').add(newComment);
        })
        .then( () => {
            res.json(newComment);
        }) 
        .catch( (error) => {
            console.log(error);
            return res.status(500).json({error : 'Something went wrong!'})
        })
}