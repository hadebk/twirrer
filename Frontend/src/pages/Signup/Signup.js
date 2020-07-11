import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Signup.scss";
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import UserService from "../../services/UserService";

const Signup = () => {
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userData } = useContext(UserContext);

  let userToken = "";

  const handleSubmit = (e) => {
    e.preventDefault();

    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    UserService.signupUser({ userName, email, password, confirmPassword })
      .then((res) => {
        console.log(res.data);
        userToken = res.data.userToken;
        localStorage.setItem("auth-token", userToken);
      })
      .catch((err) => {
        console.log("err", err.response.data);
      });
  };

  useEffect(() => {
    console.log("signup", userData);
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
          Sign up for Twirrer
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
                htmlFor='exampleInputUserName'
                className='form__inputBox__label'
                style={{
                  color: theme.typoSecondary,
                }}
              >
                User name
              </label>
              <input
                type='text'
                className='form-control form__inputBox__input'
                id='exampleInputUserName'
                style={{
                  color: theme.typoMain,
                }}
                autoComplete='off'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
            <div
              className='form-group form__inputBox'
              style={{
                background: theme.foreground,
                borderBottom: `2px solid ${theme.mainColor}`,
              }}
            >
              <label
                htmlFor='exampleInputPasswordConfirm'
                className='form__inputBox__label'
                style={{
                  color: theme.typoSecondary,
                }}
              >
                Confirm password
              </label>
              <input
                type='password'
                className='form-control form__inputBox__input'
                id='exampleInputPasswordConfirm'
                style={{
                  color: theme.typoMain,
                }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary form__button'
              style={{
                background: theme.mainColor,
              }}
            >
              Sign up
            </button>
          </form>
        </div>
        <div className='login'>
          <span
            style={{
              color: theme.mainColor,
            }}
          >
            Already have an account?
            <Link
              to='/login'
              className='login__link'
              style={{
                color: theme.mainColor,
              }}
            >
              {" "}
              login to Twirrer
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
