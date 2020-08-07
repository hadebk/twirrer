import React, { useContext } from "react";
import { Link } from "react-router-dom";

// style
import "./CommentCard.scss";

// libraries
import moment from "moment-twitter";
import Linkify from "react-linkify";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import CheckVerifiedUserName from "../CheckVerifiedUserName";

const CommentCard = ({ comment, authorName }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end global state ******* //

  var arabic = /[\u0600-\u06FF]/;

  return (
    <div
      className='commentCard'
      style={{
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div className='commentCard__userImage'>
        <div className='commentCard__userImage__wrapper'>
          <Link to={"/users/" + comment.userName}>
            <img
              className='commentCard__userImage__wrapper__image'
              src={comment.profilePicture}
              alt='profile'
            />
          </Link>
        </div>
      </div>
      <div className='commentCard__content'>
        <div className='commentCard__content__line1'>
          <div className='commentCard__content__line1__box'>
            <Link
              to={"/users/" + comment.userName}
              style={{
                color: theme.typoMain,
                direction: `${arabic.test(comment.userName) ? "rtl" : "ltr"}`,
              }}
              className='commentCard__content__line1__userName'
            >
              <CheckVerifiedUserName userName={comment.userName} />
            </Link>
            <span
              style={{
                color: theme.typoSecondary,
              }}
              className='commentCard__content__line1__time'
            >
              {moment(comment.createdAt).twitterShort()}
            </span>
          </div>
        </div>
        <div className='commentCard__content__line2'>
          <div className='commentCard__content__line2__box'>
            <span
              style={{
                color: theme.typoSecondary,
              }}
              className='commentCard__content__line2__text'
            >
              {language.postDetails.replyingTo}
            </span>
            <Link
              to={"/users/" + authorName}
              style={{
                color: theme.mainColor,
              }}
              className='commentCard__content__line2__authorName'
            >
              {'@'}<CheckVerifiedUserName userName={authorName} />
            </Link>
          </div>
        </div>
        <div
          className='commentCard__content__line2__content'
          style={{
            color: theme.typoMain,
            textAlign: `${
              arabic.test(comment.commentContent) ? "right" : "left"
            }`,
            direction: `${arabic.test(comment.commentContent) ? "rtl" : "ltr"}`,
          }}
        >
          <Linkify>{comment.commentContent}</Linkify>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
