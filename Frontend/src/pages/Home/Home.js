import React, { useState, useContext, useEffect } from "react";
import debounce from "lodash.debounce";

// style
import "./Home.scss";

// context (global state)
import UserContext from "../../context/UserContext";

// api service
import PostService from "../../services/PostService";

const Home = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [lastKey, setKey] = useState("");
  const [posts, setPosts] = useState([]);
  const [posts_loading, setPostsLoading] = useState(false);
  const [nextPosts_loading, setNextPostsLoading] = useState(false);

  useEffect(() => {
    // get posts
    setPostsLoading(true);
    PostService.postsFirstFetch()
      .then((res) => {
        console.log(res.data);
        setKey(res.data.lastKey);
        setPosts(res.data.posts);
        setPostsLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPostsLoading(false);
      });
  }, []);

  const fetchMorePosts = (key) => {
    if (key.length > 0) {
      setNextPostsLoading(true);
      PostService.postsNextFetch({ lastKey: key })
        .then((res) => {
          setKey(res.data.lastKey);
          // add new posts to old posts, rather than delete old posts and show new posts,
          // of course we need all posts to be shown.
          setPosts(posts.concat(res.data.posts));
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

  const firstPosts = !posts_loading ? (
    <ul>
      {posts.map((post) => {
        return (
          <li key={post.postId}>
            <div className='card'>
              <img
                className='card-img-top'
                src={post.profilePicture}
                alt='Card image cap'
              />
              <div className='card-body'>
                <h2 className='card-title' style={{ color: "#333" }}>
                  {post.userName}
                </h2>
                <p className='card-text' style={{ color: "#333" }}>
                  {post.postContent}
                </p>
                <p className='card-text' style={{ color: "#333" }}>
                  {post.likeCount}
                </p>
                <p className='card-text' style={{ color: "#333" }}>
                  {post.commentCount}
                </p>
                <a className='card-text' style={{ color: "#333" }}>
                  {post.createdAt}
                </a>
              </div>
            </div>
            <hr />
          </li>
        );
      })}
    </ul>
  ) : (
    <p>Loading...</p>
  );

  return (
    <div className='home-box'>
      {userData.isAuth ? (
        <>
          <h1 className='title'>Some user logged in</h1>
          <input type='button' onClick={() => logOut()} value='Log out' />
        </>
      ) : (
        <>
          <h1 className='title'>No user logged in</h1>
        </>
      )}

      <div className='posts'>{firstPosts}</div>
      <div>people you may know</div>
      <div>
        {nextPosts_loading ? (
          <p>Loading Next...</p>
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
      <div className='note'>
        {!nextPosts_loading && lastKey.length == 0 && !posts_loading ? "Super! you are up to date :D" : ''}
      </div>
    </div>
  );
};

export default Home;
