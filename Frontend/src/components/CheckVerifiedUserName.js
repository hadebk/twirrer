import React, { Fragment, useContext } from "react";

// context (global state)
import { ThemeContext } from "../context/ThemeContext";

const CheckVerifiedUserName = ({ userName }) => {
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  return (
    <Fragment>
      {userName === "ABDULHADI✨" ? (
        <Fragment>
          {userName}
          <i
            className='fas fa-badge-check'
            style={{ marginLeft: "3px", color: theme.logo }}
          ></i>
        </Fragment>
      ) : (
        userName
      )}
    </Fragment>
  );
};

export default CheckVerifiedUserName;
