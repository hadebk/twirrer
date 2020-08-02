import React, { useContext } from "react";

// style file
import "./TabletNavBarNotAuth.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";

// components
import LoginButton from "../../components/Buttons/LoginButton";
import SignupButton from "../../components/Buttons/SignupButton";

const TabletNavBarNotAuth = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

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
