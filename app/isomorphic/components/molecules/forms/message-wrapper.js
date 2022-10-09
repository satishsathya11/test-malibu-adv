import React from "react";
import { string } from "prop-types";

import "./forms.m.css";

const MessageWrapper = ({ message }) => (
  <div styleName="message-wrapper">
    <p styleName="message-text">{message}</p>
  </div>
);

MessageWrapper.propTypes = {
  message: string
};

export default MessageWrapper;
