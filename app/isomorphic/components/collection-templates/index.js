import React from "react";
import { wrapCollectionLayout, EagerLoadImages } from "@quintype/components";
import { FourColGrid } from "./four-col-grid";
import {
  ArrowElevenStories,
  ArrowFourColGrid,
  ArrowFourColTwelveStories,
  ArrowFullScreenSlider,
  ArrowOneColStoryList,
  ArrowThreeColGrid,
  ArrowThreeColSevenStories,
  ArrowTwoColFourStories
} from "./arrow-rows";

// This should not be needed anymore as we are using Gumlet
function wrapEager(f) {
  const wrappedComponent = function WrapEager(props) {
    if (props.index === 0) {
      return (
        <EagerLoadImages predicate={token => token === "above-fold"}>{React.createElement(f, props)}</EagerLoadImages>
      );
    } else {
      return React.createElement(f, props);
    }
  };

  if (f.storyLimit) {
    wrappedComponent.storyLimit = f.storyLimit;
  }

  if (f.nestedCollectionLimit) {
    wrappedComponent.nestedCollectionLimit = f.nestedCollectionLimit;
  }

  return wrappedComponent;
}

export default {
  FourColGrid: wrapEager(wrapCollectionLayout(FourColGrid)),
  ArrowFourColTwelveStories: wrapEager(wrapCollectionLayout(ArrowFourColTwelveStories)),
  ArrowThreeColGrid: wrapEager(wrapCollectionLayout(ArrowThreeColGrid)),
  ArrowFourColGrid: wrapEager(wrapCollectionLayout(ArrowFourColGrid)),
  ArrowElevenStories: wrapEager(wrapCollectionLayout(ArrowElevenStories)),
  ArrowTwoColFourStories: wrapEager(wrapCollectionLayout(ArrowTwoColFourStories)),
  ArrowFullScreenSlider: wrapEager(wrapCollectionLayout(ArrowFullScreenSlider)),
  ArrowOneColStoryList: wrapEager(wrapCollectionLayout(ArrowOneColStoryList)),
  ArrowThreeColSevenStories: wrapEager(wrapCollectionLayout(ArrowThreeColSevenStories)),
  defaultTemplate: wrapEager(wrapCollectionLayout(FourColGrid))
};
