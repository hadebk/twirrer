import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./TabletNavBarNotAuth.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

// components
import LoginButton from "../../components/Buttons/LoginButton";
import SignupButton from "../../components/Buttons/SignupButton";

const TabletNavBarNotAuth = () => {
  // ******* start global state ******* //

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

  // ******* end global state ******* //
  return (
    <div className='TabletNavBarNotAuth'>
      <div
        className='TabletNavBarNotAuth__main'
        style={{
          background: `${theme.background}`,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <div className='buttons__box'>
          <LoginButton />
          <SignupButton />
        </div>
      </div>
    </div>
  );
};

export default TabletNavBarNotAuth;
