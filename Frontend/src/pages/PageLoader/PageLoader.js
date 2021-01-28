import React, { useContext } from "react";

// style
import "./PageLoader.scss";

// spinner
import Spinner from "../../components/Spinner/Spinner";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";

const PageLoader = () => {
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  return (
    <div className='pageLoader' style={{ background: `${theme.background}` }}>
      <Spinner />
    </div>
  );
};

export default PageLoader;
