import React from "react";
import { object } from "prop-types";

import "./profile-page.m.css";

const getFields = function(member, keys) {
  const fields = keys.map((key, id) => {
    const label = key[0].toUpperCase().concat(key.slice(1));

    return (
      <p styleName="fields" key={id}>
        <b>{label}: </b>
        {member[key]}
      </p>
    );
  });

  return fields;
};

const ProfileCard = ({ member }) => {
  const keys = ["name", "email"];
  return <div styleName="fields-container">{getFields(member, keys)}</div>;
};

ProfileCard.propTypes = {
  member: object
};

export { ProfileCard };
