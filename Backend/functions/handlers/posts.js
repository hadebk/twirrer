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