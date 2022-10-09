import React, { useState } from "react";
import { object, func, bool } from "prop-types";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import { updateUserProfile, signImage, uploadS3ToTemp } from "@quintype/bridgekeeper-js";
import { MEMBER_UPDATED } from "../../store/actions";

import "./profile-page.m.css";

let tempImageKey = null;

const EditProfile = ({ member = {}, setIsEditing, isEditing }) => {
  const [name, setName] = useState(member.name);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const prepareFormData = (keys, imageList, res) => {
    // eslint-disable-next-line no-undef
    const formdata = new FormData();

    keys.forEach(key => {
      key === "file" ? formdata.append(key, imageList[0]) : formdata.append(key, res[key]);
    });

    return formdata;
  };

  const onProfileChange = async event => {
    setIsLoading(true);
    const imageList = event.target.files;

    const signedImage = await signImage(imageList[0].name, imageList[0].type);

    const keys = [
      "key",
      "Content-Type",
      "policy",
      "acl",
      "success_action_status",
      "AWSAccessKeyId",
      "signature",
      "file"
    ];

    const formdata = prepareFormData(keys, imageList, signedImage);

    try {
      const uploadedImage = await uploadS3ToTemp(signedImage.action, formdata);
      if (uploadedImage.status === 201) {
        tempImageKey = signedImage.key;
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitHandler = async e => {
    e.preventDefault();
    const body = { name };

    if (tempImageKey !== null) {
      body["temp-s3-key"] = tempImageKey;
    }

    try {
      const currentUserResp = await updateUserProfile(body);
      dispatch({ type: MEMBER_UPDATED, member: get(currentUserResp, ["user"], null) });
    } catch (error) {
      console.log(error);
    }

    setIsEditing(!isEditing);
  };

  return (
    <div styleName="profile-card">
      <div>
        <div styleName="fields-container">
          <b>Name: </b>
          <input styleName="text-input" name="Name" type="text" value={name} onChange={e => setName(e.target.value)} />
          <b>Profile Pic: </b>
          <input styleName="file-input" name="File" type="file" onChange={onProfileChange} />
          {isLoading ? <div styleName="loading">Loading Image...</div> : <div styleName="loading"></div>}
        </div>
        <div styleName="buttons-container">
          <button styleName="button" onClick={() => setIsEditing(!isEditing)}>
            Cancel
          </button>
          <button styleName="button" onClick={onSubmitHandler}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

EditProfile.propTypes = {
  member: object,
  isEditing: bool,
  setIsEditing: func
};

export { EditProfile };
