import React, { useState, useContext, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
// style
import "./Home.scss";
// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";
import PostCard from "../../components/PostCard/PostCard";
import ImageModal from "../../components/ImageModal/ImageModal";
import Spinner from "../../components/Spinner/Spinner";

const Home = () => {
  // ******* start consume contexts ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end consume contexts ******* //
  const [lastKey, setKey] = useState("");
  //const [posts, setPosts] = useState([]);
  const [posts_loading, setPostsLoading] = useState(false);
  const [nextPosts_loading, setNextPostsLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setPostsLoading(true);
    PostService.postsFirstFetch()
      .then((res) => {
        console.log(res.data);
        setKey(res.data.lastKey);
        setPostsData(res.data.posts);
        setPostsLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPostsLoading(false);
      });
    // get data of logged in user, and pass it to global state
    let userToken = localStorage.getItem("auth-token");
    if (userToken) {
      UserService.getAuthenticatedUser(userToken)
        .then((res) => {
          setUserData({
            token: userToken,
            user: res.data,
            isAuth: true,
          });
        })
        .catch((err) => console.error("Error while get user data", err));
    }
  }, []);

  const fetchMorePosts = (key) => {
    if (key.length > 0) {
      setNextPostsLoading(true);
      PostService.postsNextFetch({ lastKey: key })
        .then((res) => {
          setKey(res.data.lastKey);
          // add new posts to old posts, rather than delete old posts and show new posts,
          // of course we need all posts to be shown.
          setPostsData(posts.concat(res.data.posts));
          setNextPostsLoading(false);
          console.log(res.data);
          console.log("key", lastKey);
        })
        .catch((err) => {
          console.log(err.response.data);
          setNextPostsLoading(false);
        });
    }
  };

  const logOut = () => {
    localStorage.setItem("auth-token", "");
    setUserData({
      token: undefined,
      user: undefined,
      isAuth: false,
    });
  };

  const parent = (postID) => {
    console.log("parent");
    history.push('/posts/' + postID)
  };

  const firstPosts = !posts_loading ? (
    <Fragment>
      {posts.map((post) => {
        return (
          <div key={post.postId} onClick={() => parent(post.postId)}>
            <PostCard post={post} />
          </div>
        );
      })}
    </Fragment>
  ) : (
    <Spinner />
  );

  return (
    <div className='home-box' style={{ background: `${theme.background}` }}>
      <div
        className='home-box__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <h1
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          {language.home.title}
        </h1>
      </div>
      {userData.isAuth ? (
        <input
          type='button'
          onClick={() => logOut()}
          value='Log out'
          style={{ display: "none" }}
        />
      ) : (
        ""
      )}

      <div className='home-box__posts'>{firstPosts}</div>
      <div style={{ color: `${theme.typoMain}` }}>people you may know</div>
      <div>
        {nextPosts_loading ? (
          <Spinner />
        ) : lastKey.length > 0 ? (
          <input
            type='button'
            onClick={() => fetchMorePosts(lastKey)}
            value='fetch More'
          />
        ) : (
          ""
        )}
      </div>
      <div className='note' style={{ color: `${theme.typoMain}` }}>
        {!nextPosts_loading && lastKey.length === 0 && !posts_loading
          ? "Super! you are up to date :D"
          : ""}
      </div>
    </div>
  );
};

export default Home;
