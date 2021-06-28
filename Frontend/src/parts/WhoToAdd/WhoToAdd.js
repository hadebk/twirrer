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
import UserProfileContext from "../../context/UserProfileContext";

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

  // user profile data context
  const { userProfileData } = useContext(UserProfileContext);

  // ******* end global state ******* //
  const [users, setUsers] = useState([]);
  const [isLoad, setLoad] = useState(false);

  var arabic = /[\u0600-\u06FF]/;

  useEffect(() => {
    if (userData.isAuth) {
      // get cached data (users to add as friends)
      let cachedUsersToAdd = JSON.parse(
        window.sessionStorage.getItem("CachedUsersToAdd")
      );

      if (cachedUsersToAdd && cachedUsersToAdd.length > 0) {
        // data is cached
        setLoad(false);
        setUsers(cachedUsersToAdd);
      } else {
        // data is not cached
        setLoad(true);
        // this request will retrieve 3 or 4 suggested users
        UserService.usersToAdd(userData.token)
          .then((res) => {
            // merge current user's friends with suggested users (api response)
            let allUsers = userData.user.friends.concat(res.data);

            // filter already added users, to show just the users, that not yet were added by current user,
            // actually, delete duplication in allUsers array.
            const filteredUsersList = allUsers.reduce(
              (filteredList, currentItem) => {
                const isCurrentItemAlreadyExist = filteredList.find(
                  (item) => item.userName === currentItem.userName
                );
                if (isCurrentItemAlreadyExist) {
                  // the user is already exist in 'filteredList', so skip it.
                  return filteredList;
                } else {
                  // the user is dose not exist in 'filteredList', so add it to 'filteredList'.
                  return filteredList.concat([currentItem]);
                }
              },
              []
            );

            // now we have just the user, that were not added by current user,
            // and they located at the end of 'filteredUsersList' array, so if we slice user's friend
            // form the beginning of the array, we will get suggested users to add.
            // ex. of filteredUsersList => [addedUser1, addedUser2, addedUser3, suggestedUser1, suggestedUser2]
            let suggestedUsersToAdd = filteredUsersList.slice(
              userData.user.friends.length
            );
            setUsers(suggestedUsersToAdd);
            setLoad(false);
            // add 'suggested user to add' to session storage (cache)
            window.sessionStorage.setItem(
              "CachedUsersToAdd",
              JSON.stringify(suggestedUsersToAdd)
            );
          })
          .catch((err) => {
            console.log(err);
            setLoad(false);
          });
      }
    }
  }, [
    userData.isAuth,
    userData.token,
    userData.user.friends,
    userProfileData.friends,
  ]);

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
              </div>
              {/* add friend button */}
              <div
                className='whoToAdd__usersBox__user__rightSide'
                style={{ color: theme.typoMain }}
              >
                <div
                  className='whoToAdd__usersBox__user__rightSide__line1'
                  style={{ color: theme.typoMain }}
                >
                  <Link
                    to={"/users/" + user.userName}
                    style={{ color: theme.typoMain }}
                    className='whoToAdd__usersBox__user__rightSide__line1__userName'
                  >
                    <CheckVerifiedUserName userName={user.userName} />
                    <p
                      className='whoToAdd__usersBox__user__rightSide__line1__userName__subName'
                      style={{ color: theme.typoSecondary }}
                    >
                      @{user.userName}
                    </p>
                  </Link>
                  <AddFriendButton userName={user.userName} />
                </div>
                <div
                  className='whoToAdd__usersBox__user__rightSide__line2'
                  style={{
                    color: theme.typoMain,
                    textAlign: `${arabic.test(user.bio) ? "right" : "left"}`,
                    direction: `${arabic.test(user.bio) ? "rtl" : "ltr"}`,
                  }}
                >
                  {user.bio ? user.bio : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhoToAdd;
