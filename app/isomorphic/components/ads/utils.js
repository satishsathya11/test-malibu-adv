import get from "lodash/get";

const getSectionSlug = (state, pageType) => {
  if (pageType === "story-page") {
    return get(state, ["data", "story", "sections", 0, "slug"], "NA");
  } else if (pageType === "section-page") {
    return get(state, ["data", "section", "slug"], "NA");
  }
  return "NA";
};

const getSectionId = (state, pageType) => {
  if (pageType === "story-page") {
    return get(state, ["data", "story", "sections", 0, "id"], "NA");
  } else if (pageType === "section-page") {
    return get(state, ["data", "section", "id"], "NA");
  }
  return "NA";
};

const getStoryId = (state, pageType) => {
  if (pageType === "story-page") {
    return get(state, ["data", "story", "id"], "NA");
  }
  return "NA";
};

const getSectionList = (state, pageType) => {
  if (pageType === "story-page") {
    const sections = get(state, ["data", "story", "sections"], []);
    const sectionList = sections.map(item => item.name);
    return sectionList;
  }

  return [];
};

const getTagList = (state, pageType) => {
  if (pageType === "story-page") {
    const tags = get(state, ["data", "story", "tags"], []);
    const tagList = tags.map(item => item.name);
    return tagList;
  }

  return [];
};

export const setViewportSizeMapping = (adSlot, googletag, viewPortSizeMapping) => {
  const mapping = googletag
    .sizeMapping()
    .addSize(viewPortSizeMapping[0].viewport, viewPortSizeMapping[0].sizes)
    .addSize(viewPortSizeMapping[1].viewport, viewPortSizeMapping[1].sizes)
    .build();

  adSlot.defineSizeMapping(mapping);
};

export const generateLazyLoading = (googletag, fetchMarginPercent, renderMarginPercent, mobileScaling) => {
  const updateSlotStatus = (slotId, state) => {
    var elem = document.getElementById(slotId + "-" + state);
    if (elem) {
      elem.className = "activated";
      elem.innerText = "Yes";
    }
  };

  if (googletag && googletag.pubadsReady) {
    // detect whether PubAdsService is fully loaded
    googletag.pubads().enableLazyLoad({
      fetchMarginPercent, // Fetch slots within specified viewports
      renderMarginPercent, // Render slots within specified viewports
      mobileScaling // Multiplies the specified value with the above values for mobile
    });

    googletag.pubads().addEventListener("slotRequested", function(event) {
      updateSlotStatus(event.slot.getSlotElementId(), "fetched");
    });

    googletag.pubads().addEventListener("slotOnload", function(event) {
      updateSlotStatus(event.slot.getSlotElementId(), "rendered");
    });
  }
};

export const setTargetingParams = (googletag, adSlot, qtState, storySectionSlug) => {
  const pageType = get(qtState, ["pageType"], "");
  const environment = get(qtState, ["config", "publisher-attributes", "env"], "");
  const sectionSlug = storySectionSlug || getSectionSlug(qtState, pageType);
  const sectionId = getSectionId(qtState, pageType);
  const storyId = getStoryId(qtState, pageType);
  const sectionList = getSectionList(qtState, pageType);
  const tagList = getTagList(qtState, pageType);

  adSlot
    .addService(googletag.pubads())
    .setTargeting("pageType", pageType)
    .setTargeting("environment", environment)
    .setTargeting("sectionSlug", sectionSlug)
    .setTargeting("sectionId", sectionId)
    .setTargeting("storyId", storyId)
    .setTargeting("sectionList", sectionList)
    .setTargeting("tagList", tagList);
};

export const useDfpSlot = ({ path, size, id, qtState, viewPortSizeMapping, storySectionSlug, refreshAdUnit }) => {
  if (refreshAdUnit && window.googletag && window.googletag.apiReady) {
    // check if the API is ready
    window.googletag.cmd.push(function() {
      if (window.googletag.pubadsReady) {
        // detect whether PubAdsService is fully loaded
        const existingSlot = window.googletag
          .pubads()
          .getSlots()
          .filter(item => id === item.getSlotElementId());

        window.googletag.pubads().refresh(existingSlot);
      }
    });
  }

  window.googletag.cmd.push(function() {
    const responsiveAdSlot = window.googletag.defineSlot(path, size, id);
    const adsConfig = get(qtState, ["config", "ads-config", "dfp_ads"], {});
    const enableLazyLoadAds = get(adsConfig, ["enable_lazy_load_ads"]);
    const fetchMarginPercent = get(adsConfig, ["fetch_margin_percent"], 0);
    const renderMarginPercent = get(adsConfig, ["render_margin_percent"], 0);
    const mobileScaling = get(adsConfig, ["mobile_scaling"], 0);

    if (responsiveAdSlot) {
      setTargetingParams(window.googletag, responsiveAdSlot, qtState, storySectionSlug);
      setViewportSizeMapping(responsiveAdSlot, window.googletag, viewPortSizeMapping);
      if (enableLazyLoadAds) {
        generateLazyLoading(window.googletag, fetchMarginPercent, renderMarginPercent, mobileScaling);
      }
      window.googletag.enableServices();
    }
  });

  window.googletag.cmd.push(function() {
    window.googletag.display(id);
  });
};

export const appendGoogleTagServices = () => {
  const script = document.createElement("script");
  const isSSL = document.location.protocol === "https:";
  script.src = (isSSL ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js";
  const node = document.getElementsByTagName("script")[0];
  script.setAttribute("async", "");
  node.parentNode.insertBefore(script, node);
};

export const getAdSlots = ({
  path,
  size,
  id,
  qtState,
  type,
  viewPortSizeMapping,
  storySectionSlug,
  loadAdsSynchronously,
  delayPeriod,
  refreshAdUnit
}) => {
  if (loadAdsSynchronously) {
    useDfpSlot({
      path: path,
      size: size,
      id: id,
      qtState: qtState,
      type: type,
      viewPortSizeMapping: viewPortSizeMapping,
      storySectionSlug,
      refreshAdUnit
    });
  } else {
    setTimeout(() => {
      useDfpSlot({
        path: path,
        size: size,
        id: id,
        qtState: qtState,
        type: type,
        viewPortSizeMapping: viewPortSizeMapping,
        storySectionSlug,
        refreshAdUnit
      });
    }, delayPeriod);
  }
};
