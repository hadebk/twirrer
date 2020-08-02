import React, { useContext, Fragment } from "react";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const DeletePostButton = ({ post }) => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // userData context
  const { userData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //

  // delete post by id
  const delete_post = (id, token) => {
    PostService.deletePost(id, token)
      .then((res) => {
        console.log("delete response", res.data.message);
        let newPosts = posts.filter((pos) => pos.postId !== post.postId);
        setPostsData(newPosts);
      })
      .catch((err) => {
        console.log("delete error", err);
      });
  };

  // button content
  const deleteButton = userData.isAuth ? (
    post.userName === userData.user.credentials.userName ? (
      <Fragment>
        <i className='far fa-trash-alt' style={{ color: theme.error }}></i>
        <div
          className='background'
          style={{
            backgroundColor: theme.errorBackground,
          }}
          onClick={(event) => {
            event.stopPropagation();
            delete_post(post.postId, userData.token);
          }}
        ></div>
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
