import React, { useContext, useEffect, useState } from "react";

// style
import "./EditProfile.scss";
// Global vars import
import variables from "../../../style/CssVariables.scss";

// api service
import UserService from "../../../services/UserService";

// libraries
import { Modal } from "react-bootstrap";

// context (global state)
import UserContext from "../../../context/UserContext";
import { ThemeContext } from "../../../context/ThemeContext";
import { LanguageContext } from "../../../context/LanguageContext";

const EditProfile = ({ userProfileData, setUserProfileData }) => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData } = useContext(UserContext);
  // ******* end global state *******//

  // local state
  const [isOpen, setOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setBio(userProfileData.user.bio ? userProfileData.user.bio : '');
    setLocation(userProfileData.user.location ? userProfileData.user.location : '');
    setWebsite(userProfileData.user.website ? userProfileData.user.website : '');
  }, [userProfileData]);

  let closeModal = () => setOpen(false);

  let openModal = () => setOpen(true);

  let saveAndClose = () => {
    
    setLoading(true);

    let extraData = {
      bio,
      location,
      website,
    };

    // send data to server
    UserService.addUserDetails(extraData, userData.token)
      .then(() => {
        // update state to show new user details
        setUserProfileData({
          friends: userProfileData.friends,
          posts: userProfileData.posts,
          user: {
            ...userProfileData.user,
            bio: extraData.bio,
            location: extraData.location,
            website: extraData.website,
          },
        });
        setLoading(false);
      })
      .then(() => setOpen(false))
      .catch((err) => {
        console.log(err);
        setOpen(false);
        setLoading(false);
      });
  };

  return (
    <div className='editProfile__main'>
      <button
        style={{
          border: `1px solid ${theme.mainColor}`,
          color: theme.mainColor,
          borderRadius: variables.radius,
        }}
        onClick={openModal}
        className='editProfile__main__button'
      >
        {language.userProfile.editProfileButton}
      </button>

      <Modal
        show={isOpen}
        onHide={closeModal}
        backdrop='static'
        keyboard={false}
        centered='true'
        className='editProfile__main__modal'
      >
        <Modal.Header
          style={{
            background: theme.background,
            borderBottom: `1px solid ${theme.border}`,
          }}
          className='editProfile__main__modal__header'
        >
          <div className='left'>
            <div
              className='editProfile__main__modal__header__iconBox'
              onClick={() => closeModal()}
            >
              <i
                className='fal fa-times'
                style={{ color: theme.mainColor }}
              ></i>
              <div
                className='editProfile__main__modal__header__iconBox__background'
                style={{
                  background: theme.secondaryColor,
                }}
              ></div>
            </div>
            <h2
              className='editProfile__main__modal__header__title'
              style={{
                color: theme.typoMain,
              }}
            >
              {language.userProfile.modalTitle}
            </h2>
          </div>
          <button
            className='editProfile__main__modal__header__saveButton'
            style={{
              color: "#fff",
              backgroundColor: theme.mainColor,
              borderRadius: variables.radius,
              opacity: isLoading ? 0.6 : 1,
            }}
            onClick={() => {
              saveAndClose();
            }}
            disabled={isLoading}
          >
            {isLoading
              ? language.userProfile.modalSaveButtonLoading
              : language.userProfile.modalSaveButton}
          </button>
        </Modal.Header>
        <Modal.Body
          style={{
            background: theme.background,
          }}
        >
          <div className='form'>
            <form>
              <div
                className='form-group form__inputBox'
                style={{
                  background: theme.foreground,
                  borderBottomColor: theme.mainColor,
                }}
              >
                <label
                  htmlFor='bio'
                  className='form__inputBox__label'
                  style={{
                    color: theme.typoSecondary,
                  }}
                >
                  {language.userProfile.modalBioLabel}
                </label>
                <input
                  type='text'
                  className='form-control form__inputBox__input'
                  id='bio'
                  style={{
                    color: theme.typoMain,
                  }}
                  value={bio}
                  autoComplete='off'
                  aria-describedby='text'
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div
                className='form-group form__inputBox'
                style={{
                  background: theme.foreground,
                  borderBottomColor: theme.mainColor,
                }}
              >
                <label
                  htmlFor='location'
                  className='form__inputBox__label'
                  style={{
                    color: theme.typoSecondary,
                  }}
                >
                  {language.userProfile.modalLocationLabel}
                </label>
                <input
                  type='text'
                  className='form-control form__inputBox__input'
                  id='location'
                  style={{
                    color: theme.typoMain,
                  }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-describedby='text'
                />
              </div>
              <div
                className='form-group form__inputBox'
                style={{
                  background: theme.foreground,
                  borderBottomColor: theme.mainColor,
                }}
              >
                <label
                  htmlFor='website'
                  className='form__inputBox__label'
                  style={{
                    color: theme.typoSecondary,
                  }}
                >
                  {language.userProfile.modalWebsiteLabel}
                </label>
                <input
                  type='text'
                  className='form-control form__inputBox__input'
                  id='website'
                  style={{
                    color: theme.typoMain,
                  }}
                  value={website}
                  autoComplete='off'
                  aria-describedby='text'
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditProfile;
