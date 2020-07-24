import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// style
import "./UserProfile.scss";

// assets
import Empty from "../../assets/Images/empty.svg";
import Default from "../../assets/Images/default_pp.png";

// libraries
import moment from "moment-twitter";

// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// component
import Spinner from "../../components/Spinner/Spinner";
import ImageModal from "../../components/ImageModal/ImageModal";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const UserProfile = (props) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);
  // ******* end global state *******//
    return (
        <div className="userProfile__main" style={{ background: `${theme.background}` }}>
            <h1>Profile {props.match.params.userName}</h1>
      </div>
  )
};

export default UserProfile;
