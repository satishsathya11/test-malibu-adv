import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import get from "lodash/get";
import { OneColStoryList } from "@quintype/arrow";

import { DfpComponent } from "../ads/dfp-component";
import { getLoadMoreStories } from "../utils";

const SearchPage = props => {
  // will be getting initially 9 stories, but showing only 8 for loadmore functionality
  const adConfig = useSelector(state => get(state, ["qt", "config", "ads-config", "slots", "listing_page_ads"], {}));
  const [storiesToRender, setStoriesToRender] = useState(8);
  const [stories, setStories] = useState(props.data.stories);

  const collection = {
    items: stories.slice(0, storiesToRender)
  };

  const getMoreStories = async (offset, limit) => {
    await getLoadMoreStories({
      offset: offset,
      limit: limit,
      isSearchPage: true,
      slug: props.data.query,
      setStories: setStories,
      storiesToRender: storiesToRender,
      setStoriesToRender: setStoriesToRender,
      stories: stories
    });
  };

  return (
    <div className="container">
      <h1>
        Search - {props.data.query} ({props.data.total} results)
      </h1>
      <OneColStoryList
        collection={collection}
        config={{ buttonText: "Load More", footerButton: "SubsequentLoadCount" }}
        isLoadMoreVisible={stories.length > storiesToRender}
        getMoreStories={getMoreStories}
      />
      <DfpComponent
        adStyleName="ad-slot-size-300x250"
        id="search-page-ad"
        path={adConfig.ad_unit}
        size={adConfig.sizes}
        viewPortSizeMapping={adConfig.view_port_size_mapping}
      />
    </div>
  );
};

SearchPage.propTypes = {
  data: PropTypes.object
};

export { SearchPage };
