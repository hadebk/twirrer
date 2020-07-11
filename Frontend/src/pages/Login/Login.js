import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Login.scss";
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import UserService from "../../services/UserService";

const Login = () => {
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  const [email, setEmail] = useState("eman@gmail.com");
  const [password, setPassword] = useState("eman123");

  let userToken = "";

  const { userData, setUserData } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setEmail('')
    setPassword('')

    UserService.loginUser({ email, password })
      .then((res) => {
        console.log(res.data);
        userToken = res.data.userToken;
        localStorage.setItem("auth-token", userToken);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    console.log("login", userData);
  }, []);

  return (
    <div
      className='main-box'
      style={{
        background: theme.background,
      }}
    >
      <div
        className='main'
        style={{
          background: theme.background,
        }}
      >
        {userData.isAuth ? (
          <h1
            className='title'
            style={{
              color: theme.typoMain,
            }}
          >
            true
          </h1>
        ) : (
          <h1
            className='title'
            style={{
              color: theme.typoMain,
            }}
          >
            false
          </h1>
        )}
        <h4
          className='title'
          style={{
            color: theme.typoMain,
          }}
        >
          Log in to Twirrer
        </h4>
        <div className='form'>
          <form onSubmit={handleSubmit}>
            <div
              className='form-group form__inputBox'
              style={{
                background: theme.foreground,
                borderBottom: `2px solid ${theme.mainColor}`,
              }}
            >
              <label
                htmlFor='exampleInputEmail1'
                className='form__inputBox__label'
                style={{
                  color: theme.typoSecondary,
                }}
              >
                Email address
              </label>
              <input
                type='email'
                className='form-control form__inputBox__input'
                id='exampleInputEmail1'
                style={{
                  color: theme.typoMain,
                }}
                autoComplete='off'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              className='form-group form__inputBox'
              style={{
                background: theme.foreground,
                borderBottom: `2px solid ${theme.mainColor}`,
              }}
            >
              <label
                htmlFor='exampleInputPassword1'
                className='form__inputBox__label'
                style={{
                  color: theme.typoSecondary,
                }}
              >
                Password
              </label>
              <input
                type='password'
                className='form-control form__inputBox__input'
                id='exampleInputPassword1'
                style={{
                  color: theme.typoMain,
                }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary form__button'
              style={{
                background: theme.mainColor,
              }}
            >
              Log in
            </button>
          </form>
        </div>
        <div className='signUp'>
          <Link
            to='/signup'
            className='signUp__link'
            style={{
              color: theme.mainColor,
            }}
          >
            Sign up for Twirrer
          </Link>
          <Link
            to='/'
            className='signUp__link'
            style={{
              color: theme.mainColor,
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
