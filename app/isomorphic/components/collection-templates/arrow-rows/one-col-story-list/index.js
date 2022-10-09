import React from "react";
import { OneColStoryList } from "@quintype/arrow";
import { object } from "prop-types";

export const ArrowOneColStoryList = ({ collection }) => {
  const config = {
    buttonText: `${collection.name} News`
  };
  return <OneColStoryList collection={collection} config={config} />;
};

ArrowOneColStoryList.propTypes = {
  collection: object
};

ArrowOneColStoryList.storyLimit = 12;
