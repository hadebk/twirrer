const express = require("express");

// import middleware authentication
const firebaseAuth = require("../util/firebaseAuth");

// import operations of the routes
const {
  postsFirstFetch,
  postsNextFetch,
  pinedPost,
  addNewPost,
  deletePost,
  getOnePost,
  commentOnPost,
  likePost,
  unlikePost,
} = require("../handlers/posts");

// 1- crete a post's router
const router = new express.Router();

// 2- add post's routes
//-----------------------------------------------------------------------------------------------------------------
//                                                  [ Post Routs ]
//-----------------------------------------------------------------------------------------------------------------

// post routes
app.get("/postsFirstFetch", postsFirstFetch);
app.post("/postsNextFetch", postsNextFetch);
app.get("/post/:postId/get", getOnePost);
app.get("/pinedPost", pinedPost);
app.post("/addNewPost", firebaseAuth, addNewPost); // cause 'FirebaseAuth' fun - if user not authorized, this route will not work.
app.delete("/post/:postId/delete", firebaseAuth, deletePost);
app.post("/post/:postId/comment", firebaseAuth, commentOnPost);
app.get("/post/:postId/like", firebaseAuth, likePost);
app.get("/post/:postId/unlike", firebaseAuth, unlikePost);

// 3- export post's router, to use it in index.js
module.exports = router;
