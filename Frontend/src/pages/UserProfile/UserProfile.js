import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// style
import "./UserProfile.scss";

// assets
import Empty from "../../assets/Images/empty.svg";
import Default from "../../assets/Images/default_pp.png";

// libraries
import dayjs from "dayjs";

// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// component
import Spinner from "../../components/Spinner/Spinner";
import ImageModal from "../../components/ImageModal/ImageModal";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const UserProfile = (props) => {
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

  // local state
  const [userName, setUserName] = useState(props.match.params.userName);
  const [userProfileData, setUserProfileData] = useState({
    friends: [],
    posts: [],
    user: {},
  });

  useEffect(() => {
    console.log("userData", userData);
    UserService.getUserDetails(userName)
      .then((res) => {
        console.log(res.data);
        setUserProfileData(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const goToBack = () => {
    props.history.goBack();
  };

  const location = userProfileData.user.location ? (
    <div
      style={{
        color: theme.typoSecondary,
      }}
    >
      <i className='fal fa-map-marker-alt'></i>
      {userProfileData.user.location}
    </div>
  ) : (
    ""
  );

  const website = userProfileData.user.website ? (
    <div
      style={{
        color: theme.typoSecondary,
      }}
    >
      <i className='fal fa-link'></i>
      <Link to={userProfileData.user.website}>
        {userProfileData.user.website}
      </Link>
    </div>
  ) : (
    ""
  );

  return (
    <div
      className='userProfile__main'
      style={{ background: `${theme.background}` }}
    >
      {/* Title section */}
      <div
        className='userProfile__main__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <div
          className='userProfile__main__title__iconBox'
          onClick={() => goToBack()}
        >
          <i
            className='far fa-arrow-left'
            style={{ color: theme.mainColor }}
          ></i>
          <div
            className='userProfile__main__title__iconBox__background'
            style={{
              background: theme.secondaryColor,
            }}
          ></div>
        </div>
        <div className='userProfile__main__title__textBox'>
          <h2
            style={{
              color: `${theme.typoMain}`,
            }}
          >
            {props.match.params.userName}
          </h2>
          <p>{userProfileData.posts.length} tweets</p>
        </div>
      </div>
      {/* user details section */}
      <div className='userProfile__main__userDetails'>
        {/* header image */}
        <div className='userProfile__main__userDetails__headerImageBox'>
          <ImageModal
            imageUrl={userProfileData.user.coverPicture}
            className='userProfile__main__userDetails__headerImageBox__image'
          />
        </div>
        {/* user data section */}
        <div
          className='userProfile__main__userDetails__userData'
          style={{
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div className='userProfile__main__userDetails__userData__pp'>
            <div
              className='userProfile__main__userDetails__userData__pp__userImageBox'
              style={{ border: `4px solid ${theme.background}` }}
            >
              <ImageModal
                imageUrl={userProfileData.user.profilePicture}
                className='userProfile__main__userDetails__userData__pp__userImageBox__userImage'
              />
            </div>
          </div>
          <div className='userProfile__main__userDetails__userData__buttonBox'>
            {userData.isAuth
              ? userName === userData.user.credentials.userName
                ? "profile edit"
                : "add friend"
              : "go to login"}
          </div>
          <div className='userProfile__main__userDetails__userData__userName'>
            <h2 style={{ color: theme.typoMain }}>
              {"@"}
              {userProfileData.user.userName}
            </h2>
          </div>
          <div className='userProfile__main__userDetails__userData__bio'>
            <p style={{ color: theme.typoMain }}>{userProfileData.user.bio}</p>
          </div>
          <div className='userProfile__main__userDetails__userData__extraData'>
            {location}
            {website}
            <div
              style={{
                color: theme.typoSecondary,
              }}
            >
              <i className='fal fa-calendar-alt'></i>
              {language.userProfile.joined}{" "}
              {dayjs(userProfileData.user.createdAt).format("MMMM YYYY")}
            </div>
          </div>
          <div className='userProfile__main__userDetails__userData__friends'>
            <span
              className='userProfile__main__userDetails__userData__friends__number'
              style={{
                color: theme.typoMain,
              }}
            >
              {userProfileData.friends.length}
            </span>{" "}
            <span
              className='userProfile__main__userDetails__userData__friends__word'
              style={{
                color: theme.typoSecondary,
              }}
            >
              {" "}
              {language.userProfile.friends}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
