import React, { useContext, useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
// style
import "./PostCard.scss";

// libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ImageModal from "../ImageModal/ImageModal";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

// component
import DeletePostButton from "../Buttons/DeletePostButton";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";

const PostCard = ({ post }) => {
  // ******* start consume contexts ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end consume contexts ******* //

  const [isHover, setHover] = useState(false);

  dayjs.extend(relativeTime);

  var arabic = /[\u0600-\u06FF]/;

  const history = useHistory();

  const child = () => {
    console.log("child");
  };

  const toggleHover = () => {
    setHover(!isHover);
  };

  var linkStyle = { borderBottom: `1px solid ${theme.border}` };
  if (isHover) {
    if (isLightTheme) {
      linkStyle.backgroundColor = "#F5F8FA";
    } else {
      linkStyle.backgroundColor = "#172430";
    }
  }

  return (
    <div
      className='postCard'
      style={linkStyle}
      onMouseEnter={() => toggleHover()}
      onMouseLeave={() => toggleHover()}
    >
      <div className='postCard__userImage'>
        <div className='postCard__userImage__wrapper'>
          <img
            className='postCard__userImage__wrapper__image'
            src={post.profilePicture}
            alt='profile'
          />
        </div>
      </div>
      <div className='postCard__content'>
        <div className='postCard__content__line1'>
          <div className='postCard__content__line1__box'>
            <span
              style={{
                color: theme.typoMain,
              }}
              className='postCard__content__line1__userName'
            >
              {post.userName}
            </span>
            <span
              style={{
                color: theme.mobileNavIcon,
              }}
              className='postCard__content__line1__time'
            >
              {" · " + dayjs(post.createdAt).fromNow(true)}
            </span>
          </div>
          <div className='postCard__content__line1__delete'>
            <DeletePostButton post={post} />
          </div>
        </div>
        <div
          className='postCard__content__line2'
          style={{
            color: theme.typoMain,
            textAlign: `${arabic.test(post.postContent) ? "right" : "left"}`,
            direction: `${arabic.test(post.postContent) ? "rtl" : "ltr"}`,
          }}
        >
          {post.postContent}
        </div>
        {post.postImage ? (
          <div
            className='postCard__content__line3'
            style={{
              color: theme.mobileNavIcon,
            }}
            onClick={(event) => {
              event.stopPropagation();
              child();
            }}
          >
            <ImageModal
              imageUrl={post.postImage}
              className='postCard__content__line3__image'
            />
          </div>
        ) : (
          ""
        )}

        <div
          className='postCard__content__line4'
          style={{
            color: theme.mobileNavIcon,
          }}
        >
          <CommentButton post={post} />
          <LikeButton post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
