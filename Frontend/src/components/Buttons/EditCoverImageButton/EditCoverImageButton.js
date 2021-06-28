import React, { useContext, useState } from "react";

// style
import "./EditCoverImageButton.scss";

// api service
import UserService from "../../../services/UserService";

// components
import Spinner from "../../Spinner/Spinner";

// context (global state)
import UserContext from "../../../context/UserContext";
import { ThemeContext } from "../../../context/ThemeContext";
import UserProfileContext from "../../../context/UserProfileContext";

const EditCoverImageButton = () => {
  // userData context
  const { userData } = useContext(UserContext);

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // user profile data context
  const { userProfileData, setUserProfileData } =
    useContext(UserProfileContext);

  // local state
  const [loading, setLoading] = useState(false);

  // On selecting new image, upload this image directly to the server
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    if (image.name) {
      formData.append("image", image, image.name);
      // send the image to server
      setLoading(true);
      UserService.uploadCoverImage(formData, userData.token)
        .then((res) => {
          let url = res.data.imageURL;

          // 1- update user data in UserProfile page (state), to show new profile image
          setUserProfileData({
            friends: userProfileData.friends,
            posts: userProfileData.posts,
            user: {
              ...userProfileData.user,
              coverPicture: url,
            },
          });

          // update user profile data in cache also with new cover image
          let cachedCurrentUser = JSON.parse(
            window.sessionStorage.getItem(userData.user.credentials.userName)
          );
          if (cachedCurrentUser) {
            window.sessionStorage.setItem(
              userData.user.credentials.userName,
              JSON.stringify({
                friends: cachedCurrentUser.friends,
                posts: cachedCurrentUser.posts,
                user: {
                  ...cachedCurrentUser.user,
                  coverPicture: url,
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
    const fileInput = document.getElementById("coverImageInput");
    fileInput.click();
  };

  return loading ? (
    <div className='headerLoad'>
      <Spinner />
    </div>
  ) : (
    <div className='editCoverImage'>
      <input
        type='file'
        id='coverImageInput'
        accept='image/x-png,image/jpeg'
        onChange={(event) => handleImageChange(event)}
      />
      <i
        className='fal fa-pen pen'
        onClick={() => handleEditPicture()}
        style={{ border: `2px solid ${theme.background}` }}
      ></i>
    </div>
  );
};

export default EditCoverImageButton;
