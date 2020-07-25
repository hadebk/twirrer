import React, { useContext, Fragment } from "react";

// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";

const EditProfileImageButton = ({ userProfileData, setUserProfileData}) => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // userData context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    // send the image to server
    UserService.uploadProfileImage(formData, userData.token)
      .then((res) => {
          console.log("image-res", res.data);
          // TODO: update user data state in UserProfile page, to show new profile image
      })
      .catch((err) => {
        console.log("image-err", err.response.data);
      });
  };
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  return (
    <div className='editPPImage'>
      <input
        type='file'
        id='imageInput'
        onChange={(event) => handleImageChange(event)}
        style={{ visibility: "hidden" }}
      />
      <i className='fas fa-edit' onClick={() => handleEditPicture()}></i>
    </div>
  );
};

export default EditProfileImageButton;
