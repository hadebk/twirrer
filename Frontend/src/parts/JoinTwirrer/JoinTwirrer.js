import React, { useContext } from "react";

// style file
import "./JoinTwirrer.scss";

// assets
import joinTwirrer from "../../assets/Images/joinTwirrer.svg";

// components
import LoginButton from "../../components/Buttons/LoginButton";
import SignupButton from "../../components/Buttons/SignupButton";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const JoinTwirrer = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end global state ******* //
  return (
    <div className='joinTwirrer' >
      <div className='joinTwirrer__box' style={{ backgroundColor: theme.foreground }}>
        <div className='joinTwirrer__box__imageBox'>
          <img alt='join twirrer' src={joinTwirrer} />
        </div>
        <div className='joinTwirrer__box__body'>
          <div className='joinTwirrer__box__body__Title'>
            <h2 style={{ color: theme.typoMain }}>{language.rightSide.JoinTwirrer}</h2>
            <p style={{ color: theme.typoSecondary }}>{language.rightSide.JoinTwirrerSub}</p>
          </div>
          <div className='joinTwirrer__box__body__buttons'>
            <SignupButton />
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTwirrer;
