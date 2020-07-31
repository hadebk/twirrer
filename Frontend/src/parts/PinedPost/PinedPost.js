import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./PinedPost.scss";
// Global vars import
import variables from "../../style/CssVariables.scss";

// api service
import PostService from "../../services/PostService";

// libraries
import ImageModal from "../../components/ImageModal/ImageModal";
import moment from "moment-twitter";
import Linkify from "react-linkify";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

// component
import DeletePostButton from "../../components/Buttons/DeletePostButton";
import LikeButton from "../../components/Buttons/LikeButton";
import CommentButton from "../../components/Buttons/CommentButton";
import Spinner from "../../components/Spinner/Spinner";

const PinedPost = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // ******* end global state ******* //

  // local state
  const [isHover, setHover] = useState(false);
  const [pinedPost, setPinedPost] = useState({});
  const [pinedPostLoad, setPinedPostLoad] = useState(false);

  useEffect(() => {
    setPinedPostLoad(true);
    PostService.pinedPost()
      .then((res) => {
        console.log("pined post: ", res.data);
        setPinedPost(res.data);
        setPinedPostLoad(false);
      })
      .catch((err) => {
        console.log("pined post: ", err);
        setPinedPostLoad(false);
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
  var linkStyle = { borderBottom: `10px solid ${theme.pinedPostBorder}` };
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
      className='pinedPostCard'
      style={linkStyle}
      onMouseEnter={() => toggleHover()}
      onMouseLeave={() => toggleHover()}
      onClick={() => toPostDetails("U9iQtuYsvtVuHoH2A2Rk")}
    >
      <div className='pinedPostCard__userImage'>
        <div className='pinedPostCard__userImage__wrapper'>
          <img
            className='pinedPostCard__userImage__wrapper__image'
            src={pinedPost.profilePicture}
            alt='profile'
          />
        </div>
      </div>
      <div className='pinedPostCard__content'>
        <div className='pinedPostCard__content__line1'>
          <div className='pinedPostCard__content__line1__box'>
            <span
              style={{
                color: theme.typoMain,
                direction: `${arabic.test(pinedPost.userName) ? "rtl" : "ltr"}`,
              }}
              className='pinedPostCard__content__line1__userName'
            >
              {pinedPost.userName}
            </span>
            <span
              style={{
                color: theme.mobileNavIcon,
              }}
              className='pinedPostCard__content__line1__time'
            >
              {/*" · " + dayjs(pinedPost.createdAt).fromNow(true)*/}
              {moment(pinedPost.createdAt).twitterShort()}
            </span>
          </div>
          <div className='pinedPostCard__content__line1__delete'>
            <DeletePostButton post={pinedPost} />
          </div>
        </div>
        <div
          className='pinedPostCard__content__line2'
          style={{
            color: theme.typoMain,
            textAlign: `${
              arabic.test(pinedPost.postContent) ? "right" : "left"
            }`,
            direction: `${arabic.test(pinedPost.postContent) ? "rtl" : "ltr"}`,
          }}
        >
          <Linkify>{pinedPost.postContent}</Linkify>
        </div>
        {pinedPost.postImage ? (
          <div
            className='pinedPostCard__content__line3'
            style={{
              color: theme.mobileNavIcon,
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <ImageModal
              imageUrl={pinedPost.postImage}
              className='pinedPostCard__content__line3__image'
            />
          </div>
        ) : (
          ""
        )}

        <div
          className='pinedPostCard__content__line4'
          style={{
            color: theme.mobileNavIcon,
          }}
        >
          <CommentButton post={pinedPost} />
          <LikeButton post={pinedPost} />
        </div>
      </div>
    </div>
  );
};

export default PinedPost;
