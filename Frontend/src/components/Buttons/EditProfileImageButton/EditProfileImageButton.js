import React, { useContext, useState } from "react";

// style
import "./EditProfileImageButton.scss";

// api service
import UserService from "../../../services/UserService";

// components
import Spinner from "../../Spinner/Spinner";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import UserContext from "../../../context/UserContext";
import UserProfileContext from "../../../context/UserProfileContext";

const EditProfileImageButton = () => {
  // userData context
  const { userData, setUserData } = useContext(UserContext);

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // user profile data context
  const { userProfileData, setUserProfileData } =
    useContext(UserProfileContext);

  // local state
  const [loading, setLoading] = useState(false);

  // on selecting an image, upload it direct to server
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    if (image.name) {
      formData.append("image", image, image.name);
      setLoading(true);
      // send the image to server
      UserService.uploadProfileImage(formData, userData.token)
        .then((res) => {
          let url = res.data.imageURL;

          // 1- update user data in UserProfile page (state), to show new profile image
          setUserProfileData({
            friends: userProfileData.friends,
            posts: userProfileData.posts,
            user: {
              ...userProfileData.user,
              profilePicture: url,
            },
          });

          // 2- update user's avatar image in cache
          let cachedCurrentUser = JSON.parse(
            window.sessionStorage.getItem(userData.user.credentials.userName)
          );
          if (cachedCurrentUser) {
            window.sessionStorage.setItem(
              userData.user.credentials.userName,
              JSON.stringify({
                friends: cachedCurrentUser.friends,
                posts: userProfileData.posts,
                user: {
                  ...cachedCurrentUser.user,
                  profilePicture: url,
                },
              })
            );
          }
          return url;
        })
        .then((url) => {
          // 3- update user data in global context with new profile image
          setUserData({
            isAuth: userData.isAuth,
            token: userData.token,
            user: {
              ...userData.user,
              credentials: {
                ...userData.user.credentials,
                profilePicture: url,
              },
            },
          });

          // 4- update cache of user data (global state)
          let CacheUserData = JSON.parse(
            window.sessionStorage.getItem("CacheUserData")
          );
          if (CacheUserData) {
            window.sessionStorage.setItem(
              "CacheUserData",
              JSON.stringify({
                isAuth: userData.isAuth,
                token: userData.token,
                user: {
                  ...userData.user,
                  credentials: {
                    ...userData.user.credentials,
                    profilePicture: url,
                  },
                },
              })
            );
          }
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  // on click, fire 'click event' of input (type file)
  const handleEditPicture = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };
  return loading ? (
    <div className='avatarLoad'>
      <Spinner />
    </div>
  ) : (
    <div className='editPPImage'>
      <input
        type='file'
        id='profileImageInput'
        accept='image/x-png,image/jpeg'
        onChange={(event) => handleImageChange(event)}
      />
      <i
        className='fal fa-pen'
        style={{ border: `2px solid ${theme.background}` }}
        onClick={() => handleEditPicture()}
      ></i>
    </div>
  );
};

export default EditProfileImageButton;
