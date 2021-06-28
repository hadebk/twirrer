import React, { useContext, useState } from "react";

// style
import "./PostCard.scss";

// libraries
import ImageModal from "../ImageModal/ImageModal";
import moment from "moment-twitter";
import Linkify from "react-linkify";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";

// component
import DeletePostButton from "../Buttons/DeletePostButton/DeletePostButton";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import CheckVerifiedUserName from "../CheckVerifiedUserName";

const PostCard = ({ post }) => {
  // ******* start global state ******* //
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // user context
  const { userData } = useContext(UserContext);
  // ******* end global state ******* //

  // local state
  const [isHover, setHover] = useState(false);

  var arabic = /[\u0600-\u06FF]/;

  // add dynamic style on hover on post card
  const toggleHover = () => {
    setHover(!isHover);
  };

  // dynamic style on hover
  var linkStyle = { borderBottom: `1px solid ${theme.border}` };
  if (isHover) {
    if (isLightTheme) {
      linkStyle.backgroundColor = "#F5F8FA";
    } else {
      linkStyle.backgroundColor = "#172430";
    }
  }

  const ProfilePicture = userData.isAuth
    ? post.userName === userData.user.credentials.userName
      ? userData.user.credentials.profilePicture
      : post.profilePicture
    : post.profilePicture;

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
            src={ProfilePicture}
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
                direction: `${arabic.test(post.userName) ? "rtl" : "ltr"}`,
              }}
              className='postCard__content__line1__userName'
            >
              <CheckVerifiedUserName userName={post.userName} />
            </span>
            <span
              style={{
                color: theme.mobileNavIcon,
              }}
              className='postCard__content__line1__time'
            >
              {moment(post.createdAt).twitterShort()}
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
          <Linkify>{post.postContent}</Linkify>
        </div>
        {post.postImage ? (
          <div
            className='postCard__content__line3'
            style={{
              color: theme.mobileNavIcon,
              border: `1px solid ${theme.border}`,
            }}
            onClick={(event) => {
              event.stopPropagation();
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
