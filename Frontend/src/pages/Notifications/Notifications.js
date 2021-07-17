import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// style
import "./Notifications.scss";

// assets
import Empty from "../../assets/Images/empty.svg";
import DefaultAvatar from "../../assets/Images/default_pp.png";

// libraries
import moment from "moment-twitter";

// api service
import UserService from "../../services/UserService";

// component
import CheckVerifiedUserName from "../../components/CheckVerifiedUserName";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const Notifications = () => {
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

  // local state
  const [notifications, setNotifications] = useState([]);

  // set page title
  document.title = language.notifications.pageTitle;

  useEffect(() => {
    // get all nots and show them
    if (userData.isAuth) {
      setNotifications(userData.user.notifications);
      // when open Notifications page, mark all Nots as 'reading'
      let unreadNotificationsIds =
        userData.user.notifications.length > 0 &&
        userData.user.notifications
          .filter((notification) => !notification.read)
          .map((notification) => notification.notificationId);
      if (unreadNotificationsIds.length > 0) {
        UserService.markNotificationsAsRead(
          unreadNotificationsIds,
          userData.token
        )
          .then((res) => {
            // update user's Notifications in global state
            let newNots = userData.user.notifications.map((notification) => {
              return (notification = {
                ...notification,
                read: true,
              });
            });
            setUserData({
              ...userData,
              user: {
                ...userData.user,
                notifications: newNots,
              },
            });
            // update user's Notifications in cache
            let cachedUserData = JSON.parse(
              window.sessionStorage.getItem("CacheUserData")
            );
            if (cachedUserData) {
              window.sessionStorage.setItem(
                "CacheUserData",
                JSON.stringify({
                  ...cachedUserData,
                  user: {
                    ...cachedUserData.user,
                    notifications: newNots,
                  },
                })
              );
            }
            return res;
          })
          .catch((err) => console.log(err));
      }
    }
  }, [
    setUserData,
    userData,
    userData.isAuth,
    userData.token,
    userData.user.notifications,
  ]);

  return (
    <div
      className='notificationsBox'
      style={{ background: `${theme.background}` }}
    >
      <div
        className='notificationsBox__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <h1
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          {language.notifications.title}
        </h1>
      </div>
      <div className='notificationsBox__Wrapper'>
        {notifications.length > 0 ? (
          notifications.map((Not) => {
            let icon, text;
            if (Not.type === "like") {
              text = language.notifications.likeHint;
              icon = (
                <i
                  className='fas fa-heart'
                  style={{
                    color: theme.error,
                    backgroundColor: theme.foreground,
                    border: `2px solid ${theme.background}`,
                  }}
                ></i>
              );
            } else if (Not.type === "comment") {
              text = language.notifications.commentHint;
              icon = (
                <i
                  className='fas fa-comment'
                  style={{
                    color: "#17bf63",
                    backgroundColor: theme.foreground,
                    border: `2px solid ${theme.background}`,
                  }}
                ></i>
              );
            } else if (Not.type === "addFriend") {
              text = language.notifications.addFriendHint;
              icon = (
                <i
                  className='fas fa-user-plus'
                  style={{
                    color: theme.mainColor,
                    backgroundColor: theme.foreground,
                    border: `2px solid ${theme.background}`,
                  }}
                ></i>
              );
            }
            return (
              <Link
                to={
                  Not.type === "like" || Not.type === "comment"
                    ? "/posts/" + Not.postId
                    : "/users/" + Not.sender
                }
                key={Not.createdAt}
                className='link'
              >
                <div
                  className='notificationsBox__Wrapper__singleNotBox'
                  style={{
                    borderBottom: `1px solid ${theme.border}`,
                    backgroundColor: Not.read
                      ? theme.background
                      : theme.foreground,
                  }}
                >
                  <div className='notificationsBox__Wrapper__singleNotBox__userImageBox'>
                    <div className='notificationsBox__Wrapper__singleNotBox__userImageBox__imageWrapper'>
                      <img
                        alt='profile'
                        src={
                          Not.senderProfilePicture
                            ? Not.senderProfilePicture
                            : DefaultAvatar
                        }
                      />
                    </div>
                    <div className='notificationsBox__Wrapper__singleNotBox__userImageBox__iconWrapper'>
                      {icon}
                    </div>
                  </div>
                  <div className='notificationsBox__Wrapper__singleNotBox__content'>
                    <div className='notificationsBox__Wrapper__singleNotBox__content__header'>
                      <p style={{ color: theme.typoMain }}>
                        <CheckVerifiedUserName userName={Not.sender} />
                      </p>
                      <span style={{ color: theme.typoMain }}>{text}</span>
                    </div>
                    <div
                      className='notificationsBox__Wrapper__singleNotBox__content__time'
                      style={{ color: theme.typoSecondary }}
                    >
                      {moment(Not.createdAt).twitterShort()}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className='notificationsBox__Wrapper__emptyState'>
            <img
              alt='empty'
              src={Empty}
              className='notificationsBox__Wrapper__emptyState__image'
            />
            <div
              className='notificationsBox__Wrapper__emptyState__hint'
              style={{ color: theme.typoSecondary }}
            >
              {language.notifications.emptyHint}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
