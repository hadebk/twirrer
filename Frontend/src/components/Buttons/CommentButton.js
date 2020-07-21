import React, { useContext } from "react";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const CommentButton = ({ post }) => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // userData context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //

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
