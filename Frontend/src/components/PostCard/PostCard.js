import React, { useContext, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

import variables from "../../style/CssVariables.scss";
import "./PostCard.scss";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const PostCard = ({ post, userData }) => {
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

  useEffect(() => {
    console.log("userData", userData);
  }, []);

  const deleteButton = userData.isAuth ? (
    post.userName == userData.user.credentials.userName ? (
      <Fragment>
        <i class='far fa-trash-alt' style={{ color: theme.error }}></i>
        <div
          className='background'
          style={{
            backgroundColor: theme.errorBackground,
          }}
        ></div>
      </Fragment>
    ) : (
      ""
    )
  ) : (
    ""
  );

  return (
    <div
      className='postCard'
      style={{ borderBottom: `1px solid ${theme.border}` }}
    >
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
        <div className='postCard__content__line1'>
          <div className='postCard__content__line1__box'>
            <span
              style={{ color: theme.typoMain }}
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
              {" · " + dayjs(post.createdAt).fromNow()}
            </span>
          </div>
          <div className='postCard__content__line1__delete'>{deleteButton}</div>
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
        {post.postImage ? (
          <div
            className='postCard__content__line3'
            style={{
              color: theme.mobileNavIcon,
            }}
          >
            <img
              src={post.postImage}
              alt='post image'
              className='postCard__content__line3__image'
            ></img>
          </div>
        ) : (
          ""
        )}

        <div
          className='postCard__content__line4'
          style={{ color: theme.mobileNavIcon }}
        >
          <div className='postCard__content__line4__comment'>
            <div className='comment__box'>
              <i class='fal fa-comment'></i>
              <div
                className='comment__background'
                style={{
                  background: theme.secondaryColor,
                }}
              ></div>
            </div>
            {post.commentCount == 0 ? "" : post.commentCount}
          </div>
          <div className='postCard__content__line4__like'>
            <div className='like__box'>
              <i class='fal fa-heart'></i>
              <div
                className='like__background'
                style={{
                  background: theme.errorBackground,
                }}
              ></div>
            </div>
            {post.likeCount == 0 ? "" : post.likeCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
