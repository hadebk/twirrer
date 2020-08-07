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

const AddFriendButton = ({ userName, userProfileData, setUserProfileData }) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);
  // ******* end global state *******//

  //local state
  const [friendStatus, setFriendStatus] = useState();

  useEffect(() => {
    if (userData.isAuth) {
      /**
       * if user added before show 'delete friend' button, nested of 'add friend'
       */
      userData.user.friends.map((friend) => {
        if (userName === friend.userName) {
          setFriendStatus(true);
        }
      });
    }
  }, [userData.isAuth, userName, setFriendStatus]);

  // add friend
  const addFriend = () => {
    if (userName) {
      UserService.addFriend(userName, userData.token)
        .then((res) => {
          return res;
        })
        .then((res) => {
          // update state in UserProfile to show the change immediately
          if (userProfileData) {
            let newFriends = [...userProfileData.friends];
            newFriends.push({
              profilePicture: userData.user.credentials.profilePicture,
              userName: userData.user.credentials.userName,
            });
            setUserProfileData({
              user: userProfileData.user,
              posts: userProfileData.posts,
              friends: newFriends,
            });
          }
          // update global state to show the change immediately
          let newFriends = userData.user.friends;
          newFriends.push({
            profilePicture: res.data.userToBeAdded_Data.profilePicture,
            userName: userName,
          });
          setUserData({
            isAuth: userData.isAuth,
            token: userData.token,
            user: {
              ...userData.user,
              friends: newFriends,
            },
          });
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
        .then(() => {
          // update state in UserProfile to show the change immediately
          if (userProfileData) {
            let newFriends = [...userProfileData.friends].filter(
              (friend) => friend.userName !== userData.user.credentials.userName
            );
            setUserProfileData({
              user: userProfileData.user,
              posts: userProfileData.posts,
              friends: newFriends,
            });
          }
          // update global state to show the change immediately
          let newFriends = userData.user.friends.filter(
            (friend) => friend.userName !== userName
          );
          setUserData({
            isAuth: userData.isAuth,
            token: userData.token,
            user: {
              ...userData.user,
              friends: newFriends,
            },
          });
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
