import React, { Fragment, useEffect } from "react";
import PT from "prop-types";
import { useSelector } from "react-redux";
import get from "lodash/get";
import { WithLazy, ResponsiveImage, StoryElement } from "@quintype/components";

import { getAdSlots } from "../ads/utils";

import "./blank.m.css";

function StoryCard(props) {
  return (
    <div styleName="story-card">
      {props.card["story-elements"].map(element => {
        if (element.type === "image" || element.type === "jsembed" || element.type === "youtube-video") {
          return (
            <WithLazy margin="50px">
              {() => <StoryElement element={element} key={element.id} story={props.story} loadIframeOnClick />}
            </WithLazy>
          );
        }
        return <StoryElement element={element} key={element.id} story={props.story} loadIframeOnClick />;
      })}
    </div>
  );
}

StoryCard.propTypes = {
  card: PT.object,
  story: PT.object
};

const BlankStoryTemplate = props => {
  const qtState = useSelector(state => get(state, ["qt"], {}));
  const adsConfig = get(qtState, ["config", "ads-config"], {});
  const enableAds = get(adsConfig, ["dfp_ads", "enable_ads"]);
  const adConfig = get(adsConfig, ["slots", "story_page_ads"], {});
  const loadAdsSynchronously = get(adsConfig, ["dfp_ads", "load_ads_synchronously"], null);

  const showImagePlaceholder = useSelector(state => get(state, ["qt", "config", "showPlaceholder"]));
  const getPlaceholderStyleName = showImagePlaceholder ? "placeholder" : "";

  useEffect(() => {
    if (enableAds) {
      const sectionSlug = get(props, ["story", "sections", 0, "slug"], "NA");
      getAdSlots({
        path: adConfig.ad_unit,
        size: adConfig.sizes,
        id: `story-card-${props.story.id}-ad`,
        qtState,
        viewPortSizeMapping: adConfig.view_port_size_mapping,
        storySectionSlug: sectionSlug,
        refreshAdUnit: true,
        loadAdsSynchronously,
        delayPeriod: 4000
      });
    }
  }, [props.story]);

  return (
    <div className="container">
      <div styleName="wrapper">
        {props.story["hero-image-s3-key"] && (
          <WithLazy margin="20px">
            {() => (
              <figure className="blank-story-image" styleName={`qt-image-16x9 ${getPlaceholderStyleName}`}>
                <ResponsiveImage
                  slug={props.story["hero-image-s3-key"]}
                  metadata={props.story["hero-image-metadata"]}
                  aspectRatio={[16, 9]}
                  defaultWidth={480}
                  widths={[250, 480, 640]}
                  imgParams={{ auto: ["format", "compress"], fmt: "webp" }}
                />
              </figure>
            )}
          </WithLazy>
        )}
        <h1 styleName="headline">{props.story.headline}</h1>
        <div styleName="author"> By {props.story["author-name"]}</div>
        {props.story.cards &&
          props.story.cards.map((card, index) => (
            <Fragment key={index}>
              <StoryCard key={card.id} card={card} story={props.story} />
              {enableAds && index === 0 && (
                <div styleName="ad-slot ad-slot-size-300x250" id={`story-card-${props.story.id}-ad`} />
              )}
            </Fragment>
          ))}
      </div>
    </div>
  );
};

BlankStoryTemplate.propTypes = {
  card: PT.object,
  story: PT.object
};

function BlankStory(props) {
  return (
    <div className="story-grid">
      <BlankStoryTemplate story={props.story} />
    </div>
  );
}

BlankStory.propTypes = {
  story: PT.object
};

export { BlankStory };
