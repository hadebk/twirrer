// to force app to redirect from login/signup pages to home page if user is already logged in

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "./../context/UserContext";

const AuthRoute = ({ component: Component, ...rest }) => {
      const { userData } = useContext(UserContext);
    return(
        <Route
            {...rest}
            render={(props) =>
                userData.isAuth === true ? <Redirect to='/' /> : <Component {...props} />
            }
        />
    )
};

export default AuthRoute;