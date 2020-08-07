import React, { useState, useContext, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

// style file
import "./PinnedPost.scss";

// assets
import Default_pp from "../../assets/Images/default_pp.png";

// api service
import PostService from "../../services/PostService";

// libraries
import ImageModal from "../../components/ImageModal/ImageModal";
import moment from "moment-twitter";
import Linkify from "react-linkify";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

// component
import LikeButton from "../../components/Buttons/LikeButton";
import CommentButton from "../../components/Buttons/CommentButton";
import CheckVerifiedUserName from "../../components/CheckVerifiedUserName";
import Spinner from "../../components/Spinner/Spinner";

const PinnedPost = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end global state ******* //

  // local state
  const [isHover, setHover] = useState(false);
  const [PinnedPost, setPinnedPost] = useState({});
  const [PinnedPostLoad, setPinnedPostLoad] = useState(false);

  useEffect(() => {
    setPinnedPostLoad(true);
    PostService.PinnedPost()
      .then((res) => {
        setPinnedPost(res.data);
        setPinnedPostLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setPinnedPostLoad(false);
      });
  }, []);

  // lib init
  const history = useHistory();

  var arabic = /[\u0600-\u06FF]/;

  // add dynamic style on hover on post card
  const toggleHover = () => {
    setHover(!isHover);
  };

  // dynamic style on hover
  var linkStyle = { borderBottom: `10px solid ${theme.PinnedPostBorder}` };
  if (isHover) {
    if (isLightTheme) {
      linkStyle.backgroundColor = "#F5F8FA";
    } else {
      linkStyle.backgroundColor = "#172430";
    }
  }

  // direct to post details page on click on post
  const toPostDetails = (postID) => {
    history.push("/posts/" + postID);
  };

  return (
    <div
      className='PinnedPostCard'
      style={linkStyle}
      onMouseEnter={() => toggleHover()}
      onMouseLeave={() => toggleHover()}
      onClick={() => toPostDetails(PinnedPost.postId)}
    >
      {PinnedPostLoad ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='PinnedPostCard__userImage'>
            <div className='PinnedPostCard__userImage__wrapper'>
              <img
                className='PinnedPostCard__userImage__wrapper__image'
                src={
                  PinnedPost.profilePicture
                    ? PinnedPost.profilePicture
                    : Default_pp
                }
                alt='profile'
              />
            </div>
          </div>
          <div className='PinnedPostCard__content'>
            <div className='PinnedPostCard__content__line1'>
              <div className='PinnedPostCard__content__line1__box'>
                <span
                  style={{
                    color: theme.typoMain,
                    direction: `${
                      arabic.test(PinnedPost.userName) ? "rtl" : "ltr"
                    }`,
                  }}
                  className='PinnedPostCard__content__line1__userName'
                >
                  <CheckVerifiedUserName userName={PinnedPost.userName} />
                </span>
                <span
                  style={{
                    color: theme.mobileNavIcon,
                  }}
                  className='PinnedPostCard__content__line1__time'
                >
                  {/*" · " + dayjs(PinnedPost.createdAt).fromNow(true)*/}
                  {moment(PinnedPost.createdAt).twitterShort()}
                </span>
              </div>
              <div className='PinnedPostCard__content__line1__delete'>
                <i
                  className='fas fa-thumbtack'
                  style={{ color: theme.mobileNavIcon }}
                ></i>
              </div>
            </div>
            <div className='PinnedPostCard__content__pinnedHint'>
              <span style={{ color: theme.typoSecondary }}>
                {language.home.pinnedPost}
              </span>
            </div>
            <div
              className='PinnedPostCard__content__line2'
              style={{
                color: theme.typoMain,
                textAlign: `${
                  arabic.test(PinnedPost.postContent) ? "right" : "left"
                }`,
                direction: `${
                  arabic.test(PinnedPost.postContent) ? "rtl" : "ltr"
                }`,
              }}
            >
              <Linkify>{PinnedPost.postContent}</Linkify>
            </div>
            {PinnedPost.postImage ? (
              <div
                className='PinnedPostCard__content__line3'
                style={{
                  color: theme.mobileNavIcon,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <ImageModal
                  imageUrl={PinnedPost.postImage}
                  className='PinnedPostCard__content__line3__image'
                />
              </div>
            ) : (
              ""
            )}

            <div
              className='PinnedPostCard__content__line4'
              style={{
                color: theme.mobileNavIcon,
              }}
            >
              <CommentButton post={PinnedPost} />
              <LikeButton post={PinnedPost} />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default PinnedPost;
