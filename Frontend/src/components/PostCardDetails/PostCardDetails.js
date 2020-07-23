import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// style
import "./PostCardDetails.scss";

// assets
import Empty from "../../assets/Images/empty.svg";
import Default from "../../assets/Images/default_pp.png";

// libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import moment from "moment-twitter";

// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// component
import DeletePostButton from "../../components/Buttons/DeletePostButton";
import LikeButton from "../../components/Buttons/LikeButton";
import CommentButton from "../../components/Buttons/CommentButton";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import ImageModal from "../../components/ImageModal/ImageModal";
import PostsContext from "../../context/PostsContext";

const PostCardDetails = ({postData}) => {
      // ******* start global state *******//
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
                <Link to='#'>
                  <img
                    className='postDetails__post__header__userImage__wrapper__image'
                    src={
                      postData.profilePicture
                        ? postData.profilePicture
                        : Default
                    }
                    alt='profile picture'
                  />
                </Link>
              </div>
            </div>
            <div className='postDetails__post__header__col2'>
              <div className='postDetails__post__header__col2__box'>
                <Link
                  to='#'
                  style={{
                    color: theme.typoMain,
                  }}
                  className='postDetails__post__header__col2__userName'
                >
                  {postData.userName}
                </Link>
                <span
                  style={{
                    color: theme.typoSecondary,
                  }}
                  className='postDetails__post__header__col2__time'
                >
                  {/*dayjs(postData.createdAt).fromNow(true)*/}
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
                  color: theme.typoSecondary,
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
                  {language.postDetails.likes}
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
     );
}
 
export default PostCardDetails;