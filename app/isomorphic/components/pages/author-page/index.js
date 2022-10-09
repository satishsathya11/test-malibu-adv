import React, { useState } from "react";
import { object, shape } from "prop-types";
import { useSelector } from "react-redux";
import get from "lodash/get";
import { AuthorIntroductionCard, ThreeColGrid } from "@quintype/arrow";
import { getLoadMoreStories } from "../../utils";

import { DfpComponent } from "../../ads/dfp-component";

import "./author.m.css";

export const AuthorPage = props => {
  const adConfig = useSelector(state => get(state, ["qt", "config", "ads-config", "slots", "listing_page_ads"], {}));
  const authorCollection = get(props, ["data", "authorCollection"], {});
  const [storiesToRender, setStoriesToRender] = useState(6);
  const [authorPageStories, setStories] = useState(authorCollection.items);

  const authorCollectionStories = {
    items: authorPageStories.slice(0, storiesToRender)
  };

  const authorIntrCardConfig = {
    enableBio: true,
    enableSocialLinks: true
  };

  const getMoreStories = async (offset, limit) => {
    await getLoadMoreStories({
      offset: offset,
      limit: 6,
      authorId: props.data.author.id,
      slug: props.data.query,
      setStories: setStories,
      storiesToRender: storiesToRender,
      setStoriesToRender: setStoriesToRender,
      stories: authorPageStories
    });
  };

  return (
    <div className="container" styleName="wrapper">
      <AuthorIntroductionCard data={props.data.author} config={authorIntrCardConfig} />
      {authorCollectionStories.items.length > 0 ? (
        <ThreeColGrid
          collection={authorCollectionStories}
          config={{ buttonText: "Load More", footerButton: "SubsequentLoadCount", showAuthor: false, showTime: false }}
          isLoadMoreVisible={authorCollection["total-count"] > authorPageStories.length}
          getMoreStories={getMoreStories}
        />
      ) : (
        <h1 styleName="text-info">No stories found!</h1>
      )}
      <DfpComponent
        adStyleName="ad-slot-size-300x250"
        id="author-page-ad"
        path={adConfig.ad_unit}
        size={adConfig.sizes}
        viewPortSizeMapping={adConfig.view_port_size_mapping}
      />
    </div>
  );
};

AuthorPage.propTypes = {
  data: shape({
    author: object,
    authorCollection: object
  })
};
