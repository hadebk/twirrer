import React, { useContext, Fragment } from "react";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";

const CommentButton = ({ post, userData }) => {
  // ******* start consume contexts ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // ******* end consume contexts ******* //

  return (
    <div className='postCard__content__line4__comment'>
      <div className='comment__box'>
        <i className='fal fa-comment'></i>
        <div
          className='comment__background'
          style={{
            background: theme.secondaryColor,
          }}
        ></div>
      </div>
      {post.commentCount === 0 ? "" : post.commentCount}
    </div>
  );
};

export default CommentButton;
