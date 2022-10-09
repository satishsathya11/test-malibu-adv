import React, { useState, useEffect } from "react";
import { resetPasswordWithToken } from "@quintype/bridgekeeper-js";

import { InputField } from "../../atoms/InputField";
import Button from "../../atoms/Button";
import "./reset-password.m.css";

const ResetPasswordPage = () => {
  const [user, setUser] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null); // Store the token which is received in the query params
  const [message, setMessage] = useState(null);
  useEffect(() => {
    // To be called only once during the first load
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get("token") || "";

    if (queryToken) {
      // Set the state if both exists
      setToken(queryToken);
    } else {
      setError("Invalid Request !! Please try again");
    }
  }, []);

  const setData = e => {
    const userObj = { ...user };
    const id = e.target.id;
    userObj[id] = e.target.value;
    setUser(userObj);
  };

  const resetPasswordHandler = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (user.newPassword !== user.confirmPassword) {
      setError("Password does not match !");
      return;
    }
    if (!user.newPassword || !user.confirmPassword) {
      setError("Password cannot be empty !");
      return;
    }
    const reqObj = {
      "new-password": user.newPassword,
      "confirm-password": user.confirmPassword,
      token
    };
    const { error } = await resetPasswordWithToken(reqObj);
    if (error) {
      setError(error.message);
      return;
    }

    // need to open successful popup
    setMessage("The password has been updated. Use the new password to login to your account.");
    setTimeout(() => {
      setMessage(null);
      window.location.href = "/";
    }, 5000);
  };
  return (
    <div styleName="form" key="reset-password">
      <InputField
        name="New Password"
        id="newPassword"
        type="password"
        value={user.newPassword}
        onChange={setData}
        required
        styleName="password"
      />
      <InputField
        name="Confirm Password"
        id="confirmPassword"
        type="password"
        value={user.confirmPassword}
        onChange={setData}
        required
        styleName="password"
      />
      {error && <span styleName="error">{error}</span>}
      <span onClick={e => resetPasswordHandler(e)}>
        <Button styleName="reset-password">Reset Password</Button>
      </span>
      {message && <span styleName="success">{message}</span>}
    </div>
  );
};

export { ResetPasswordPage };
