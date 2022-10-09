import React from "react";
import { ElevenStories } from "@quintype/arrow";
import { object } from "prop-types";

export const ArrowElevenStories = ({ collection }) => {
  const config = {
    buttonText: `${collection.name} News`
  };
  return <ElevenStories collection={collection} config={config} />;
};

ArrowElevenStories.propTypes = {
  collection: object
};

ArrowElevenStories.storyLimit = 11;
