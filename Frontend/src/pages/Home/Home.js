import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
import axios from 'axios'
import UserContext from "../../context/UserContext";

const Home = () => {
  const {userData} = useContext(UserContext);

  useEffect(() => {
    console.log("home", userData)
  }, [])

  return (<> {
    userData.isAuth
      ? (
        <h1 className='title'>
          true
        </h1>
      )
      : (
        <h1 className='title'>
          false
        </h1>
      )
  }
  </>)
}

export default Home;
