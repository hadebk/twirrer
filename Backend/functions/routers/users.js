const express = require("express");

// import middleware authentication
const firebaseAuth = require("../util/firebaseAuth");

const {
  signup,
  login,
  logout,
  uploadProfileImage,
  uploadCoverImage,
  uploadPostImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsAsRead,
  addFriend,
  unFriend,
  usersToAdd,
} = require("../handlers/users");

// 1- crete a user's router
const router = new express.Router();

// 2- add user's routes
//-----------------------------------------------------------------------------------------------------------------
//                                                  [ User Routs ]
//-----------------------------------------------------------------------------------------------------------------

// user routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/uploadProfileImage", firebaseAuth, uploadProfileImage);
router.post("/uploadCoverImage", firebaseAuth, uploadCoverImage);
router.post("/uploadPostImage", firebaseAuth, uploadPostImage);
router.post("/addUserDetails", firebaseAuth, addUserDetails);
router.get("/getAuthenticatedUser", firebaseAuth, getAuthenticatedUser);
router.get("/user/:userName/getUserDetails", getUserDetails);
router.get("/user/:userName/addFriend", firebaseAuth, addFriend);
router.get("/user/:userName/unFriend", firebaseAuth, unFriend);
router.get("/usersToAdd", firebaseAuth, usersToAdd);
router.post("/markNotificationsAsRead", firebaseAuth, markNotificationsAsRead);

// 3- export user's router, to use it in index.js
module.exports = router;
