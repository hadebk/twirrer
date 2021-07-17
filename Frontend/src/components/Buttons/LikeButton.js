/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";
import UserProfileContext from "../../context/UserProfileContext";

const LikeButton = ({ post, postData, likes, setLikes, setPostData }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // user profile data context
  const { userProfileData, setUserProfileData } =
    useContext(UserProfileContext);
  // ******* end global state ******* //

  // local state
  const [wasLiked, setLikeStatus] = useState(false);
  const [likes_count, setLikes_count] = useState(
    post.likeCount ? post.likeCount : 0
  );

  // history init
  const history = useHistory();

  const likesDependency = userData.isAuth ? userData.user.likes : "";

  useEffect(() => {
    setLikes_count(post.likeCount);
    setLikeStatus(false); // like status is false by default
    if (userData.isAuth) {
      /**
       * when user logged in and open the app,
       * fill like button of all posts that user have liked them before
       */
      userData.user.likes.map((like) => {
        if (post.postId === like.postId) {
          setLikeStatus(true);
        }
      });
    }
  }, [post.likeCount, post.postId, userData.isAuth, likesDependency]);

  const likePost = (isAuth) => {
    if (isAuth) {
      PostService.LikePost(post.postId, userData.token)
        .then((res) => {
          setLikes_count(res.data.likeCount);
          setLikeStatus(true);

          // 1- update post in posts (in global state) array
          posts.map((pos, index) => {
            if (pos.postId === res.data.postId) {
              let newPosts = [...posts];
              newPosts[index] = res.data;
              setPostsData(newPosts);
              // 2- update posts cache in session storage (cache)
              window.sessionStorage.setItem("posts", JSON.stringify(newPosts));
            }
          });

          // 3- update user likes (in global state) array
          let user_newLikes = userData.user.likes;
          user_newLikes.push({
            postId: post.postId,
            profilePicture: userData.user.credentials.profilePicture,
            userName: userData.user.credentials.userName,
          });
          setUserData({
            ...userData,
            user: {
              ...userData.user,
              likes: user_newLikes,
            },
          });

          // 4- update user data cache in session storage (cache)
          window.sessionStorage.setItem(
            "CacheUserData",
            JSON.stringify({
              ...userData,
              user: {
                ...userData.user,
                likes: user_newLikes,
              },
            })
          );

          // 5- update current post in session storage (cache)
          let cachedCurrentPost = JSON.parse(
            window.sessionStorage.getItem(res.data.postId)
          );
          if (cachedCurrentPost) {
            window.sessionStorage.setItem(
              res.data.postId,
              JSON.stringify({
                postContent: res.data,
                postComments: cachedCurrentPost.postComments,
                postLikes: cachedCurrentPost.postLikes.concat({
                  postId: post.postId,
                  profilePicture: userData.user.credentials.profilePicture,
                  userName: userData.user.credentials.userName,
                }),
              })
            );
          }

          // 6- update post in userProfileData (global state)
          // check if likedPost belongs to current user in userProfileData state(global)
          if (userProfileData.user.userName === res.data.userName) {
            userProfileData.posts.map((pos, index) => {
              if (pos.postId === res.data.postId) {
                let userNewPosts = [...userProfileData.posts];
                userNewPosts[index] = res.data;
                setUserProfileData({
                  ...userProfileData,
                  posts: userNewPosts,
                });
              }
            });
          }

          // 7- update user profile cache with new like count in session storage (cache)
          let cachedUserProfileData = JSON.parse(
            window.sessionStorage.getItem(post.userName)
          );
          if (cachedUserProfileData) {
            cachedUserProfileData.posts.map((pos, index) => {
              if (pos.postId === res.data.postId) {
                let userNewPostsCache = [...cachedUserProfileData.posts];
                userNewPostsCache[index] = res.data;
                window.sessionStorage.setItem(
                  post.userName,
                  JSON.stringify({
                    ...cachedUserProfileData,
                    posts: userNewPostsCache,
                  })
                );
              }
            });
          }

          /** those 2 changes will be executed only when user click like button
           *  from postDetailsPage
           * */
          // 1- update postData in PostDetails Page
          if (postData) {
            setPostData(res.data);
          }

          // 2- update likes in PostDetails page
          if (likes) {
            let post_newLikes = [...likes];
            post_newLikes.unshift({
              postId: post.postId,
              profilePicture: userData.user.credentials.profilePicture,
              userName: userData.user.credentials.userName,
            });
            setLikes(post_newLikes);
          }
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
      PostService.unlikePost(post.postId, userData.token)
        .then((res) => {
          setLikes_count(res.data.likeCount);
          setLikeStatus(false);

          // 1- update post in posts (in global state) array
          posts.map((pos, index) => {
            if (pos.postId === res.data.postId) {
              let newPosts = [...posts];
              newPosts[index] = res.data;
              setPostsData(newPosts);
              // 2- update posts cache in session storage (cache)
              window.sessionStorage.setItem("posts", JSON.stringify(newPosts));
            }
          });

          // =3- update user likes (in global state) array
          let user_newLikes = userData.user.likes.filter(
            (like) => like.postId !== post.postId
          );
          setUserData({
            ...userData,
            user: {
              ...userData.user,
              likes: user_newLikes,
            },
          });

          // 4- update user data cache in session storage (cache)
          window.sessionStorage.setItem(
            "CacheUserData",
            JSON.stringify({
              ...userData,
              user: {
                ...userData.user,
                likes: user_newLikes,
              },
            })
          );

          // 5- update current post's in session storage (cache)
          let cachedCurrentPost = JSON.parse(
            window.sessionStorage.getItem(res.data.postId)
          );
          if (cachedCurrentPost) {
            let filteredPostLikes = cachedCurrentPost.postLikes.filter(
              (like) => like.userName !== userData.user.credentials.userName
            );
            window.sessionStorage.setItem(
              res.data.postId,
              JSON.stringify({
                postContent: res.data,
                postComments: cachedCurrentPost.postComments,
                postLikes: filteredPostLikes,
              })
            );
          }

          // 6- update post in userProfileData (global state)
          // check if likedPost belongs to current user in userProfileData state(global)
          if (userProfileData.user.userName === res.data.userName) {
            userProfileData.posts.map((pos, index) => {
              if (pos.postId === res.data.postId) {
                let userNewPosts = [...userProfileData.posts];
                userNewPosts[index] = res.data;
                setUserProfileData({
                  ...userProfileData,
                  posts: userNewPosts,
                });
              }
            });
          }

          // 7- update user profile cache with new like number in session storage (cache)
          let cachedUserProfileData = JSON.parse(
            window.sessionStorage.getItem(post.userName)
          );
          if (cachedUserProfileData) {
            cachedUserProfileData.posts.map((pos, index) => {
              if (pos.postId === res.data.postId) {
                let userNewPostsCache = [...cachedUserProfileData.posts];
                userNewPostsCache[index] = res.data;
                window.sessionStorage.setItem(
                  post.userName,
                  JSON.stringify({
                    ...cachedUserProfileData,
                    posts: userNewPostsCache,
                  })
                );
              }
            });
          }

          /** those 2 changes will be executed only when user click like button
           *  from postDetailsPage
           * */
          // 1- update postData in PostDetails Page
          if (postData) {
            setPostData(res.data);
          }
          // 2- update likes in PostDetails page
          let post_newLikes_inDetailsPage;
          if (likes) {
            post_newLikes_inDetailsPage = [...likes].filter(
              (like) => like.userName !== userData.user.credentials.userName
            );
            setLikes(post_newLikes_inDetailsPage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push("/login");
    }
  };

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
      <div
        className='likesCount'
        style={{ color: wasLiked ? theme.error : theme.mobileNavIcon }}
      >
        {likes_count === 0 ? "" : likes_count}
      </div>
    </div>
  );
};

export default LikeButton;
