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

const EditProfileImageButton = ({ userProfileData, setUserProfileData }) => {
  // userData context
  const { userData, setUserData } = useContext(UserContext);

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // local state
  const [loading, setLoading] = useState(false);

  // when select image, upload it direct to server
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    if (image.name) {
      formData.append("image", image, image.name);
      // send the image to server
      setLoading(true);
      UserService.uploadProfileImage(formData, userData.token)
        .then((res) => {
          let url = res.data.imageURL;
          // update user data in UserProfile page (in state), to show new profile image
          let newPosts = userProfileData.posts.map((post) => {
            let x = post;
            x.profilePicture = url;
            return x;
          });
          setUserProfileData({
            friends: userProfileData.friends,
            posts: newPosts,
            user: {
              ...userProfileData.user,
              profilePicture: url,
            },
          });
          return url
        })
        .then((url) => {
          // update user data in global context with new profile image
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
