import React, { useContext, Fragment } from "react";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";

const DeletePostButton = ({ post, userData }) => {
  // ******* start consume contexts ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // ******* end consume contexts ******* //

  // delete post by id
  const delete_post = (id, token) => {
    console.log("delete post");
    PostService.deletePost(id, token)
      .then((res) => {
        console.log("delete response", res.data.message);
      })
      .catch((err) => {
        console.log("delete error", err);
      });
  };

  // button content
  const deleteButton = userData.isAuth ? (
    post.userName == userData.user.credentials.userName ? (
      <Fragment>
        <i class='far fa-trash-alt' style={{ color: theme.error }}></i>
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
