import React, { useState, useContext, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";

// style
import "./UserProfile.scss";

// assets
import Empty from "../../assets/Images/empty.svg";
import DefaultAvatar from "../../assets/Images/default_pp.png";
import DefaultCover from "../../assets/Images/default_cp.png";

// libraries
import dayjs from "dayjs";
import Linkify from "react-linkify";

// api service
import UserService from "../../services/UserService";

// component
import ImageModal from "../../components/ImageModal/ImageModal";
import PostCard from "../../components/PostCard/PostCard";
import EditProfileImageButton from "../../components/Buttons/EditProfileImageButton/EditProfileImageButton";
import EditCoverImageButton from "../../components/Buttons/EditCoverImageButton/EditCoverImageButton";
import EditProfile from "../../components/Buttons/EditProfile/EditProfile";
import FriendsModal from "../../components/FriendsModal/FriendsModal";
import AddFriendButton from "../../components/Buttons/AddFriendButton/AddFriendButton";
import CheckVerifiedUserName from "../../components/CheckVerifiedUserName";
import Spinner from "../../components/Spinner/Spinner";

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
  const { userData } = useContext(UserContext);

  // posts context
  const { posts } = useContext(PostsContext);

  // ******* end global state *******//

  // local state
  const [userProfileData, setUserProfileData] = useState({
    friends: [],
    posts: [],
    user: {},
  });

  const [profileLoader, setProfileLoader] = useState(false);

  // set page title
  document.title = language.userProfile.pageTitle;

  // history init
  const history = useHistory();

  useEffect(() => {
    setProfileLoader(true);
    if (props.match.params.userName) {
      UserService.getUserDetails(props.match.params.userName)
        .then((res) => {
          setUserProfileData(res.data);
          setProfileLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setProfileLoader(false);
        });
    }
  }, [props.match.params.userName]);

  useEffect(() => {}, [userData.isAuth, setUserProfileData, posts]);

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
      <a
        href={userProfileData.user.website}
        rel='noopener noreferrer'
        target='_blank'
      >
        {userProfileData.user.website}
      </a>{" "}
    </div>
  ) : (
    ""
  );

  // direct to post details page on click on post
  const toPostDetails = (postID) => {
    history.push("/posts/" + postID);
  };

  const userPosts =
    userProfileData.posts.length > 0 ? (
      <Fragment>
        {userProfileData.posts.map((post) => {
          return (
            <div key={post.postId} onClick={() => toPostDetails(post.postId)}>
              <PostCard post={post} />
            </div>
          );
        })}
      </Fragment>
    ) : (
      <div className='posts__empty'>
        <img src={Empty} alt='empty' />
        <p
          style={{
            color: `${theme.typoSecondary}`,
          }}
        >
          {language.userProfile.noPosts}
        </p>
      </div>
    );

  const editAvatar = userData.isAuth ? (
    props.match.params.userName === userData.user.credentials.userName ? (
      <EditProfileImageButton
        userProfileData={userProfileData}
        setUserProfileData={setUserProfileData}
      />
    ) : (
      ""
    )
  ) : (
    ""
  );

  const editCover = userData.isAuth ? (
    props.match.params.userName === userData.user.credentials.userName ? (
      <EditCoverImageButton
        userProfileData={userProfileData}
        setUserProfileData={setUserProfileData}
      />
    ) : (
      ""
    )
  ) : (
    ""
  );

  return (
    <div
      className='userProfile__main'
      style={{ background: `${theme.background}` }}
    >
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
            <CheckVerifiedUserName userName={props.match.params.userName} />
          </h2>
          <p
            style={{
              color: `${theme.typoSecondary}`,
            }}
          >
            {userProfileData.posts.length} tweets
          </p>
        </div>
      </div>
      {/* user details section */}
      {profileLoader ? (
        <Spinner />
      ) : (
        <div className='userProfile__main__userDetails'>
          {/* header image */}
          <div className='userProfile__main__userDetails__headerImageBox'>
            <ImageModal
              imageUrl={
                userProfileData.user.coverPicture
                  ? userProfileData.user.coverPicture
                  : DefaultCover
              }
              className='userProfile__main__userDetails__headerImageBox__image'
            />
            {editCover}
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
                  imageUrl={
                    userProfileData.user.profilePicture
                      ? userProfileData.user.profilePicture
                      : DefaultAvatar
                  }
                  className='userProfile__main__userDetails__userData__pp__userImageBox__userImage'
                />
                {editAvatar}
              </div>
            </div>
            <div className='userProfile__main__userDetails__userData__buttonBox'>
              {userData.isAuth ? (
                props.match.params.userName ===
                userData.user.credentials.userName ? (
                  <EditProfile
                    userProfileData={userProfileData}
                    setUserProfileData={setUserProfileData}
                  />
                ) : (
                  <AddFriendButton
                    userName={props.match.params.userName}
                    userProfileData={userProfileData}
                    setUserProfileData={setUserProfileData}
                  />
                )
              ) : (
                <Link to='/login'>
                  <AddFriendButton
                    userName={""}
                    userProfileData={""}
                    setUserProfileData={""}
                  />
                </Link>
              )}
            </div>
            <div className='userProfile__main__userDetails__userData__userName'>
              <h2 style={{ color: theme.typoMain }}>
                <CheckVerifiedUserName
                  userName={userProfileData.user.userName}
                />
              </h2>
            </div>
            <div className='userProfile__main__userDetails__userData__bio'>
              <p style={{ color: theme.typoMain }}>
                <Linkify>{userProfileData.user.bio}</Linkify>
              </p>
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
            <FriendsModal
              userProfileData={userProfileData}
              setUserProfileData={setUserProfileData}
            />
          </div>
          {/* user post section */}
          <div className='userProfile__main__userDetails__posts'>
            {userPosts}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
