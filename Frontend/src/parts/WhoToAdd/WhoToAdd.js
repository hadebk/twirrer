import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// style file
import "./WhoToAdd.scss";

// api service
import UserService from "../../services/UserService";

// components
import Spinner from "../../components/Spinner/Spinner";
import AddFriendButton from "../../components/Buttons/AddFriendButton/AddFriendButton";
import CheckVerifiedUserName from "../../components/CheckVerifiedUserName";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

const WhoToAdd = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);

  // ******* end global state ******* //
  const [users, setUsers] = useState([]);
  const [isLoad, setLoad] = useState(false);

  useEffect(() => {
    if (userData.isAuth) {
      setLoad(true);
      UserService.usersToAdd(userData.token)
        .then((res) => {
          let all = userData.user.friends.concat(res.data);
          console.log("----", all, res.data, userData.user.friends.length);
          const filteredArr = all.reduce((acc, current) => {
            const x = acc.find((item) => item.userName === current.userName);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []).slice(userData.user.friends.length)
          setUsers(filteredArr);
          setLoad(false);
        })
        .catch((err) => {
          console.log("err", err);
          setLoad(false);
        });
    }
  }, [userData.isAuth]);

  function removeDuplicates(arr1, arr2) {
    //var newArray = [];

    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i].userName === arr2[j].userName) {
          arr1.splice(i);
        }
      }
    }
    return arr1;
  }

  

  return isLoad ? (
    <div className='whoToAdd__spinner'>
      <Spinner />
    </div>
  ) : (
    <div
      className='whoToAdd'
      style={{
        backgroundColor: `${theme.foreground}`,
      }}
    >
      <div
        className='whoToAdd__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          color: theme.typoMain,
        }}
      >
        <h2>{language.rightSide.WhoToFAdd}</h2>
      </div>
      <div className='whoToAdd__usersBox'>
        {users.map((user) => {
          return (
            <div
              className='whoToAdd__usersBox__user'
              key={user.userName}
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <div className='whoToAdd__usersBox__user__leftSide'>
                <div className='whoToAdd__usersBox__user__leftSide__userImageBox'>
                  <Link to={"/users/" + user.userName}>
                    <img src={user.profilePicture} alt='profile' />
                  </Link>
                </div>
                <div
                  className='whoToAdd__usersBox__user__leftSide__userName'
                  style={{ color: theme.typoMain }}
                >
                  <Link
                    to={"/users/" + user.userName}
                    style={{ color: theme.typoMain }}
                  >
                    <CheckVerifiedUserName userName={user.userName}/>
                  </Link>
                </div>
              </div>
              {/* add friend button */}
              <div
                className='whoToAdd__usersBox__user__rightSide'
                style={{ color: theme.typoMain }}
              >
                <AddFriendButton
                  userName={user.userName}
                  /*profilePicture={user.profilePicture}*/
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhoToAdd;
