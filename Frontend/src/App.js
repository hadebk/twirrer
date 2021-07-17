import React, { useState, useEffect, lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";

// parts
import Navbar from "./parts/Navbar/Navbar";
import MobileNavbar from "./parts/MobileNavbar/MobileNavbar";
import RightSide from "./parts/RightSide/RightSide";
import TabletNavBarNotAuth from "./parts/TabletNavBarNotAuth/TabletNavBarNotAuth";

// util
import History from "./util/History";
import AuthRoute from "./util/AuthRoute";
//import ScrollToTop from "./util/ScrollToTop";

// libraries
import jwtDecode from "jwt-decode";
import axios from "axios";

// context (global state)
import ThemeContextProvider from "./context/ThemeContext";
import LanguageContextProvider from "./context/LanguageContext";
import UserContext from "./context/UserContext";
import PostsContext from "./context/PostsContext";
import UserProfileContext from "./context/UserProfileContext";

// api services
import UserService from "./services/UserService";

// pages
import PageLoader from "./pages/PageLoader/PageLoader";
const Home = lazy(() => import("./pages/Home/Home"));
const PostDetails = lazy(() => import("./pages/PostDetails/PostDetails"));
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const Notifications = lazy(() => import("./pages/Notifications/Notifications"));
const Page404 = lazy(() => import("./pages/Page404/Page404"));

/**
 * To solve CROS origin problem:
 *  use => https://cors-anywhere.herokuapp.com/{YOUR_API_URL}
 */
axios.defaults.baseURL =
  "https://europe-west3-twirrer-app.cloudfunctions.net/api";

function App() {
  // start global state //
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    isAuth: false,
  });
  const [posts, setPostsData] = useState([]);
  const [userProfileData, setUserProfileData] = useState({
    friends: [],
    posts: [],
    user: {},
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      try {
        if (token) {
          const decodedToken = jwtDecode(token);

          // check if token still available or expired
          if (decodedToken.exp * 1000 < Date.now()) {
            // token expired
            localStorage.setItem("auth-token", "");
            token = "";
            setUserData({
              token: undefined,
              user: undefined,
              isAuth: false,
            });
            console.log(
              decodedToken.exp * 1000,
              "<",
              Date.now(),
              "Token is expired!"
            );
            History.push("/login");
          } else {
            // token not yet expire
            let cacheUserData = JSON.parse(
              window.sessionStorage.getItem("CacheUserData")
            );
            // check if user data was cached or not
            if (cacheUserData) {
              // user data is cached
              setUserData({
                token: cacheUserData.token,
                user: cacheUserData.user,
                isAuth: cacheUserData.isAuth,
              });
            } else {
              // user data is not cached, so execute an api request to fetch data.
              UserService.getAuthenticatedUser(token)
                .then((res) => {
                  setUserData({
                    token,
                    user: res.data,
                    isAuth: true,
                  });
                  // add data to the cache
                  window.sessionStorage.setItem(
                    "CacheUserData",
                    JSON.stringify({
                      token,
                      isAuth: true,
                      user: res.data,
                    })
                  );
                })
                .catch((error) => {
                  console.log("Unknown Token!", error);
                });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <Router history={History}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <PostsContext.Provider value={{ posts, setPostsData }}>
          <UserProfileContext.Provider
            value={{ userProfileData, setUserProfileData }}
          >
            <ThemeContextProvider>
              <LanguageContextProvider>
                <div className='App'>
                  <Navbar />
                  <MobileNavbar />
                  {!userData.isAuth && <TabletNavBarNotAuth />}
                  <Suspense fallback={<PageLoader />}>
                    {/* <ScrollToTop /> */}
                    <Switch>
                      <Route exact path='/' component={Home} />
                      <Route
                        exact
                        path='/posts/:postId'
                        component={PostDetails}
                      />
                      <Route
                        exact
                        path='/users/:userName'
                        component={UserProfile}
                      />
                      <Route
                        exact
                        path='/notifications'
                        component={Notifications}
                      />
                      <AuthRoute exact path='/login' component={Login} />
                      <AuthRoute exact path='/signup' component={Signup} />
                      <Route component={Page404} />
                    </Switch>
                  </Suspense>
                  <RightSide />
                </div>
              </LanguageContextProvider>
            </ThemeContextProvider>
          </UserProfileContext.Provider>
        </PostsContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
