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
  // ******* end global state *******//

  // local state
  const [isLoading, setLoading] = useState(false);

  var ButtonDisabledFlag =
    textarea.value.trim().length > 0 || imageStatus.select ? false : true;

  const sharePost = () => {
    if (textarea.value.trim().length > 0 && !imageStatus.select) {
      // post with text only
      setLoading(true);
      let post = {
        postContent: textarea.value.trim(),
        postImage: null,
      };
      PostService.addNewPost(post, userData.token)
        .then((res) => {
          return res;
        })
        .then((res) => {
          // add this post to global state to show it immediately
          let newPosts = [...posts];
          newPosts.unshift(res.data);
          setPostsData(newPosts);
          // clear inputs
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
      ///////////////////////////////////////////////////////////////////
    } else if (imageStatus.select && textarea.value.trim().length === 0) {
      // post with image only
      setLoading(true);
      const formData = new FormData();
      if (imageStatus.image.name) {
        formData.append("image", imageStatus.image, imageStatus.image.name);
        // 1- upload image to server and get url
        PostService.uploadPostImage(formData, userData.token)
          .then((res) => {
            let url = res.data.postImage;
            return url;
          })
          .then((url) => {
            // 2- get image url, and send the post to server
            let post = {
              postContent: "",
              postImage: url,
            };
            PostService.addNewPost(post, userData.token)
              .then((res) => {
                return res;
              })
              .then((res) => {
                // add this post to global state to show it immediately
                let newPosts = [...posts];
                newPosts.unshift(res.data);
                setPostsData(newPosts);
                // clear inputs
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
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            // close the modal
            if (setOpen) {
              setOpen(false);
            }
          });
      }
      /////////////////////////////////////////////////////////////////
    } else if (imageStatus.select && textarea.value.trim().length > 0) {
      // post with image & text
      setLoading(true);
      const formData = new FormData();
      if (imageStatus.image.name) {
        formData.append("image", imageStatus.image, imageStatus.image.name);
        // 1- upload image to server and get url
        PostService.uploadPostImage(formData, userData.token)
          .then((res) => {
            let url = res.data.postImage;
            return url;
          })
          .then((url) => {
            // 2- get image url, and send the post to server
            let post = {
              postContent: textarea.value.trim(),
              postImage: url,
            };
            PostService.addNewPost(post, userData.token)
              .then((res) => {
                return res;
              })
              .then((res) => {
                // add this post to global state to show it immediately
                let newPosts = [...posts];
                newPosts.unshift(res.data);
                setPostsData(newPosts);
                // clear inputs
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
                console.log( err);
                setLoading(false);
                // close the modal
                if (setOpen) {
                  setOpen(false);
                }
              });
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            // close the modal
            if (setOpen) {
              setOpen(false);
            }
          });
      }
    }
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
