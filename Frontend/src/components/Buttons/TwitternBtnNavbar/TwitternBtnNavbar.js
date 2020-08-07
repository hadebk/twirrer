import React, { useContext, useState, Fragment } from "react";

// style
import "./TwitternBtnNavbar.scss";
// Global vars import
import variables from "../../../style/CssVariables.scss";

// libraries
import { Modal } from "react-bootstrap";

// context (global state)
import { ThemeContext } from "../../../context/ThemeContext";
import { LanguageContext } from "../../../context/LanguageContext";
import AddNewPost from "../../../parts/AddNewPost/AddNewPost";

const TwitternBtnNavbar = () => {
  // ******* start global state *******//
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // ******* end global state *******//

  // local state
  const [isOpen, setOpen] = useState(false);

  let closeModal = () => setOpen(false);

  let openModal = () => setOpen(true);

  return (
    <Fragment>
      <div className='twitternButtonsBox' onClick={openModal}>
        <button
          className='bigButton'
          style={{
            color: "#fff",
            backgroundColor: theme.mainColor,
            borderRadius: variables.radius,
          }}
        >
          {language.home.addPostButton}
        </button>
        <button
          className='smallButton'
          style={{
            color: "#fff",
            backgroundColor: theme.mainColor,
          }}
        >
          <i className='fas fa-feather-alt'></i>
        </button>
      </div>

      <Modal show={isOpen} onHide={closeModal} keyboard={false}>
        <Modal.Header
          style={{
            background: theme.background,
            borderBottom: `1px solid ${theme.border}`,
          }}
          className='twitternButtonsBox__modal__header'
        >
          <div
            className='twitternButtonsBox__modal__header__iconBox'
            onClick={() => closeModal()}
          >
            <i className='fal fa-times' style={{ color: theme.mainColor }}></i>
            <div
              className='twitternButtonsBox__modal__header__iconBox__background'
              style={{
                background: theme.secondaryColor,
              }}
            ></div>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            background: theme.background,
          }}
        >
          <AddNewPost inputId='modalPart' setOpen={setOpen}/>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default TwitternBtnNavbar;
