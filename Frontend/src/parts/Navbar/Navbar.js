import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./Navbar.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const Navbar = () => {
    return (
        <div className="l-box">
            <div className='leftSide'></div>
        </div>
    );
};

export default Navbar;
