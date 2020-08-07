import React, { useContext, useState, Fragment } from "react";
import { Link } from "react-router-dom";

// style
import "./LikesModal.scss";

// libraries
import { Modal } from "react-bootstrap";

// comps
import AddFriendButton from "../Buttons/AddFriendButton/AddFriendButton";
import CheckVerifiedUserName from "../CheckVerifiedUserName";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const LikesModal = ({ postData, likes }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // ******* end global state ******* //
  // local state
  const [isOpen, setOpen] = useState(false);

  // utils
  let closeModal = () => setOpen(false);

  let openModal = () => {
    if (postData.likeCount === 0) return;
    setOpen(true);
  };

  return (
    <Fragment>
      <div
        className='postDetails__post__content__counters__likes'
        onClick={openModal}
        style={{ color: theme.typoMain }}
      >
        <span
          className='postDetails__post__content__counters__numbers'
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          {postData.likeCount}
        </span>
        <span
          style={{
            color: `${theme.typoSecondary}`,
          }}
        >
          {language.postDetails.likes}
        </span>
      </div>

      <Modal
        show={isOpen}
        onHide={closeModal}
        keyboard={false}
        centered='true'
        className='likes__main__modal'
      >
        <Modal.Header
          style={{
            background: theme.background,
            borderBottom: `1px solid ${theme.border}`,
          }}
          className='likes__main__modal__header'
        >
          <div className='left'>
            <div
              className='likes__main__modal__header__iconBox'
              onClick={() => closeModal()}
            >
              <i
                className='fal fa-times'
                style={{ color: theme.mainColor }}
              ></i>
              <div
                className='likes__main__modal__header__iconBox__background'
                style={{
                  background: theme.secondaryColor,
                }}
              ></div>
            </div>
            <h2
              className='likes__main__modal__header__title'
              style={{
                color: theme.typoMain,
              }}
            >
              {language.postDetails.likesModalTitle}
            </h2>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            background: theme.background,
          }}
        >
          <div className='likesBox'>
            {likes.map((like) => {
              return (
                <div
                  className='likesBox__like'
                  key={like.userName}
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <div className='likesBox__like__leftSide'>
                    <div className='likesBox__like__leftSide__userImageBox'>
                      <Link to={"/users/" + like.userName}>
                        <img src={like.profilePicture} alt='profile' />
                      </Link>
                    </div>
                    <div
                      className='likesBox__like__leftSide__userName'
                      style={{ color: theme.typoMain }}
                    >
                      <Link
                        to={"/users/" + like.userName}
                        style={{ color: theme.typoMain }}
                      >
                        <CheckVerifiedUserName userName={like.userName} />
                      </Link>
                      <p style={{ color: theme.typoSecondary }}>
                        @{like.userName}
                      </p>
                    </div>
                  </div>
                  {/* add friend button */}
                  {userData.isAuth ? (
                    like.userName !== userData.user.credentials.userName ? (
                      <div
                        className='likesBox__like__rightSide'
                        style={{ color: theme.typoMain }}
                      >
                        <AddFriendButton
                          userName={like.userName}
                        />
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    <Link to='/login'>
                      <AddFriendButton
                        userName={""}
                        userProfileData={""}
                        setUserProfileData={""}
                      />
                    </Link>
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

export default LikesModal;
