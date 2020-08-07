import React, { useContext } from "react";
import { Link } from "react-router-dom";

// style
import "./PostCardDetails.scss";

// assets
import Default from "../../assets/Images/default_pp.png";

// libraries
import moment from "moment-twitter";
import Linkify from "react-linkify";

// component
import DeletePostButton from "../../components/Buttons/DeletePostButton/DeletePostButton";
import CommentButton from "../../components/Buttons/CommentButton";
import LikeButton from "../../components/Buttons/LikeButton";
import LikesModal from "../../components/LikesModal/LikesModal";
import CheckVerifiedUserName from "../CheckVerifiedUserName";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import ImageModal from "../../components/ImageModal/ImageModal";

const PostCardDetails = ({ postData, likes, setLikes, setPostData }) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;
  // ******* end global state *******//

  var arabic = /[\u0600-\u06FF]/;

  return (
    <div
      className='postDetails__post'
      style={{
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div className='postDetails__post__header'>
        <div className='postDetails__post__header__userImage'>
          <div className='postDetails__post__header__userImage__wrapper'>
            <Link to={"/users/" + postData.userName}>
              <img
                className='postDetails__post__header__userImage__wrapper__image'
                src={
                  postData.profilePicture ? postData.profilePicture : Default
                }
                alt='profile'
              />
            </Link>
          </div>
        </div>
        <div className='postDetails__post__header__col2'>
          <div className='postDetails__post__header__col2__box'>
            <Link
              to={"/users/" + postData.userName}
              style={{
                color: theme.typoMain,
                direction: `${arabic.test(postData.userName) ? "rtl" : "ltr"}`,
              }}
              className='postDetails__post__header__col2__userName'
            >
              <CheckVerifiedUserName userName={postData.userName} />
            </Link>
            <span
              style={{
                color: theme.typoSecondary,
              }}
              className='postDetails__post__header__col2__time'
            >
              {moment(postData.createdAt).twitterShort()}
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
            direction: `${arabic.test(postData.postContent) ? "rtl" : "ltr"}`,
          }}
        >
          <Linkify>{postData.postContent}</Linkify>
        </div>
        {postData.postImage ? (
          <div
            className='postDetails__post__content__line3'
            style={{
              color: theme.typoSecondary,
              border: `1px solid ${theme.border}`,
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
              {language.postDetails.comments}
            </span>
          </div>
          <LikesModal likes={likes} postData={postData} />
        </div>
        <div
          className='postDetails__post__content__line4'
          style={{
            color: theme.mobileNavIcon,
          }}
        >
          <CommentButton post={postData} />
          <LikeButton
            post={postData}
            postData={postData}
            likes={likes}
            setPostData={setPostData}
            setLikes={setLikes}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCardDetails;
