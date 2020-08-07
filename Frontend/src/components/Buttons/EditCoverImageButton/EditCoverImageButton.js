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

const EditCoverImageButton = ({ userProfileData, setUserProfileData }) => {

  // userData context
  const { userData } = useContext(UserContext);

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // local state
  const [loading, setLoading] = useState(false);

  // on select new image, upload this image direct to server
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
          // update user data in UserProfile page (in state), to show new profile image

          setUserProfileData({
            friends: userProfileData.friends,
            posts: userProfileData.posts,
            user: {
              ...userProfileData.user,
              coverPicture: url,
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
          style={{border: `2px solid ${theme.background}`}}
      ></i>
    </div>
  );
};

export default EditCoverImageButton;
