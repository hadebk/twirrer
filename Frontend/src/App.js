import React, { useState, useEffect } from "react";
import { Router , Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Page404 from './pages/Page404/Page404';
import History from './History';
import ThemeContextProvider from './context/ThemeContext';
import UserContext from "./context/UserContext";
import UserService from "./services/UserService";

function App() {

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    isAuth: false
  });


  useEffect(() => {
    const checkLoggedIn = async () => {

      let token = localStorage.getItem("auth-token");

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      
      UserService.getAuthenticatedUser(token)
        .then((res) => {
          return res.data
        })
        .then((data) => {
          setUserData({
            token,
            user: data,
            isAuth: true
          });
        })
        .catch((error) => {
        console.error("error", error.response.data.code)
      })

    };

    checkLoggedIn();
  }, []);

  return (
    <Router history={History}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <ThemeContextProvider>
          <div className='App'>
            <Switch>
              {/* let one Route invoked at a time */}
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={Signup} />
              <Route component={Page404} />
            </Switch>
          </div>
        </ThemeContextProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
