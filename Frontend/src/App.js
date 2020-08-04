import React, { useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";

// pages
import Home from "./pages/Home/Home";
import PostDetails from "./pages/PostDetails/PostDetails";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Page404 from "./pages/Page404/Page404";
import UserProfile from "./pages/UserProfile/UserProfile";
import Notifications from "./pages/Notifications/Notifications";

// parts
import Navbar from "./parts/Navbar/Navbar";
import MobileNavbar from "./parts/MobileNavbar/MobileNavbar";
import RightSide from "./parts/RightSide/RightSide";
import TabletNavBarNotAuth from "./parts/TabletNavBarNotAuth/TabletNavBarNotAuth";

// util
import History from "./util/History";
import AuthRoute from "./util/AuthRoute";

// libraries
import jwtDecode from "jwt-decode";
import axios from "axios";

// context (global state)
import ThemeContextProvider from "./context/ThemeContext";
import LanguageContextProvider from "./context/LanguageContext";
import UserContext from "./context/UserContext";
import PostsContext from "./context/PostsContext";

// api services
import UserService from "./services/UserService";
import PostService from "./services/PostService";

// init axios

//      https://cors-anywhere.herokuapp.com/
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
  // start global state //

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
            console.log("Token is expired!");
            History.push("/login");
          } else {
            // token not yet expire
            UserService.getAuthenticatedUser(token)
              .then((res) => {
                setUserData({
                  token,
                  user: res.data,
                  isAuth: true,
                });
              })
              .catch((error) => {
                console.log("Strange Token!", error.response.data.code);
              });
          }
        }
      } catch (err) {
        console.log(err);
      }

      // get first batch of posts to show them on page loaded
      PostService.postsFirstFetch()
        .then((res) => {
          setPostsData(res.data.posts);
        })
        .catch((err) => console.log(err));
    };

    checkLoggedIn();
  }, []);

  return (
    <Router history={History}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <PostsContext.Provider value={{ posts, setPostsData }}>
          <ThemeContextProvider>
            <LanguageContextProvider>
              <div className='App'>
                <Navbar />
                <MobileNavbar />
                {!userData.isAuth && <TabletNavBarNotAuth />}
                {/* let one Route invoked at a time */}
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/posts/:postId' component={PostDetails} />
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
                <RightSide />
              </div>
            </LanguageContextProvider>
          </ThemeContextProvider>
        </PostsContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
