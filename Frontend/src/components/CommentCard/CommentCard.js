import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style
import "./CommentCard.scss";

// libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";


const CommentCard = ({ comment, authorName }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //

  // date lib init
  dayjs.extend(relativeTime);
  const history = useHistory();
  
  var arabic = /[\u0600-\u06FF]/;


  return (
    <div className='commentCard'>
      <div className='commentCard__userImage'>
        <div className='commentCard__userImage__wrapper'>
          <Link to='#'>
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
              to='#'
              style={{
                color: theme.typoMain,
              }}
              className='commentCard__content__line1__userName'
            >
              {comment.userName}
            </Link>
            <span
              style={{
                color: theme.typoSecondary,
              }}
              className='commentCard__content__line1__time'
            >
              {" · " + dayjs(comment.createdAt).fromNow(true)}
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
              to='#'
              style={{
                color: theme.mainColor,
              }}
              className='commentCard__content__line2__authorName'
            >
              {"@" + authorName}
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
          {comment.commentContent}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
