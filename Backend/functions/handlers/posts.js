const { db } = require("../util/admin");

/**
 * **********************************************************
 * retrieve all posts
 * **********************************************************
 */
/*exports.getAllPosts = (req, res) => {
    db.collection('posts').orderBy('createdAt', 'desc').get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    userId: doc.data().userId,
                    userName: doc.data().userName,
                    profilePicture: doc.data().profilePicture,
                    postId: doc.id,
                    postContent: doc.data().postContent,
                    postImage: doc.data().postImage,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(posts);
        })
        .catch((e) => console.error(e));
}*/

/**
 * **********************************************************
 * retrieve pined posts (owner's post).
 * **********************************************************
 */
exports.pinedPost = (req, res) => {
  db.collection("posts")
    .doc("JXuy58xhwYWwt6JDwMI1")
    .get()
    .then((data) => {
      if (data.exists) {
        let post = {
          userId: data.data().userId,
          userName: data.data().userName,
          profilePicture: data.data().profilePicture,
          postId: data.id,
          postContent: data.data().postContent,
          postImage: data.data().postImage,
          createdAt: data.data().createdAt,
          likeCount: data.data().likeCount,
          commentCount: data.data().commentCount,
        };
        return res.json(post);
      }
    })
    .catch((e) => console.error(e));
};

/**
 * **********************************************************
 * use infinite scroll approach:
 *
 * retrieve very first posts.
 * when load home page, get only first 10 posts.
 * when user scroll down get more posts.
 * **********************************************************
 */
exports.postsFirstFetch = (req, res) => {
  // initial fetch

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .limit(20)
    .get()
    .then((data) => {
      let posts = [];
      let lastKey = "";
      data.forEach((doc) => {
        posts.push({
          userId: doc.data().userId,
          userName: doc.data().userName,
          profilePicture: doc.data().profilePicture,
          postId: doc.id,
          postContent: doc.data().postContent,
          postImage: doc.data().postImage,
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        });
        lastKey = doc.data().createdAt;
      });
      return res.json({ posts, lastKey: lastKey });
    })
    .catch((e) => console.error(e));
};

/**
 * **********************************************************
 *  use infinite scroll approach:
 *
 * retrieve next 10 posts.
 * when user scroll down get more posts.
 * **********************************************************
 */
exports.postsNextFetch = (req, res) => {
  // Next fetch

  if (req.body.lastKey) {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .startAfter(req.body.lastKey)
      .limit(20)
      .get()
      .then((data) => {
        let posts = [];
        let lastKey = "";
        data.forEach((doc) => {
          posts.push({
            userId: doc.data().userId,
            userName: doc.data().userName,
            profilePicture: doc.data().profilePicture,
            postId: doc.id,
            postContent: doc.data().postContent,
            postImage: doc.data().postImage,
            createdAt: doc.data().createdAt,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
          });
          lastKey = doc.data().createdAt;
        });
        return res.json({ posts, lastKey: lastKey });
      })
      .catch((e) => console.error(e));
  } else {
    res.json({ error: "There is no last key value!" });
  }
};

/**
 * ****************************************************************
 * get one post by postId
 * ****************************************************************
 */
exports.getOnePost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Post not found",
        });
      }
      postData.postId = doc.id;
      postData.post = doc.data();
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then((data) => {
      postData.comments = [];
      data.forEach((doc) => {
        postData.comments.push(doc.data());
      });
      return db
        .collection("likes")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then((data) => {
      postData.likes = [];
      data.forEach((doc) => {
        postData.likes.push(doc.data());
      });
      return res.json(postData);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: error.code,
      });
    });
};

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
    profilePicture: req.user.profilePicture,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,

    // received from user
    postContent: req.body.postContent,
    /**
     * 'postImage' will be updated from frontend
     * if user select image with post > postImage: imageURL
     * else user not select image with post > postImage: null
     */
    postImage: req.body.postImage,
  };

  db.collection("posts")
    .add(post)
    .then((doc) => {
      let postedPost = post;
      postedPost.postId = doc.id;
      res.json(postedPost);
    })
    .catch((e) => {
      res.status(500).json({
        error: "something went wrong!",
      });
      console.error(e);
    });
};

/**
 * ****************************************************************
 * delete a post
 * ****************************************************************
 */
exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Post not found",
        });
      }
      if (doc.data().userName !== req.user.userName) {
        // that is not your own post and you can't delete it!
        return res.status(403).json({
          error: "Unauthorized",
        });
      } else {
        // that is your post and you can delete it.
        return document.delete();
      }
    })
    .then(() => {
      res.json({
        message: "Post deleted successfully",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

/**
 * ****************************************************************
 * comment on a post, just for authorized user
 * ****************************************************************
 */
exports.commentOnPost = (req, res) => {
  // comment input validation
  if (req.body.commentContent.trim() === "")
    return res.status(400).json({
      error: "Comment must not be empty",
    });

  const newComment = {
    // added automatically
    userName: req.user.userName,
    profilePicture: req.user.profilePicture,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,

    // received from user
    commentContent: req.body.commentContent,
  };

  // First, check if this post already exist or not
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({
          error: "Post not found",
        });
      return doc.ref.update({
        commentCount: doc.data().commentCount + 1,
      });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong!",
      });
    });
};

/**
 * ****************************************************************
 * Like a post, just for authorized user.
 *                       // logic //
 * - check if this post, that will be liked exist or not.
 * - then check if this user liked this post before or not.
 * - if not liked before, the like will be added to likes collection,
 *   and increment likeCount in this post.
 * ****************************************************************
 */
exports.likePost = (req, res) => {
  // first, get like of this user on this post
  const likeDocument = db
    .collection("likes")
    .where("userName", "==", req.user.userName)
    .where("postId", "==", req.params.postId)
    .limit(1);

  // second, get the post, that this user want to like
  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        // the post that user want to like is exist, coll! go ahead
        // get this post
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({
          error: "Post not found",
        });
      }
    })
    .then((data) => {
      if (data.empty) {
        // the post is exist, and the user have not liked it before
        return db
          .collection("likes")
          .add({
            // add this like to likes collection in db
            postId: req.params.postId,
            userName: req.user.userName,
            profilePicture: req.user.profilePicture,
          })
          .then(() => {
            // increment like count in this post record in db
            postData.likeCount++;
            return postDocument.update({
              likeCount: postData.likeCount,
            });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        return res.status(400).json({
          error: "post already liked",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err.code,
      });
    });
};

/**
 * ****************************************************************
 * Unlike a post, just for authorized user
 *                       // logic //
 * - check if this post, that will be liked exist or not.
 * - then check if this user liked this post before or not.
 * - if was liked before, the like will be deleted from likes collection,
 *   and decrement likeCount in this post.
 * ****************************************************************
 */
exports.unlikePost = (req, res) => {
  // first, get like of this user on this post
  const likeDocument = db
    .collection("likes")
    .where("userName", "==", req.user.userName)
    .where("postId", "==", req.params.postId)
    .limit(1);

  // second, get the post, that this user want to like
  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        // the post that user want to unlike is exist, coll! go ahead
        // get this post
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({
          error: "Post not found",
        });
      }
    })
    .then((data) => {
      if (data.empty) {
        // the post is exist, and the user have not liked it before
        return res.status(400).json({
          error: "post not liked",
        });
      } else {
        // the post is exist, and the user have liked it before
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete() // delete this like from likes collection in db
          .then(() => {
            // decrement like count in this post record in db
            postData.likeCount--;
            return postDocument.update({
              likeCount: postData.likeCount,
            });
          })
          .then(() => {
            return res.json(postData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err.code,
      });
    });
};
