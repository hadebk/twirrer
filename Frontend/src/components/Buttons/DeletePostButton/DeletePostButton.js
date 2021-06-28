import React, { useContext, useState, Fragment } from "react";

// style
import "./DeletePostButton.scss";

// libraries
import { Modal } from "react-bootstrap";

// api service
import PostService from "../../../services/PostService";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import { LanguageContext } from "../../../context/LanguageContext";
import UserContext from "../../../context/UserContext";
import PostsContext from "../../../context/PostsContext";
import UserProfileContext from "../../../context/UserProfileContext";

const DeletePostButton = ({ post }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // userData context
  const { userData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // user profile data context
  const { userProfileData, setUserProfileData } =
    useContext(UserProfileContext);
  // ******* end global state ******* //

  // local state
  const [isOpen, setOpen] = useState(false);

  let closeModal = () => {
    document.body.style.pointerEvents = "all";
    setOpen(false);
  };

  let openModal = () => {
    document.body.style.pointerEvents = "none";
    setOpen(true);
  };

  // delete post by id
  const delete_post = () => {
    PostService.deletePost(post.postId, userData.token)
      .then(() => {
        let newPosts = posts.filter(
          (current) => current.postId !== post.postId
        );
        // 1- update posts state in global state
        setPostsData(newPosts);

        // 2- update posts in session storage (cache)
        window.sessionStorage.setItem("posts", JSON.stringify(newPosts));

        // 3- delete this post from cache
        window.sessionStorage.removeItem(post.postId);

        // 4- delete this post from user profile data (global state)
        /**
         * check if current profile page belongs to the logged in user or not,
         * bcz if not, should no update be applied to the userProfileData state.
         */
        if (
          userProfileData.user.userName === userData.user.credentials.userName
        ) {
          let userNewPosts = userProfileData.posts.filter(
            (current) => current.postId !== post.postId
          );
          setUserProfileData({
            ...userProfileData,
            posts: userNewPosts,
          });
        }

        // 5- update user profile data in session storage (cache)
        // get user profile data from cache
        let cachedUserProfileData = JSON.parse(
          window.sessionStorage.getItem(userData.user.credentials.userName)
        );
        if (cachedUserProfileData) {
          let userNewPostsCache = cachedUserProfileData.posts.filter(
            (current) => current.postId !== post.postId
          );
          window.sessionStorage.setItem(
            userData.user.credentials.userName,
            JSON.stringify({
              ...cachedUserProfileData,
              posts: userNewPostsCache,
            })
          );
        }
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        closeModal();
      });
  };

  // button content
  const deleteButton = userData.isAuth ? (
    post.userName === userData.user.credentials.userName ? (
      <Fragment>
        <div
          className='deleteIconBox'
          onClick={(event) => {
            event.stopPropagation();
            openModal();
          }}
        >
          <i className='far fa-trash-alt' style={{ color: theme.error }}></i>
        </div>
        <div
          className='background'
          style={{
            backgroundColor: theme.errorBackground,
          }}
        ></div>

        <Modal
          show={isOpen}
          centered='true'
          className='deletePost__main__modal'
        >
          <Modal.Body
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.background,
            }}
            className='deletePost__main__modal__body'
          >
            <div
              style={{ color: theme.typoMain }}
              className='deletePost__main__modal__body__title'
            >
              {language.deletePostModal.title}
            </div>
            <div
              className='deletePost__main__modal__body__message'
              style={{ color: theme.typoSecondary }}
            >
              {language.deletePostModal.message}
            </div>
            <div className='deletePost__main__modal__body__buttonsBox'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                style={{ background: theme.border, color: theme.typoMain }}
              >
                {language.deletePostModal.cancelButton}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  delete_post();
                }}
                style={{ background: theme.error, color: "#fff" }}
              >
                {language.deletePostModal.deleteButton}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    ) : (
      ""
    )
  ) : (
    ""
  );
  return deleteButton;
};

export default DeletePostButton;
