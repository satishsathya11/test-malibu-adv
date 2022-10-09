import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { func, string, object } from "prop-types";
import { register, sendVerificationLink } from "@quintype/bridgekeeper-js";
import get from "lodash/get";
import { parseUrl } from "query-string";

import { InputField } from "../../atoms/InputField";

import "./forms.m.css";

const SignUpBase = ({ onSignup, onLogin, qtConfig, currentPath }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMsg, setError] = useState("");
  const [verficationSuccessMessage, setSuccessMessage] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("/");
  const isVerificationLinkflow = get(qtConfig, ["publisher-attributes", "is_verification_link_flow"], true);
  const ssoLoginIsEnable = get(qtConfig, ["publisher-attributes", "sso_login", "is_enable"], false);

  const signUpHandler = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo.name && !userInfo.email && !userInfo.password) {
      setError("Please provide your name, email and password");
      return;
    } else if (!userInfo.name) {
      setError("Please provide your name");
      return;
    } else if (!userInfo.email) {
      setError("Please provide your email");
      return;
    } else if (!userInfo.password) {
      setError("Please provide password");
      return;
    }

    const userObj = {
      name: userInfo.name,
      email: userInfo.email,
      username: userInfo.email,
      password: userInfo.password,
      "dont-login": true
    };

    try {
      const { user, message } = await register(userObj);
      if (!user && message === "User Already exists") {
        return setUserExists(true);
      }

      if (isVerificationLinkflow) {
        const params = parseUrl(currentPath);
        const callbackUrl = ssoLoginIsEnable
          ? get(params, ["query", "callback_uri"]) ||
            get(qtConfig, ["publisher-attributes", "sso_login", "callback_Url"], "")
          : currentLocation;
        sendVerificationLink(userInfo.email, callbackUrl);
        !userExists &&
          setSuccessMessage(
            `We have sent an activation email to you at ${userInfo.email}. Please check your email inbox.`
          );
      } else {
        onSignup(user);
      }
    } catch (err) {
      if (err.status === 409) {
        setError(`The email '${userObj.email}' already exists`);
      } else {
        setError("Oops! Something went wrong");
      }
    }
  };

  const setData = e => {
    const userObj = { ...userInfo };
    const fieldName = e.target.id;
    userObj[fieldName] = e.target.value;
    setUserInfo(userObj);
  };

  const onVerify = () => {
    if (isVerificationLinkflow) {
      setSuccessMessage("We have resend the verification link");
      return sendVerificationLink(userInfo.email, currentLocation);
    }

    return onSignup(userInfo);
  };

  const onResendVerification = () => {
    sendVerificationLink(userInfo.email, currentLocation);
    setSuccessMessage("We have resend the verification link");
  };

  useEffect(() => {
    setCurrentLocation(window.location.href);
  }, []);

  return (
    <form styleName="malibu-form" onSubmit={signUpHandler}>
      <InputField name="Name" id="name" required onChange={setData} />
      <InputField name="Email" type="email" id="email" onChange={setData} required />
      <InputField name="Password" type="password" id="password" onChange={setData} required />
      {!verficationSuccessMessage && userExists && (
        <p styleName="error">
          The email ID is already registered. Please <button onClick={onVerify}>verify</button> or{" "}
          <button onClick={onLogin}>login</button>.
        </p>
      )}
      {errorMsg && <p styleName="error">{errorMsg}</p>}
      <button aria-label="signup-button" onClick={signUpHandler} className="malibu-btn-large malibu-btn-right">
        Sign up
      </button>
      {verficationSuccessMessage && (
        <>
          <p styleName="message-text">
            {verficationSuccessMessage} If you have not received a email, click{" "}
            <button aria-label="button-resend" onClick={onResendVerification}>
              resend
            </button>{" "}
          </p>
        </>
      )}
    </form>
  );
};

SignUpBase.propTypes = {
  onSignup: func,
  setMember: func,
  onLogin: func,
  qtConfig: object,
  currentPath: string
};

const mapStateToProps = state => ({
  qtConfig: get(state, ["qt", "config"], {}),
  currentPath: get(state, ["qt", "currentPath"], "")
});

export const SignUp = connect(mapStateToProps, null)(SignUpBase);
