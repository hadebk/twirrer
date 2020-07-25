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
import PostsContext from "../../../context/PostsContext";

const EditProfileImageButton = ({ userProfileData, setUserProfileData }) => {
  // userData context
  const { userData, setUserData } = useContext(UserContext);

  // local state
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    if (image.name) {
      formData.append("image", image, image.name);
      // send the image to server
      setLoading(true)
      UserService.uploadProfileImage(formData, userData.token)
        .then((res) => {
          console.log("image-res", res.data);
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
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.log("image-err", err);
          setLoading(false)
        });
    }
  };
  const handleEditPicture = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };
  return loading ? (
    <div className='load__'>
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
      <i className='fal fa-pen' onClick={() => handleEditPicture()}></i>
    </div>
  );
};

export default EditProfileImageButton;
