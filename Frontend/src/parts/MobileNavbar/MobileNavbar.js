import React, { useState, useContext, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

// style file
import "./MobileNavbar.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";

// components
import LoginButton from "../../components/Buttons/LoginButton";
import SignupButton from "../../components/Buttons/SignupButton";
import SettingsButton from "../../components/Buttons/SettingsButton/SettingsButton";
import TwitternBtnNavbar from "../../components/Buttons/TwitternBtnNavbar/TwitternBtnNavbar";

const MobileNavbar = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // user context
  const { userData } = useContext(UserContext);

  // ******* end global state ******* //

  // local state
  const [isActive, setActive] = useState({
    home: true,
    notifications: false,
    profile: false,
  });

  const [notsCount, setNotsCount] = useState(0);

  useEffect(() => {
    if (userData.isAuth) {
      let userNotifications = userData.user.notifications;

      if (userNotifications && userNotifications.length > 0) {
        userNotifications.filter((not) => not.read === false).length > 0
          ? setNotsCount(
              userNotifications.filter((not) => not.read === false).length
            )
          : setNotsCount(0);
      } else {
        setNotsCount(0);
      }
    }
  }, [userData.isAuth]);

  const clearCounter = () => {
    setNotsCount(0);
  };

  const handleHomeClick = () =>
    setActive({ home: true, notifications: false, profile: false });

  const handleNotificationsClick = () =>
    setActive({ notifications: true, home: false, profile: false });

  const handleProfileClick = () =>
    setActive({ profile: true, home: false, notifications: false });

  return (
    <div className='MobileNavber'>
      <div
        className='MobileNavber__main'
        style={{
          background: `${theme.background}`,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        {userData.isAuth ? (
          <Fragment>
            <div className='MobileNavber__box__twitternButton'>
              <TwitternBtnNavbar />
            </div>
            <div className='MobileNavber__box'>
              {/* -------------- Start Tabs -------------- */}
              <div className='MobileNavber__box__tabs'>
                {/* Home Tab */}
                <div className='MobileNavber__box__tab'>
                  <Link to='/' onClick={() => handleHomeClick()}>
                    <span className='MobileNavber__box__tab__icon'>
                      <i
                        className={
                          isActive.home ? "fas fa-home-alt" : "fal fa-home-alt"
                        }
                        style={{
                          color: `${
                            isActive.home
                              ? theme.mainColor
                              : theme.mobileNavIcon
                          }`,
                        }}
                      ></i>
                    </span>
                  </Link>
                </div>
                {/* Notification Tab */}
                <div className='MobileNavber__box__tab' onClick={clearCounter}>
                  <Link
                    to='/notifications'
                    onClick={() => handleNotificationsClick()}
                  >
                    <span className='MobileNavber__box__tab__icon'>
                      <i
                        className={
                          isActive.notifications ? "fas fa-bell" : "fal fa-bell"
                        }
                        style={{
                          color: `${
                            isActive.notifications
                              ? theme.mainColor
                              : theme.mobileNavIcon
                          }`,
                        }}
                      ></i>
                      {notsCount > 0 && (
                        <span
                          style={{
                            backgroundColor: theme.mainColor,
                            border: `2px solid ${theme.background}`,
                            color: "#fff",
                          }}
                        >
                          {notsCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </div>
                {/* Profile Tab */}
                <div className='MobileNavber__box__tab'>
                  <Link
                    to={"/users/" + userData.user.credentials.userName}
                    onClick={() => handleProfileClick()}
                  >
                    <span className='MobileNavber__box__tab__icon'>
                      <i
                        className={
                          isActive.profile ? "fas fa-user" : "fal fa-user"
                        }
                        style={{
                          color: `${
                            isActive.profile
                              ? theme.mainColor
                              : theme.mobileNavIcon
                          }`,
                        }}
                      ></i>
                    </span>
                  </Link>
                </div>
                {/* More Tab */}
                <div className='MobileNavber__box__tab'>
                  <Link to='#'>
                    <SettingsButton
                      className='MobileNavber__box__tab__icon'
                      color={theme.mobileNavIcon}
                    />
                  </Link>
                </div>
              </div>
              {/* -------------- End Tabs -------------- */}
            </div>
          </Fragment>
        ) : (
          <div className='buttons__box'>
            <LoginButton />
            <SignupButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
