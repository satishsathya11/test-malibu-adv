import React from "react";
import { FourColTwelveStories } from "@quintype/arrow";
import { object } from "prop-types";

export const ArrowFourColTwelveStories = ({ collection }) => {
  const config = {
    buttonText: `${collection.name} News`
  };
  return <FourColTwelveStories collection={collection} config={config} />;
};

ArrowFourColTwelveStories.propTypes = {
  collection: object
};

ArrowFourColTwelveStories.storyLimit = 12;
