import React, { useContext, useEffect, useState } from "react";

// style
import "./AddFriendButton.scss";

// Global vars import
import variables from "../../../style/CssVariables.scss";

// api service
import UserService from "../../../services/UserService";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import UserContext from "../../../context/UserContext";
import { LanguageContext } from "../../../context/LanguageContext";
import UserProfileContext from "../../../context/UserProfileContext";

/**
 * @param {string} param0 userName is the user's name, who will be added as friend
 */
const AddFriendButton = ({ userName }) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // user profile data context
  const { userProfileData, setUserProfileData } =
    useContext(UserProfileContext);
  // ******* end global state *******//

  //local state
  const [friendStatus, setFriendStatus] = useState(false);

  // add a dynamic dependency, bcz when there is no logged in user, a error will be thrown.
  const friendsDependency = userData.isAuth ? userData.user.friends : "";

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (userData.isAuth && userName) {
        setFriendStatus(false);
        /**
         * if the user was added before, show 'delete friend' button, instead of 'add friend'
         */
        for (let i = 0; i < userData.user.friends.length; i++) {
          if (userName === userData.user.friends[i].userName) {
            setFriendStatus(true); // the user is a friend
          }
        }
      }
    }
    return (mounted = false);
  }, [userData.isAuth, userName, friendsDependency]);

  // add friend
  const addFriend = () => {
    if (userName) {
      UserService.addFriend(userName, userData.token)
        .then((res) => {
          return res;
        })
        .then((res) => {
          // 1- update state in UserProfile to show the change immediately
          /**
           * check if current stored profile in userProfileDataContext belongs
           * to logged in user or to the user, who will be added!
           */
          if (
            userProfileData.user.userName === userName ||
            userProfileData.user.userName === userData.user.credentials.userName
          ) {
            let newFriends = [...userProfileData.friends];
            if (userProfileData.user.userName === userName) {
              /**
               * current user's profile not belongs to logged in user,
               * so add the logged in user as a friend to the current user's profile(user to be added).
               */
              newFriends.push({
                profilePicture: userData.user.credentials.profilePicture,
                userName: userData.user.credentials.userName,
              });
            } else {
              // current user profile is mein, so add the added user as friend to me.
              /**
               * current user's profile belongs to logged in user,
               * so add the user(who will be added) as a friend the logged in user.
               */
              newFriends.push({
                profilePicture: res.data.userToBeAdded_Data.profilePicture,
                userName: res.data.userToBeAdded_Data.userName,
              });
            }
            setUserProfileData({
              ...userProfileData,
              user: {
                ...userProfileData.user,
                friendsCount: Number(userProfileData.user.friendsCount) + 1,
              },
              friends: newFriends,
            });
          }

          // 2- update cache of both users
          // 2-1) update current logged in user's profile
          let cachedAdderUser = JSON.parse(
            window.sessionStorage.getItem(userData.user.credentials.userName)
          );
          if (cachedAdderUser) {
            let AdderNewFriendsCache = [...cachedAdderUser.friends];
            AdderNewFriendsCache.unshift(res.data.userToBeAdded_Data);
            window.sessionStorage.setItem(
              userData.user.credentials.userName,
              JSON.stringify({
                ...cachedAdderUser,
                user: {
                  ...cachedAdderUser.user,
                  friendsCount: Number(cachedAdderUser.user.friendsCount) + 1,
                },
                friends: AdderNewFriendsCache,
              })
            );
          }
          // 2-2) update the user's profile, who was added
          let cachedAddedUser = JSON.parse(
            window.sessionStorage.getItem(userName)
          );
          if (cachedAddedUser) {
            let AdderNewFriendsCache = [...cachedAddedUser.friends];
            AdderNewFriendsCache.unshift({
              userName: userData.user.credentials.userName,
              profilePicture: userData.user.credentials.profilePicture,
            });
            window.sessionStorage.setItem(
              userName,
              JSON.stringify({
                ...cachedAddedUser,
                user: {
                  ...cachedAddedUser.user,
                  friendsCount: Number(cachedAddedUser.user.friendsCount) + 1,
                },
                friends: AdderNewFriendsCache,
              })
            );
          }

          // 3- update global state(logged in user's state) to show the change immediately
          let newFriends = [...userData.user.friends];
          newFriends.push(res.data.userToBeAdded_Data);
          setUserData({
            isAuth: userData.isAuth,
            token: userData.token,
            user: {
              ...userData.user,
              credentials: {
                ...userData.user.credentials,
                friendsCount:
                  Number(userData.user.credentials.friendsCount) + 1,
              },
              friends: newFriends,
            },
          });

          // 4- update cache of global state(logged in user's state)
          let CacheUserData = JSON.parse(
            window.sessionStorage.getItem("CacheUserData")
          );
          if (CacheUserData) {
            window.sessionStorage.setItem(
              "CacheUserData",
              JSON.stringify({
                isAuth: userData.isAuth,
                token: userData.token,
                user: {
                  ...userData.user,
                  credentials: {
                    ...userData.user.credentials,
                    friendsCount:
                      Number(userData.user.credentials.friendsCount) + 1,
                  },
                  friends: newFriends,
                },
              })
            );
          }
        })
        .then(() => setFriendStatus(true))
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // delete friend
  const unFriend = () => {
    if (userName) {
      UserService.unFriend(userName, userData.token)
        .then((res) => {
          // 1- update state in UserProfile to show the change immediately
          /**
           * check if current stored profile in userProfileDataContext belongs
           * to logged in user or to the user, who will be deleted!
           */
          if (
            userProfileData.user.userName === userName ||
            userProfileData.user.userName === userData.user.credentials.userName
          ) {
            let newFriends = [];
            if (userProfileData.user.userName === userName) {
              /**
               * current user's profile not belongs to logged in user (here is the profile of second user, who will be deleted),
               * so delete the logged in user from the friends list of second user.
               */
              newFriends = [...userProfileData.friends].filter(
                (friend) =>
                  friend.userName !== userData.user.credentials.userName
              );
            } else {
              /**
               * current user's profile belongs to logged in user (here is the profile of current logged in user),
               * so delete the second user from the friends list of logged in user.
               */
              newFriends = [...userProfileData.friends].filter(
                (friend) => friend.userName !== userName
              );
            }
            setUserProfileData({
              ...userProfileData,
              user: {
                ...userProfileData.user,
                friendsCount: Number(userProfileData.user.friendsCount) - 1,
              },
              friends: newFriends,
            });
          }

          // 2- update cache of both users
          // 2-1) update current logged in user's profile
          let cachedAdderUser = JSON.parse(
            window.sessionStorage.getItem(userData.user.credentials.userName)
          );
          if (cachedAdderUser) {
            window.sessionStorage.setItem(
              userData.user.credentials.userName,
              JSON.stringify({
                ...cachedAdderUser,
                user: {
                  ...cachedAdderUser.user,
                  friendsCount: Number(cachedAdderUser.user.friendsCount) - 1,
                },
                friends: cachedAdderUser.friends.filter(
                  (friend) => friend.userName !== userName
                ),
              })
            );
          }
          // 2-2) update the user's profile, who was added
          let cachedAddedUser = JSON.parse(
            window.sessionStorage.getItem(userName)
          );
          if (cachedAddedUser) {
            window.sessionStorage.setItem(
              userName,
              JSON.stringify({
                ...cachedAddedUser,
                user: {
                  ...cachedAddedUser.user,
                  friendsCount: Number(cachedAddedUser.user.friendsCount) - 1,
                },
                friends: cachedAddedUser.friends.filter(
                  (friend) =>
                    friend.userName !== userData.user.credentials.userName
                ),
              })
            );
          }

          // 3- update global state(logged in user's state) to show the change immediately
          let newFriends = userData.user.friends.filter(
            (friend) => friend.userName !== userName
          );
          setUserData({
            isAuth: userData.isAuth,
            token: userData.token,
            user: {
              ...userData.user,
              credentials: {
                ...userData.user.credentials,
                friendsCount:
                  Number(userData.user.credentials.friendsCount) - 1,
              },
              friends: newFriends,
            },
          });

          // 4- update cache of global state(logged in user's state)
          let CacheUserData = JSON.parse(
            window.sessionStorage.getItem("CacheUserData")
          );
          if (CacheUserData) {
            window.sessionStorage.setItem(
              "CacheUserData",
              JSON.stringify({
                isAuth: userData.isAuth,
                token: userData.token,
                user: {
                  ...userData.user,
                  credentials: {
                    ...userData.user.credentials,
                    friendsCount:
                      Number(userData.user.credentials.friendsCount) - 1,
                  },
                  friends: newFriends,
                },
              })
            );
          }
        })
        .then(() => setFriendStatus(false))
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return friendStatus ? (
    <button
      style={{
        color: "#fff",
        backgroundColor: theme.error,
        borderRadius: variables.radius,
      }}
      onClick={unFriend}
      className='addFriend__button'
    >
      {language.userProfile.deleteFriendButton}
    </button>
  ) : (
    <button
      style={{
        border: `1px solid ${theme.mainColor}`,
        color: theme.mainColor,
        borderRadius: variables.radius,
      }}
      onClick={addFriend}
      className='addFriend__button'
    >
      {language.userProfile.addFriendButton}
    </button>
  );
};

export default AddFriendButton;
