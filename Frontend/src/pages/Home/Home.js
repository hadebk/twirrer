import React, { useContext } from 'react';

// context (global state)
import UserContext from "../../context/UserContext";

const Home = () => {
  const {userData} = useContext(UserContext);

  return (<> {
    userData.isAuth
      ? (
        <h1 className='title'>
          Some user logged in
        </h1>
      )
      : (
        <h1 className='title'>
          No user logged in
        </h1>
      )
  }
  </>)
}

export default Home;
