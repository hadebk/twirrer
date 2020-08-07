import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// style
import "./SettingsButton.scss";

// assets - icons
import Dark from "../../../assets/IconsSvg/dark.svg";
import Light from "../../../assets/IconsSvg/light.svg";
import DE from "../../../assets/IconsSvg/DE.svg";
import UK from "../../../assets/IconsSvg/UK.svg";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import UserContext from "../../../context/UserContext";
import { LanguageContext } from "../../../context/LanguageContext";

const SettingsButton = ({ className, color }) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german, toggleLanguage } = useContext(
    LanguageContext
  );
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);
  // ******* end global state *******//

  // local state
  const [isOpen, setOpen] = useState(false);

  // utils
  const history = useHistory();

  useEffect(() => {}, [userData, setUserData]);

  const showBox = () => {
    setOpen(true);
  };

  const closeBox = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.setItem("auth-token", "");
    setUserData({
      token: undefined,
      user: undefined,
      isAuth: false,
    });
    history.push("/login");
  };

  return (
    <span className='settingMain'>
      <div
        className='settingsBox'
        style={{
          display: isOpen ? "block" : "none",
          backgroundColor: theme.background,
        }}
      >
        <div
          className='settingsBox__header'
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className='settingsBox__header__iconBox' onClick={closeBox}>
            <i className='fal fa-times' style={{ color: theme.mainColor }}></i>
            <div
              className='settingsBox__header__iconBox__background'
              style={{
                background: theme.secondaryColor,
              }}
            ></div>
          </div>
          <h2
            className='settingsBox__header__title'
            style={{ color: theme.typoMain }}
          >
            {language.SettingsButton.title}
          </h2>
        </div>
        <div className='settingsBox__body' style={{ color: theme.typoMain }}>
          <table>
            <tbody>
              <tr
                className='settingsBox__body__theme'
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <td className='--title' style={{ color: theme.typoMain }}>
                  <i className="fal fa-palette" style={{ color: theme.mainColor }}></i>
                  {language.SettingsButton.theme}
                </td>
                <td className='--choices'>
                  <div onClick={toggleTheme}>
                    <img
                      alt='moon'
                      src={Dark}
                      style={{
                        border: isLightTheme
                          ? "0"
                          : `2px solid ${theme.mainColor}`,
                        opacity: isLightTheme ? ".5" : "1",
                      }}
                    />
                  </div>
                  <div onClick={toggleTheme}>
                    <img
                      alt='sun'
                      src={Light}
                      style={{
                        border: isLightTheme
                          ? `2px solid ${theme.mainColor}`
                          : "0",
                        opacity: isLightTheme ? "1" : ".5",
                      }}
                    />
                  </div>
                </td>
              </tr>
              <tr
                className='settingsBox__body__language'
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <td className='--title' style={{ color: theme.typoMain }}>
                  <i className="fal fa-globe" style={{color:theme.mainColor}}></i>
                  {language.SettingsButton.language}
                </td>
                <td className='--choices'>
                  <div onClick={toggleLanguage}>
                    <img
                      alt='DE'
                      src={DE}
                      style={{
                        border: isEnglish
                          ? "0"
                          : `2px solid ${theme.mainColor}`,
                        opacity: isEnglish ? ".5" : "1",
                        
                      }}
                    />
                  </div>
                  <div onClick={toggleLanguage}>
                    <img
                      alt='UK'
                      src={UK}
                      style={{
                        border: isEnglish
                          ? `2px solid ${theme.mainColor}`
                          : "0",
                        opacity: isEnglish ? "1" : ".5",
                      }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className='settingsBox__body__logout'>
            <button style={{ backgroundColor: theme.error }} onClick={logout}>
              {language.SettingsButton.logoutButton}
              <i className='fal fa-sign-out-alt'></i>
            </button>
          </div>
        </div>
      </div>
      <span onClick={showBox}>
        <span className={className}>
          <i
            className='fal fa-ellipsis-h-alt'
            style={{
              color: color,
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
      </span>
    </span>
  );
};

export default SettingsButton;
