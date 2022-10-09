import React, { useState } from "react";
import { func, bool } from "prop-types";
import { forgotPassword, sendOtp, resetPassword } from "@quintype/bridgekeeper-js";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { InputField } from "../../atoms/InputField";
import { isValidEmail } from "../../utils";
import "./forms.m.css";

export function ForgotPassword({ onClose, activeLoginTab }) {
  const isVerificationLinkFlow = useSelector(state =>
    get(state, ["qt", "config", "publisher-attributes", "is_verification_link_flow"], false)
  );
  const [email, setEmail] = useState("");
  const [data, setOTPData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    id: ""
  });
  const [error, setError] = useState({});
  const [showVerficationScreen, verificationScreenHandler] = useState(false);
  const [showMessage, setMessage] = useState(null);
  const [verificationLinkMessage, setVerificationLinkMessage] = useState(null);
  const [otpMessage, setOtpMessage] = useState(null);

  const emailHandler = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      setError({ message: "Email id required !" });
      return;
    }

    if (!isValidEmail(email)) {
      setError({ message: "Please enter a valid email address" });
      return;
    }

    setError(null);

    const { message, error } = isVerificationLinkFlow ? await forgotPassword({ email }) : await sendOtp(email);
    if (error) {
      setError(error);
      return;
    }

    if (!isVerificationLinkFlow) {
      setVerificationLinkMessage(false);
      verificationScreenHandler(true);
    } else {
      setVerificationLinkMessage(true);
      setOtpMessage(false);
      setMessage(message);
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 5000);
    }
  };

  const setData = e => {
    const userObj = { ...data };
    const fieldName = e.target.id;
    userObj[fieldName] = e.target.value;
    setOTPData(userObj);
  };

  const changePassword = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (data.otp.trim().length < 5) {
      setError({ message: "Please enter valid otp !" });
      return;
    }

    if (!data.password || !data.confirmPassword) {
      setError({ message: "Password and confirm password can't be empty !" });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError({ message: "Password does not match !" });
      return;
    }

    const resObj = {
      email: email,
      otp: data.otp.trim(),
      "new-password": data.password
    };
    const { message, error } = await resetPassword(resObj);
    if (error) {
      setError(error);
      return;
    }
    setOtpMessage(true);
    verificationScreenHandler(false); // please remove this
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
      activeLoginTab();
    }, 5000);
  };
  if (showVerficationScreen) {
    return (
      <form styleName="malibu-form" key="otp" onSubmit={changePassword}>
        <p styleName="message">Please enter verification code sent to {email} to reset your password.</p>
        <InputField name="Enter OTP" id="otp" type="text" value={data.otp} required onChange={setData} />
        <InputField
          name="Enter Password"
          id="password"
          type="password"
          value={data.password}
          required
          onChange={setData}
        />
        <InputField
          name="Confirm Password"
          id="confirmPassword"
          type="password"
          value={data.confirmPassword}
          required
          onChange={setData}
        />
        {error && <p styleName="error">{error.message}</p>}
        <div styleName="actions">
          <button aria-label="change-password-button" onClick={changePassword} className="malibu-btn-large">
            Verify OTP
          </button>
          <button aria-label="change-password-button" onClick={emailHandler} className="malibu-btn-large">
            Resend OTP
          </button>
        </div>
      </form>
    );
  }
  if (verificationLinkMessage) {
    return <div styleName="success">A password reset link has been sent to your email address.</div>;
  }

  if (otpMessage) {
    return <div styleName="success">{showMessage}</div>;
  }

  return (
    <form styleName="malibu-form" onSubmit={emailHandler}>
      <InputField name="Email" id="email" type="email" onChange={e => setEmail(e.target.value)} required />
      {error && <p styleName="error">{error.message}</p>}
      <div styleName="actions">
        <button aria-label="forgot-password-submit" onClick={emailHandler} className="malibu-btn-large">
          Submit
        </button>
      </div>
    </form>
  );
}

ForgotPassword.propTypes = {
  onClose: func,
  isVerificationLinkFlow: bool,
  activeLoginTab: func
};
