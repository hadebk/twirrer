import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
// style
import "./PostDetails.scss";
// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

import Spinner from "../../components/Spinner/Spinner";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostCard from "../../components/PostCard/PostCard";
import ImageModal from "../../components/ImageModal/ImageModal";
import PostsContext from "../../context/PostsContext";

const PostDetails = (props) => {
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);
  const { posts, setPostsData } = useContext(PostsContext);

  //local state
  const [postId, setPostId] = useState(props.match.params.postId);
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("posts", posts);
    setLoading(true);
    PostService.getPostDetails(postId)
      .then((res) => {
        console.log(res.data);

        let result = res.data.post;
        result.postId = res.data.postId;
        console.log("posssssssssst", result);
        setPostData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [posts, postId]);

  const goToBack = () => {
    props.history.goBack();
  };

  return (
    <div
      className='postDetails-box'
      style={{ background: `${theme.background}` }}
    >
      <div
        className='postDetails-box__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <div
          className='postDetails-box__title__iconBox'
          onClick={() => goToBack()}
        >
          <i
            className='far fa-arrow-left'
            style={{ color: theme.mainColor }}
          ></i>
          <div
            className='postDetails-box__title__iconBox__background'
            style={{
              background: theme.secondaryColor,
            }}
          ></div>
        </div>
        <h1
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          {language.postDetails.title}
        </h1>
      </div>
      <div className='postDetails-box__post'>
        {loading ? (
          <div className='spinner'>
            <Spinner />
          </div>
        ) : (
          <PostCard post={postData} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
