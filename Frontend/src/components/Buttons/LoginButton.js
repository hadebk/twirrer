import React, { useContext } from "react";
import { Link } from "react-router-dom";

// Global vars import
import variables from "../../style/CssVariables.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const LoginButton = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end global state ******* //

  return (
    <div
      className='loginButton'
      style={{
        borderRadius: variables.radius || 9999,
        border: `1px solid ${theme.mainColor}`,
        textAlign: "center",
        padding: "5px 0",
        width: "45%",
      }}
    >
      <Link
        to='/login'
        style={{
          display: "inline-block",
          color: theme.mainColor,
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: "700",
          width: "100%",
        }}
      >
        {language.login.logInButton}
      </Link>
    </div>
  );
};

export default LoginButton;
