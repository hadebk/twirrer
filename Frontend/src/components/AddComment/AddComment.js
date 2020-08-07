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
  // ******* end global state *******//

  const [textarea, setTextarea] = useState({
    value: "",
    rows: 1,
    minRows: 1,
    maxRows: 5,
  });

  // auto resize textarea box, when user type long text
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
        // update posts state 'global'
        posts.map((pos, index) => {
          if (pos.postId === res.data.postId) {
            let newPosts = [...posts];
            newPosts[index] = res.data;
            setPostsData(newPosts);
          }
        });
        // update comments state in PostDetails page
        let newComments = [...comments];
        newComments.unshift(res.data);
        setComments(newComments);
        setTextarea({
          ...textarea,
          rows: 1,
          value: "",
        });
        // update commentsCount in postData in PostDetails Page
        let newPost = {...postData};
        newPost.commentCount = newPost.commentCount + 1;
        setPostData(newPost);
      })
      .catch((err) => {
        console.log(err)
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
          <i className='fas fa-paper-plane send' style={{ color: disabledFlag ? theme.mobileNavIcon : theme.mainColor}}></i>
        </button>
      </div>
    </div>
  );
};

export default AddComment;
