import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./RightSide.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const RightSide = () => {
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
  return (
    <div className='r-box'>
      <div
        className='RightSide'
        style={{
          backgroundColor: `${theme.background}`,
          borderLeft: `1px solid ${theme.border}`,
        }}
      >
        <h1
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          
        </h1>
      </div>
    </div>
  );
};

export default RightSide;
