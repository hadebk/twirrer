import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// style file
import "./CurrentUser.scss";

// assets
import default_pp from "../../assets/Images/default_pp.png";

// components
import Spinner from "../../components/Spinner/Spinner";
import CheckVerifiedUserName from "../../components/CheckVerifiedUserName";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const CurrentUser = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // ******* end global state ******* //

  useEffect(() => {}, [userData.isAuth, setUserData]);

  return (
    <div className='currentUser' style={{ backgroundColor: theme.foreground }}>
      {userData.isAuth ? (
        <>
          <div className='currentUser__userImage'>
            <Link to={"/users/" + userData.user.credentials.userName}>
              <img
                alt='profile'
                src={
                  userData.user.credentials.profilePicture
                    ? userData.user.credentials.profilePicture
                    : default_pp
                }
              />
              <div
                className='currentUser__userImage__greenDot'
                style={{ border: `2px solid ${theme.background}` }}
              ></div>
            </Link>
          </div>
          <div className='currentUser__userName'>
            <Link
              to={"/users/" + userData.user.credentials.userName}
              style={{ color: theme.typoMain }}
            >
              <h2 style={{ color: theme.typoMain }}>
                <CheckVerifiedUserName
                  userName={userData.user.credentials.userName}
                />
              </h2>
            </Link>
            <p style={{ color: theme.typoSecondary }}>
              {userData.user.friends.length} {language.userProfile.friends}
            </p>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default CurrentUser;
