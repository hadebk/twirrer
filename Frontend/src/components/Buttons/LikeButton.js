import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const LikeButton = ({ post }) => {
  const [wasLiked, setLikeStatus] = useState(false);

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // user context
  const { userData, setUserData } = useContext(UserContext);
  const { posts, setPostsData } = useContext(PostsContext);
  const history = useHistory();

  const likePost = (isAuth) => {
    if (isAuth) {
      console.log('llllllllllllike auth', post.postId);
      PostService.LikePost(post.postId, userData.token)
        .then((res) => {
          console.log("like", res);
          // update post in posts array
          posts.map((pos, index) => {
            if (pos.postId === res.data.postId) {
              console.log("finded!", index);
              let newPosts = [...posts];
              newPosts[index] = res.data;
              console.log("newPosts", newPosts);
              setPostsData(newPosts);
            }
          });
          // update user likes in state
          setLikeStatus(true);
          let newLikes = userData.user.likes;
          newLikes.push({
            postId: post.postId,
            profilePicture: userData.user.credentials.profilePicture,
            userName: userData.user.credentials.userName,
          });
          setUserData({
            ...userData,
            user: {
              ...userData.user,
              likes: newLikes,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push("/login");
    }
  };

  const unlikePost = (isAuth) => {
    if (isAuth) {
      console.log('unllllllllllllike');
      PostService.unlikePost(post.postId, userData.token)
        .then((res) => {
          console.log("unlike", res);
          posts.map((pos, index) => {
            if (pos.postId === res.data.postId) {
              console.log("finded! unlike", index);
              let newPosts = [...posts];
              newPosts[index] = res.data;
              console.log("newPosts unlike", newPosts);
              setPostsData(newPosts);
            }
          });
          // update user likes in state
          setLikeStatus(false);
          let newLikes = userData.user.likes.filter(
            (like) => like.postId !== post.postId
          );
          setUserData({
            ...userData,
            user: {
              ...userData.user,
              likes: newLikes,
            },
          });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    function fetch() {
      if (userData.isAuth) {
        console.log("isAuth");
        userData.user.likes.map((like) => {
          if (post.postId === like.postId) {
            setLikeStatus(true);
            console.log("liked");
          }
        });
      } else {
        console.log("not isAuth");
        setLikeStatus(false);
      }
    }
    return fetch();
  }, [userData.isAuth, setLikeStatus]);

  return (
    <div className='postCard__content__line4__like'>
      {wasLiked ? (
        <div
          className='like__box unlike'
          onClick={(event) => {
            event.stopPropagation();
            unlikePost(userData.isAuth);
          }}
        >
          <i
            className='fas fa-heart'
            style={{
              color: theme.error,
            }}
          ></i>
          <div
            className='like__background'
            style={{
              background: theme.errorBackground,
            }}
          ></div>
        </div>
      ) : (
        <div
          className='like__box like'
          onClick={(event) => {
            event.stopPropagation();
            likePost(userData.isAuth);
          }}
        >
          <i
            className='fal fa-heart'
            style={{
              color: theme.mobileNavIcon,
            }}
          ></i>
          <div
            className='like__background'
            style={{
              background: theme.errorBackground,
            }}
          ></div>
        </div>
      )}

      {post.likeCount === 0 ? "" : post.likeCount}
    </div>
  );
};

export default LikeButton;
