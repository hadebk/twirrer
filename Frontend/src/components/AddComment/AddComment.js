/* eslint-disable array-callback-return */
import React, { useState, useContext } from "react";

// style
import "./AddComment.scss";

// assets
import Default from "../../assets/Images/default_pp.png";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";
import UserProfileContext from "../../context/UserProfileContext";

const AddComment = ({
  postId,
  comments,
  setComments,
  postData,
  setPostData,
}) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // user profile data context
  const { userProfileData, setUserProfileData } =
    useContext(UserProfileContext);
  // ******* end global state *******//

  const [textarea, setTextarea] = useState({
    value: "",
    rows: 1,
    minRows: 1,
    maxRows: 5,
  });

  // Textarea box auto resizing, when user type long text
  const handleChange = (event) => {
    const textareaLineHeight = 24;
    let { minRows, maxRows } = textarea;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setTextarea({
      ...textarea,
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    });
  };

  // add comment
  const sendComment = () => {
    let comment = {
      commentContent: textarea.value.trim(),
    };
    PostService.addComment(postId, comment, userData.token)
      .then((res) => {
        // 1- update comments state in PostDetails page with the new comment
        let newComments = [...comments];
        newComments.unshift(res.data);
        setComments(newComments);
        setTextarea({
          ...textarea,
          rows: 1,
          value: "",
        });

        // 2- update commentsCount in postData in PostDetails Page
        let newPost = { ...postData };
        newPost.commentCount = newPost.commentCount + 1;
        setPostData(newPost);

        // 3- update current post in session storage (cache)
        let cachedCurrentPost = JSON.parse(
          window.sessionStorage.getItem(res.data.postId)
        );
        window.sessionStorage.setItem(
          res.data.postId,
          JSON.stringify({
            postContent: newPost,
            postComments: newComments,
            postLikes: cachedCurrentPost.postLikes,
          })
        );

        // 4- update posts state 'global'
        // eslint-disable-next-line array-callback-return
        posts.map((pos, index) => {
          if (pos.postId === res.data.postId) {
            let newPosts = [...posts];
            newPosts[index] = newPost;
            setPostsData(newPosts);
            // 5- update posts cache in session storage (cache)
            window.sessionStorage.setItem("posts", JSON.stringify(newPosts));
          }
        });

        // check if commentedPost belongs to current user in userProfileData state(global)
        if (userProfileData.user.userName === res.data.userName) {
          // 6- update post in userProfileData (global state)
          userProfileData.posts.map((pos, index) => {
            if (pos.postId === res.data.postId) {
              let newPosts = [...userProfileData.posts];
              newPosts[index] = newPost;
              setUserProfileData({
                ...userProfileData,
                posts: newPosts,
              });
            }
          });
        }

        let cachedUserProfileData = JSON.parse(
          window.sessionStorage.getItem(userData.user.credentials.userName)
        );
        if (cachedUserProfileData) {
          // 7- update user profile cache with new comments number in session storage (cache)
          cachedUserProfileData.posts.map((pos, index) => {
            if (pos.postId === res.data.postId) {
              let newPosts = [...userProfileData.posts];
              newPosts[index] = newPost;
              window.sessionStorage.setItem(
                userData.user.credentials.userName,
                JSON.stringify({
                  ...cachedUserProfileData,
                  posts: newPosts,
                })
              );
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setTextarea({
          ...textarea,
          rows: 1,
          value: "",
        });
      });
  };

  var disabledFlag = textarea.value.trim().length > 0 ? false : true;

  return (
    <div
      className='addCommentBox'
      style={{
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div className='addCommentBox__userImageBox'>
        <div>
          <img
            className='addCommentBox__userImageBox__image'
            src={
              userData.user.credentials.profilePicture
                ? userData.user.credentials.profilePicture
                : Default
            }
            alt='Profile'
          ></img>
        </div>
      </div>
      <div className='addCommentBox__inputBox'>
        <textarea
          style={{
            backgroundColor: theme.secondaryColor,
            color: theme.typoMain,
            border: `1px solid ${theme.border}`,
          }}
          rows={textarea.rows}
          value={textarea.value}
          placeholder={language.postDetails.commentPlaceholder}
          className='addCommentBox__inputBox__textarea'
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div className='addCommentBox__buttonBox'>
        <button
          disabled={disabledFlag}
          onClick={() => sendComment()}
          style={{ opacity: disabledFlag ? 0.6 : 1 }}
        >
          <i
            className='fas fa-paper-plane send'
            style={{
              color: disabledFlag ? theme.mobileNavIcon : theme.mainColor,
            }}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default AddComment;
