import React, { useContext } from "react";

// style
import "./Page404.scss";

// assets
import Error404 from "../../assets/Images/page404.svg";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const Page404 = () => {
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  return (
    <div className='page404' style={{ background: `${theme.background}` }}>
      <div className='page404__imgBox'>
        <img alt='page404' src={Error404} />
      </div>
      <h3 className='page404__hint' style={{ color: `${theme.typoMain}` }}>
        {language.page404.hint}
      </h3>
    </div>
  );
};

export default Page404;
