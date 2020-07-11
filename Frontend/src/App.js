import React, { useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Page404 from "./pages/Page404/Page404";
import History from "./History";
import ThemeContextProvider from "./context/ThemeContext";
import UserContext from "./context/UserContext";
import UserService from "./services/UserService";
import jwtDecode from "jwt-decode";
import AuthRoute from "./util/AuthRoute";

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

      if (token) {
        const decodedToken = jwtDecode(token);
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
              return res.data;
            })
            .then((data) => {
              setUserData({
                token,
                user: data,
                isAuth: true,
              });
            })
            .catch((error) => {
              console.error("error", error.response.data.code);
            });
        }
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <Router history={History}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <ThemeContextProvider>
          <div className='App'>
            {/* let one Route invoked at a time */}
            <Switch>
              <Route exact path='/' component={Home} />
              <AuthRoute exact path='/login' component={Login} />
              <AuthRoute exact path='/signup' component={Signup} />
              <Route component={Page404} />
            </Switch>
          </div>
        </ThemeContextProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
