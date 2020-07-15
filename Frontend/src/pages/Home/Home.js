import React, { useState, useContext, useEffect } from "react";

// context (global state)
import UserContext from "../../context/UserContext";

// api service
import PostService from "../../services/PostService";

const Home = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [lastKey, setKey] = useState("");

  useEffect(() => {
    PostService.postsFirstFetch()
      .then((res) => {
        console.log(res.data);
        setKey(res.data.lastKey);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const fetchMorePosts = (key) => {
    PostService.postsNextFetch({ lastKey: key })
      .then((res) => {
        setKey(res.data.lastKey);
        console.log(res.data);
        console.log("key", lastKey);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

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
          <input type='button' onClick={() => logOut()} value='Log out' />
        </>
      ) : (
        <>
          <h1 className='title'>No user logged in</h1>
          <input
            type='button'
            onClick={() => fetchMorePosts(lastKey)}
            value='fetch More'
          />
        </>
      )}
    </>
  );
};

export default Home;
