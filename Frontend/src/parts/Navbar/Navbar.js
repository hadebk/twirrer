import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./Navbar.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import LoginButton from "../../components/Buttons/LoginButton";
import SignupButton from "../../components/Buttons/SignupButton";

const Navbar = () => {
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
    <div className='Navbar'>
      <div
        className='Navbar__main'
        style={{
          backgroundColor: `${theme.background}`,
          borderRight: `1px solid ${theme.border}`,
        }}
      >
        {userData.isAuth ? (
          <div className='Navbar__box'>
            <div className='Navbar__box__logo'>
              <div className='Navbar__box__logo__box'>
                <svg
                  viewBox='0 0 24 24'
                  className='logo__svg'
                  style={{ fill: `${theme.logo}` }}
                >
                  <g>
                    <path d='M 24 5 c -0.835 0.37 -1.732 0.62 -2.675 0.733 c 0.962 -0.576 1.7 -1.49 2.048 -2.578 c -0.9 0.534 -1.897 0.922 -2.958 1.13 c -0.85 -0.904 -2.06 -1.47 -3.4 -1.47 c -2.572 0 -4.658 2.086 -4.658 4.66 c 0 0.364 0.042 0.718 0 3.588 c -5.357 -0.063 -7.304 -2.05 -9.602 -4.868 c -0.4 0.69 -0.63 1.49 -0.63 2.342 c 0 1.616 0.823 3.043 2.072 3.878 c -0.764 -0.025 -1.482 -0.234 -2.11 -0.583 v 0.06 c 0 2.257 1.605 4.14 3.737 4.568 c -0.392 0.106 -0.803 0.162 -1.227 0.162 c -0.3 0 -0.593 -0.028 -0.877 -0.082 c 0.593 1.85 2.313 3.198 4.352 3.234 c -1.595 1.25 -3.604 1.995 -5.786 1.995 c -0.376 0 -0.747 -0.022 -1.112 -0.065 c 2.062 1.323 4.51 2.093 7.14 2.093 c 8.57 0 15.686 -5.797 13.255 -13.254 c 0 -0.2 -0.569 -0.543 0.431 -2.543 z'></path>
                  </g>
                </svg>
              </div>
            </div>
            {/* -------------- Start Tabs -------------- */}
            <div className='Navbar__box__tabs'>
              {/* Home Tab */}
              <div className='Navbar__box__tab'>
                <Link to='/' onClick={() => handleHomeClick()}>
                  <span className='Navbar__box__tab__icon'>
                    <i
                      className={
                        isActive.home ? "fas fa-home-alt" : "fal fa-home-alt"
                      }
                      style={{
                        color: `${
                          isActive.home ? theme.mainColor : theme.typoMain
                        }`,
                      }}
                    ></i>
                  </span>
                  <span
                    className='Navbar__box__tab__text'
                    style={{
                      color: `${
                        isActive.home ? theme.mainColor : theme.typoMain
                      }`,
                    }}
                  >
                    {language.navbar.home}
                  </span>
                </Link>
              </div>
              {/* Notification Tab */}
              <div className='Navbar__box__tab'>
                <Link to='/' onClick={() => handleNotificationsClick()}>
                  <span className='Navbar__box__tab__icon'>
                    <i
                      className={
                        isActive.notifications ? "fas fa-bell" : "fal fa-bell"
                      }
                      style={{
                        color: `${
                          isActive.notifications
                            ? theme.mainColor
                            : theme.typoMain
                        }`,
                      }}
                    ></i>
                  </span>
                  <span
                    className='Navbar__box__tab__text'
                    style={{
                      color: `${
                        isActive.notifications
                          ? theme.mainColor
                          : theme.typoMain
                      }`,
                    }}
                  >
                    {language.navbar.notifications}
                  </span>
                </Link>
              </div>
              {/* Profile Tab */}
              <div className='Navbar__box__tab'>
                <Link to='/' onClick={() => handleProfileClick()}>
                  <span className='Navbar__box__tab__icon'>
                    <i
                      className={
                        isActive.profile ? "fas fa-user" : "fal fa-user"
                      }
                      style={{
                        color: `${
                          isActive.profile ? theme.mainColor : theme.typoMain
                        }`,
                      }}
                    ></i>
                  </span>
                  <span
                    className='Navbar__box__tab__text'
                    style={{
                      color: `${
                        isActive.profile ? theme.mainColor : theme.typoMain
                      }`,
                    }}
                  >
                    {language.navbar.profile}
                  </span>
                </Link>
              </div>
              {/* More Tab */}
              <div className='Navbar__box__tab'>
                <Link to='#'>
                  <span className='Navbar__box__tab__icon'>
                    <i
                      className='fal fa-ellipsis-h-alt'
                      style={{
                        color: theme.typoMain,
                      }}
                    ></i>
                  </span>
                  <span
                    className='Navbar__box__tab__text'
                    style={{
                      color: theme.typoMain,
                    }}
                  >
                    {language.navbar.more}
                  </span>
                </Link>
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

export default Navbar;
