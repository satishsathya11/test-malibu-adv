import React from "react";
import { func, object, bool } from "prop-types";
import ReactModal from "react-modal";

import { SvgIconHandler } from "../../atoms/svg-icon-hadler";

import "./modal.m.css";

const Modal = ({ onClose, children, hideCloseIcon }) => {
  return (
    <ReactModal className="malibu-modal" overlayClassName="modal-backdrop" isOpen={true} onRequestClose={onClose}>
      <div className="modal-content">
        {children}
        {!hideCloseIcon && (
          <button aria-label="close-button" styleName="close-button" onClick={onClose}>
            <SvgIconHandler iconStyle={{ color: "#000" }} type="close" width="18" height="18" viewBox="0 0 18 18" />
          </button>
        )}
      </div>
    </ReactModal>
  );
};

Modal.propTypes = {
  onClose: func,
  children: object,
  hideCloseIcon: bool
};

export default Modal;
