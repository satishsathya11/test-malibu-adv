import React, { useState } from "react";
import PT from "prop-types";
import { sendOtp, updateWithOtp } from "@quintype/bridgekeeper-js";

import { InputField } from "../../atoms/InputField";

import "./forms.m.css";

const OTP = ({ member }) => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const otpHandler = async e => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await updateWithOtp(otp);

      if (response.status === 200) {
        setSuccessMsg("Verification successful. Please login");
      } else {
        setSuccessMsg("Error while processing OTP. Please try again!");
      }
    } catch (err) {
      setError(true);
      console.warn("error", error);
    }
  };

  const setData = e => {
    setOTP(e.target.value);
  };

  const resendOTP = async () => {
    try {
      await sendOtp(member.email);
      setSuccessMsg("OTP Sent to your registered email");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <React.Fragment>
      <p styleName="otp-text">
        A One Time Password code was sent via email to <span>{member.email}</span>
      </p>
      <form styleName="malibu-form" onSubmit={otpHandler}>
        <InputField name="Enter OTP" id="otp" type="text" required onChange={setData} />
        {error && <p styleName="error">Invalid OTP</p>}
        {successMsg && <p>{successMsg}</p>}
        <div styleName="actions">
          <button aria-label="verify-otp-button" onClick={otpHandler} className="malibu-btn-large">
            Verify OTP
          </button>
          <p styleName="resend-otp" onClick={resendOTP}>
            Resend OTP
          </p>
        </div>
      </form>
    </React.Fragment>
  );
};

OTP.propTypes = {
  member: PT.object
};

export { OTP };
