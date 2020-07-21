import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
// style
import "./PostDetails.scss";

// libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// component
import DeletePostButton from "../../components/Buttons/DeletePostButton";
import LikeButton from "../../components/Buttons/LikeButton";
import CommentButton from "../../components/Buttons/CommentButton";
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

  dayjs.extend(relativeTime);

  var arabic = /[\u0600-\u06FF]/;

  return (
    <div
      className='postDetails__main'
      style={{ background: `${theme.background}` }}
    >
      <div
        className='postDetails__main__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <div
          className='postDetails__main__title__iconBox'
          onClick={() => goToBack()}
        >
          <i
            className='far fa-arrow-left'
            style={{ color: theme.mainColor }}
          ></i>
          <div
            className='postDetails__main__title__iconBox__background'
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
      <div className='postDetails'>
        {loading ? (
          <div className='spinner'>
            <Spinner />
          </div>
        ) : (
          <div
            className='postDetails__post'
            style={{
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div className='postDetails__post__header'>
              <div className='postDetails__post__header__userImage'>
                <div className='postDetails__post__header__userImage__wrapper'>
                  <img
                    className='postDetails__post__header__userImage__wrapper__image'
                    src={postData.profilePicture}
                    alt='profile'
                  />
                </div>
              </div>
              <div className='postDetails__post__header__col2'>
                <div className='postDetails__post__header__col2__box'>
                  <span
                    style={{
                      color: theme.typoMain,
                    }}
                    className='postDetails__post__header__col2__userName'
                  >
                    {postData.userName}
                  </span>
                  <span
                    style={{
                      color: theme.mobileNavIcon,
                    }}
                    className='postDetails__post__header__col2__time'
                  >
                    {dayjs(postData.createdAt).fromNow()}
                  </span>
                </div>
                <div className='postDetails__post__header__col2__delete'>
                  <DeletePostButton post={postData} />
                </div>
              </div>
            </div>
            <div className='postDetails__post__content'>
              <div
                className='postDetails__post__content__line2'
                style={{
                  color: theme.typoMain,
                  textAlign: `${
                    arabic.test(postData.postContent) ? "right" : "left"
                  }`,
                  direction: `${
                    arabic.test(postData.postContent) ? "rtl" : "ltr"
                  }`,
                }}
              >
                {postData.postContent}
              </div>
              {postData.postImage ? (
                <div
                  className='postDetails__post__content__line3'
                  style={{
                    color: theme.mobileNavIcon,
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    //child();
                  }}
                >
                  <ImageModal
                    imageUrl={postData.postImage}
                    className='postDetails__post__content__line3__image'
                  />
                </div>
              ) : (
                ""
              )}

              <div
                className='postDetails__post__content__counters'
                style={{
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <div className='postDetails__post__content__counters__comments'>
                  <span
                    className='postDetails__post__content__counters__numbers'
                    style={{
                      color: `${theme.typoMain}`,
                    }}
                  >
                    {postData.commentCount}
                  </span>
                  <span
                    style={{
                      color: `${theme.typoSecondary}`,
                    }}
                  >
                    Comments
                  </span>
                </div>
                <div className='postDetails__post__content__counters__likes'>
                  <span
                    className='postDetails__post__content__counters__numbers'
                    style={{
                      color: `${theme.typoMain}`,
                    }}
                  >
                    {postData.likeCount}
                  </span>
                  <span
                    style={{
                      color: `${theme.typoSecondary}`,
                    }}
                  >
                    Likes
                  </span>
                </div>
              </div>
              <div
                className='postDetails__post__content__line4'
                style={{
                  color: theme.mobileNavIcon,
                }}
              >
                <CommentButton post={postData} />
                <LikeButton post={postData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
