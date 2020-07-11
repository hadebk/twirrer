import React, { useContext } from "react";

// context (global state)
import UserContext from "../../context/UserContext";

const Home = () => {
  const { userData, setUserData } = useContext(UserContext);

  const logOut = () => {
    localStorage.setItem("auth-token", "");
    setUserData({
      token: undefined,
      user: undefined,
      isAuth: false,
    });
  };

  return (
    <>
      {userData.isAuth ? (
        <>
          <h1 className='title'>Some user logged in</h1>
          <input type="button" onClick={() => logOut()} value="Log out" />
        </>
      ) : (
        <h1 className='title'>No user logged in</h1>
      )}
    </>
  );
};

export default Home;
