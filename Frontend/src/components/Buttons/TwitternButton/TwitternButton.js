import React, { useContext, useState } from "react";

// style
import "./TwitternButton.scss";
// Global vars import
import variables from "../../../style/CssVariables.scss";

// api service
import PostService from "../../../services/PostService";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import { LanguageContext } from "../../../context/LanguageContext";
import UserContext from "../../../context/UserContext";
import PostsContext from "../../../context/PostsContext";
import UserProfileContext from "../../../context/UserProfileContext";

const TwitternButton = ({
  textarea,
  setTextarea,
  imageStatus,
  setImageStatus,
  setOpen,
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

  // local state
  const [isLoading, setLoading] = useState(false);

  var ButtonDisabledFlag =
    textarea.value.trim().length > 0 || imageStatus.select ? false : true;

  // add new post
  const sharePost = async () => {
    setLoading(true);
    let postTextContent = textarea.value.trim();
    let post = {
      postContent: postTextContent.length > 0 ? postTextContent : "",
      postImage: null,
    };

    // check if the post contain image also
    if (imageStatus.select) {
      // the post has image
      const formData = new FormData();
      formData.append("image", imageStatus.image, imageStatus.image.name);
      // upload image to server and get url
      await PostService.uploadPostImage(formData, userData.token)
        .then((res) => {
          let url = res.data.postImage;
          post.postImage = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // add post to database
    PostService.addNewPost(post, userData.token)
      .then((res) => {
        return res;
      })
      .then((res) => {
        let newPosts = [...posts];
        // add the new post at index 1 in posts state (global state), because index 0 is reserved for pinned post
        newPosts.splice(1, 0, res.data);

        // 1- add the new post to global state to show it immediately in home page
        setPostsData(newPosts);

        // 2- update posts in session storage (cache)
        window.sessionStorage.setItem("posts", JSON.stringify(newPosts));

        // 3- add this post to user profile data (global state),
        // only if current profile belongs to the logged in user.
        if (
          userProfileData.user.userName === userData.user.credentials.userName
        ) {
          let userNewPosts = [...userProfileData.posts];
          userNewPosts.unshift(res.data);
          setUserProfileData({
            ...userProfileData,
            posts: userNewPosts,
          });
        }

        // 4- update user profile data in session storage (cache)
        // get user profile data from cache
        let cachedUserProfileData = JSON.parse(
          window.sessionStorage.getItem(userData.user.credentials.userName)
        );
        if (cachedUserProfileData) {
          let userNewPostsCache = [...cachedUserProfileData.posts];
          userNewPostsCache.unshift(res.data);
          window.sessionStorage.setItem(
            userData.user.credentials.userName,
            JSON.stringify({
              ...cachedUserProfileData,
              posts: userNewPostsCache,
            })
          );
        }

        // 5- clear inputs
        setTextarea({
          value: "",
          rows: 1,
          minRows: 1,
          maxRows: 100,
        });
        setImageStatus({
          select: false,
          imagePath: null,
          image: "",
        });
        setLoading(false);
        // close the modal
        if (setOpen) {
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        // close the modal
        if (setOpen) {
          setOpen(false);
        }
      });
  };

  return (
    <button
      className='postButton'
      style={{
        color: "#fff",
        backgroundColor: theme.mainColor,
        borderRadius: variables.radius,
        opacity: ButtonDisabledFlag || isLoading ? 0.6 : 1,
      }}
      onClick={sharePost}
      disabled={ButtonDisabledFlag || isLoading}
    >
      {isLoading
        ? language.home.addPostButtonLoading
        : language.home.addPostButton}
    </button>
  );
};

export default TwitternButton;
