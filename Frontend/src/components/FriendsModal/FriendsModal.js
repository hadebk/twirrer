import React, { useContext, useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

// style
import "./FriendsModal.scss";

// libraries
import { Modal } from "react-bootstrap";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";
import AddFriendButton from "../Buttons/AddFriendButton/AddFriendButton";

const FriendsModal = ({ userProfileData }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // user context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //
  // local state
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    console.log("friends modal----");
  }, [ userData, userProfileData]);
  // utils
  let closeModal = () => setOpen(false);

  let openModal = () => {
    if (userProfileData.friends.length === 0) return;
    setOpen(true);
  };
  return (
    <Fragment>
      <div
        className='userProfile__main__userDetails__userData__friends'
        onClick={openModal}
      >
        <span
          className='userProfile__main__userDetails__userData__friends__number'
          style={{
            color: theme.typoMain,
          }}
        >
          {userProfileData.friends.length}
        </span>{" "}
        <span
          className='userProfile__main__userDetails__userData__friends__word'
          style={{
            color: theme.typoSecondary,
          }}
        >
          {" "}
          {language.userProfile.friends}
        </span>
      </div>

      <Modal
        show={isOpen}
        onHide={closeModal}
        keyboard={false}
        className='friends__main__modal'
      >
        <Modal.Header
          style={{
            background: theme.background,
            borderBottom: `1px solid ${theme.border}`,
          }}
          className='friends__main__modal__header'
        >
          <div className='left'>
            <div
              className='friends__main__modal__header__iconBox'
              onClick={() => closeModal()}
            >
              <i
                className='fal fa-times'
                style={{ color: theme.mainColor }}
              ></i>
              <div
                className='friends__main__modal__header__iconBox__background'
                style={{
                  background: theme.secondaryColor,
                }}
              ></div>
            </div>
            <h2
              className='friends__main__modal__header__title'
              style={{
                color: theme.typoMain,
              }}
            >
              {"@"}
              {userProfileData.user.userName + "'s "}
              {language.userProfile.friendsModalTitle}
            </h2>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            background: theme.background,
          }}
        >
          <div className='friendsBox'>
            {userProfileData.friends.map((friend) => {
              return (
                <div
                  className='friendsBox__friend'
                  key={friend.userName}
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <div className='friendsBox__friend__leftSide'>
                    <div className='friendsBox__friend__leftSide__userImageBox'>
                      <Link to={"/users/" + friend.userName}>
                        <img src={friend.profilePicture} alt='profile' />
                      </Link>
                    </div>
                    <div className='friendsBox__friend__leftSide__userName'>
                      <Link
                        to={"/users/" + friend.userName}
                        style={{ color: theme.typoMain }}
                      >
                        {friend.userName}
                      </Link>
                    </div>
                  </div>
                  {/* add friend button */}
                  {userData.isAuth ? (
                    friend.userName !== userData.user.credentials.userName ? (
                      <div
                        className='friendsBox__friend__rightSide'
                        style={{ color: theme.typoMain }}
                      >
                        <AddFriendButton
                          userName={friend.userName}
                          profilePicture={friend.profilePicture}
                        />
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    "login"
                  )}
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default FriendsModal;
