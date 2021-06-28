import React, { useState, useContext, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

// style
import "./Home.scss";
// Global vars import
import variables from "../../style/CssVariables.scss";

// api service
import PostService from "../../services/PostService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

// components
import PostCard from "../../components/PostCard/PostCard";
import Spinner from "../../components/Spinner/Spinner";
import WhoToAdd from "../../parts/WhoToAdd/WhoToAdd";
import AddNewPost from "../../parts/AddNewPost/AddNewPost";
import PinnedPost from "../../parts/PinnedPost/PinnedPost";

const Home = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //

  // local state
  const [lastKey, setKey] = useState("");
  const [posts_loading, setPostsLoading] = useState(false);
  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [pinnedPost, setPinnedPost] = useState({});
  const [PinnedPostLoad, setPinnedPostLoad] = useState(false);

  // history init
  const history = useHistory();

  // set page title
  document.title = language.home.pageTitle;

  // fetch posts
  useEffect(() => {
    let mounted = true;

    // get cache (posts)
    let cachedPosts = JSON.parse(window.sessionStorage.getItem("posts"));
    let cachedLastPostKey = window.sessionStorage.getItem("lastKey");

    if (mounted) {
      let fun = async () => {
        if (cachedPosts && cachedPosts.length !== 0 && cachedLastPostKey) {
          // the posts were cached
          // first, get pinned post from cache and set it to local state
          setPinnedPost(cachedPosts[0]);
          setPinnedPostLoad(false);
          // then get posts from cache and set them to local state
          setPostsData(cachedPosts);
          setKey(cachedLastPostKey);
          setPostsLoading(false);
        } else {
          // the posts are not cached, so execute an api request to fetch them
          let pinedPostContent = [];
          // fetch pinned post from DB
          setPinnedPostLoad(true);
          await PostService.PinnedPost()
            .then((res) => {
              pinedPostContent.push(res.data);
              setPinnedPost(res.data);
              setPinnedPostLoad(false);
            })
            .catch((err) => {
              console.log(err);
              setPinnedPostLoad(false);
            });
          // then get first batch of posts from DB to display them in home page
          setPostsLoading(true);
          await PostService.postsFirstFetch()
            .then((res) => {
              setKey(res.data.lastKey);
              setPostsData(pinedPostContent.concat(res.data.posts));
              setPostsLoading(false);
              // add posts and last post's key to session storage (cache)
              window.sessionStorage.setItem(
                "posts",
                JSON.stringify(pinedPostContent.concat(res.data.posts))
              );
              window.sessionStorage.setItem("lastKey", res.data.lastKey);
            })
            .catch((err) => {
              console.log(err);
              setPostsLoading(false);
            });
        }
      };
      fun();
    }
    return () => (mounted = false);
  }, [setPostsData]);

  /**
   * used to apply pagination on posts
   * @param {String} key key of last fetched post
   * @functionality fetch next batch of posts
   * will fire on user click on load more posts button in the end of home.
   */
  const fetchMorePosts = (key) => {
    if (key.length > 0) {
      setNextPostsLoading(true);
      PostService.postsNextFetch({ lastKey: key })
        .then((res) => {
          setKey(res.data.lastKey);
          // add new fetched posts to already fetched posts.
          setPostsData(posts.concat(res.data.posts));
          setNextPostsLoading(false);
          // add new fetched posts to cached posts in session storage (cache),
          // and last post's key to session storage (cache).
          window.sessionStorage.setItem(
            "posts",
            JSON.stringify(posts.concat(res.data.posts))
          );
          window.sessionStorage.setItem("lastKey", res.data.lastKey);
        })
        .catch((err) => {
          console.log(err.response.data);
          setNextPostsLoading(false);
        });
    }
  };

  // direct to post details page on click on post
  const toPostDetails = (postID) => {
    history.push("/posts/" + postID);
  };

  // store first batch of posts in a var
  const feedPosts = !posts_loading ? (
    <Fragment>
      {posts.map((post) => {
        return (
          <div key={post.postId} onClick={() => toPostDetails(post.postId)}>
            {/* detect if this post is pinned post, so escape it, هn order not to show twice*/}
            {post.postId !== "JXuy58xhwYWwt6JDwMI1" ? (
              <PostCard post={post} />
            ) : (
              ""
            )}
          </div>
        );
      })}
    </Fragment>
  ) : (
    <Spinner />
  );

  return (
    <div className='home-box' style={{ background: `${theme.background}` }}>
      {/* page title */}
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

      <div className='home-box__content'>
        {/* 'add new post' section */}
        {userData.isAuth ? (
          <div
            className='home-box__addNewPostWrapper'
            style={{ borderBottom: `10px solid  ${theme.addPostBorder}` }}
          >
            <AddNewPost inputId='staticPart' setOpen={false} />
          </div>
        ) : (
          ""
        )}

        {/* 'pinned post' section */}
        <PinnedPost pinnedPost={pinnedPost} PinnedPostLoad={PinnedPostLoad} />

        {/* 'posts first fetch' section */}
        <div className='home-box__posts'>{feedPosts}</div>

        {/* 'who to add' section, for mobile view */}

        {userData.isAuth && window.screen.width <= 991 ? <WhoToAdd /> : ""}

        {/* 'button to fetch more posts' section */}
        <div className='home-box__spinner' style={{ textAlign: "center" }}>
          {nextPosts_loading && !posts_loading ? (
            <Spinner />
          ) : lastKey.length > 0 ? (
            <button
              className='home-box__SettingsButton'
              onClick={() => fetchMorePosts(lastKey)}
              style={{
                backgroundColor: theme.mainColor,
                color: "#fff",
                borderRadius: variables.radius,
              }}
            >
              <i className='fal fa-chevron-down home-box__SettingsButton__icon'></i>
              <span className='home-box__SettingsButton__text'>
                {language.home.SettingsButton}
              </span>
            </button>
          ) : (
            ""
          )}
        </div>

        {/* note shown when there is no more posts */}
        <div
          className='home-box__note'
          style={{ color: `${theme.typoSecondary}` }}
        >
          {!nextPosts_loading && lastKey.length === 0 && !posts_loading ? (
            <span>
              {language.home.bottomHint}{" "}
              <i
                className='fas fa-stars'
                style={{ color: theme.mainColor }}
              ></i>
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
