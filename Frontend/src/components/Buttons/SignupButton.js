import React, { useContext } from "react";
import { Link } from "react-router-dom";

import variables from "../../style/CssVariables.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const SignupButton = () => {
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
      className='signupButton'
      style={{
        borderRadius: variables.radius || 9999,
        backgroundColor: theme.mainColor,
        textAlign: "center",
        padding: '5px 0',
        width: "45%",
      }}
    >
      <Link
        to='/signup'
        style={{
          display: "inline-block",
          color: "#fff",
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: "700",
          width: "100%",
        }}
      >
        {language.signup.signupButton}
      </Link>
    </div>
  );
};

export default SignupButton;
