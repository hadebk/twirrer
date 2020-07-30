import React from "react";
import ModalImage from "react-modal-image";

import "./ImageModal.scss";

const ImageModal = ({ imageUrl, className }) => {
  return (
    <ModalImage
      small={imageUrl}
      large={imageUrl}
      hideDownload='true'
      hideZoom='true'
      className={className}
    />
  );
};

export default ImageModal;
