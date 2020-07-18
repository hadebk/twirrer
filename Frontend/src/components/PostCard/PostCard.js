import React, { useContext } from "react";
import { Link } from "react-router-dom";

import variables from "../../style/CssVariables.scss";
import "./PostCard.scss";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const PostCard = ({ post }) => {
  // ******* start consume contexts ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end consume contexts ******* //
    dayjs.extend(relativeTime);
    var arabic = /[\u0600-\u06FF]/;
    
    
    return (
    <div className='postCard'>
      <div className='postCard__userImage'>
        <div className='postCard__userImage__wrapper'>
          <img
            className='postCard__userImage__wrapper__image'
            data-holder-rendered='true'
            src={post.profilePicture}
            alt='Profile Picture'
          />
        </div>
      </div>
      <div className='postCard__content'>
        <div
          className='postCard__content__line1'
          style={{ color: theme.typoMain }}
        >
          {post.userName} {" - "} {dayjs(post.createdAt).fromNow()}
        </div>
        <div
          className='postCard__content__line2'
          style={{
            color: theme.typoMain,
            textAlign: `${arabic.test(post.postContent) ? "right" : "left"}`,
          }}
        >
          {post.postContent}
        </div>
        <div
          className='postCard__content__line3'
          style={{ color: theme.mobileNavIcon}}
        >
          Image
        </div>
        <div
          className='postCard__content__line4'
          style={{ color: theme.mobileNavIcon}}
        >
          {post.likeCount} {" - "}
          {post.commentCount}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
