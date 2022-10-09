import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SvgIconHandler } from "../../atoms/svg-icon-hadler";
import { ProfileCard } from "./ProfileCard";
import { EditProfile } from "./EditProfile";
import "./profile-page.m.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const member = useSelector(state => state.member || null);

  if (!member) {
    return <div styleName="not-logged-in">Please Login</div>;
  }

  return (
    <div styleName="profile-page">
      <div styleName="my-account">My Account</div>
      <div styleName="profile-card">
        <div styleName="avatar">
          {member["avatar-url"] ? (
            <img src={member["avatar-url"]} alt="avatar" height="160px" width="160px" styleName="avatar-image" />
          ) : (
            <SvgIconHandler type="user" styleName="user-icon" />
          )}
        </div>
        {isEditing ? (
          <EditProfile member={member} setIsEditing={setIsEditing} isEditing={isEditing} />
        ) : (
          <div>
            <ProfileCard member={member} />
            <div styleName="buttons-container">
              <button styleName="button" onClick={() => setIsEditing(!isEditing)}>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProfilePage };
