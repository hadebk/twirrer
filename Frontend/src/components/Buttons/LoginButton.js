import React, { useContext } from "react";
import { Link } from "react-router-dom";

// Global vars import
import variables from "../../style/CssVariables.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const LoginButton = () => {
  // ******* start consume contexts ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end consume contexts ******* //
  return (
    <div
      className='loginButton'
      style={{
        borderRadius: variables.radius,
        border: `1px solid ${theme.mainColor}`,
        textAlign: "center",
        height: "30px",
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
          width:'100%'
        }}
      >
        {language.login.logInButton}
      </Link>
    </div>
  );
};

export default LoginButton;
