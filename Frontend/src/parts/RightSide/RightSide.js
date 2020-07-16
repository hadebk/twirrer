import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file
import "./RightSide.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const RightSide = () => {
  return (
    <div className='r-box'>
      <div className='RightSide'></div>
    </div>
  );
};

export default RightSide;
