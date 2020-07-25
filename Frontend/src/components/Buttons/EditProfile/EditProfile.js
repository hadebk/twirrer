import React, { useContext, useEffect, useState, Fragment } from "react";

// style

// api service
import UserService from "../../../services/UserService";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import UserContext from "../../../context/UserContext";
import { LanguageContext } from "../../../context/LanguageContext";
import PostsContext from "../../../context/PostsContext";

import {Button, Modal} from 'react-bootstrap'

const EditProfile = () => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);
  // ******* end global state *******//

  // local state
    const [isOpen, setOpen] = useState(false);
    let closeModal = () => setOpen(false);

    let openModal = () => setOpen(true);

    let saveAndClose = () => {
        console.log('saved')
        setOpen(false)
    };
  return (
    <>
      <Button variant='primary' onClick={openModal}>
        Launch demo modal
      </Button>

      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
                  <Button variant='primary' onClick={() => {
                      console.log('saved');
                       closeModal();
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProfile;
