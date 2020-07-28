import React, { useState, useContext, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";

// style
import "./Notifications.scss";

// assets
import Empty from "../../assets/Images/empty.svg";
import DefaultAvatar from "../../assets/Images/default_pp.png";

// libraries
import dayjs from "dayjs";
import moment from 'moment-twitter';

// api service
import UserService from "../../services/UserService";

// component
import Spinner from "../../components/Spinner/Spinner";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const Notifications = () => {

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
    
    return ( '' );
}
 
export default Notifications;