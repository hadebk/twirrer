import React, { useContext, useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";

// style
import "./LikesModal.scss";

// libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ImageModal from "../ImageModal/ImageModal";
import moment from "moment-twitter";
import { Modal } from "react-bootstrap";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

// component
import DeletePostButton from "../Buttons/DeletePostButton";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";

const LikesModal = ({ postData, likes }) => {
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
    console.log("likes modal----");
  }, [postData]);
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
                    <div className='likesBox__like__leftSide__userName'>
                      <Link
                        to={"/users/" + like.userName}
                        style={{ color: theme.typoMain }}
                      >
                        {like.userName}
                      </Link>
                    </div>
                  </div>
                  <div
                    className='likesBox__like__rightSide'
                    style={{ color: theme.typoMain }}
                  >
                    Add Friend
                  </div>
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
