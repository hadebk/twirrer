import React, { useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";

// pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Page404 from "./pages/Page404/Page404";

// parts
import Navbar from './parts/Navbar/Navbar';
import RightSide from './parts/RightSide/RightSide';

// util
import History from "./util/History";
import AuthRoute from "./util/AuthRoute";

// libraries
import jwtDecode from "jwt-decode";

// context (global state)
import ThemeContextProvider from "./context/ThemeContext";
import LanguageContextProvider from "./context/LanguageContext";
import UserContext from "./context/UserContext";

// api services
import UserService from "./services/UserService";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    isAuth: false,
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
    };

    checkLoggedIn();
  }, []);

  return (
    <Router history={History}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <ThemeContextProvider>
          <LanguageContextProvider>
            <div className='App'>
              <Navbar/>
              {/* let one Route invoked at a time */}
              <Switch>
                <Route exact path='/' component={Home} />
                <AuthRoute exact path='/login' component={Login} />
                <AuthRoute exact path='/signup' component={Signup} />
                <Route component={Page404} />
              </Switch>
              <RightSide/>
            </div>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
