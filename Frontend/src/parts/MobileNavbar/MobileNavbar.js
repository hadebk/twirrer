import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./MobileNavbar.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import LoginButton from "../../components/Buttons/LoginButton";
import SignupButton from "../../components/Buttons/SignupButton";

const MobileNavbar = () => {
  // ******* start consume contexts ******* //

  // theme context
  const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  // language context
  const { isEnglish, english, german, toggleLanguage } = useContext(
    LanguageContext
  );
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // ******* end consume contexts ******* //

  // local state
  const [isActive, setActive] = useState({
    home: true,
    notifications: false,
    profile: false,
  });

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
                          isActive.home ? theme.mainColor : theme.mobileNavIcon
                        }`,
                      }}
                    ></i>
                  </span>
                </Link>
              </div>
              {/* Notification Tab */}
              <div className='MobileNavber__box__tab'>
                <Link to='/' onClick={() => handleNotificationsClick()}>
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
                  </span>
                </Link>
              </div>
              {/* Profile Tab */}
              <div className='MobileNavber__box__tab'>
                <Link to='/' onClick={() => handleProfileClick()}>
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
                <span className='MobileNavber__box__tab__icon'>
                  <i
                    className='fal fa-ellipsis-h-alt'
                    style={{
                      color: theme.mobileNavIcon,
                    }}
                  ></i>
                </span>
              </div>
            </div>
            {/* -------------- End Tabs -------------- */}
          </div>
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
