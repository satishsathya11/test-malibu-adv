import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { DfpComponent } from "./dfp-component";
import { appendGoogleTagServices } from "./utils";

export const TopAd = () => {
  const qtState = useSelector(state => get(state, ["qt"], {}));
  const adsConfig = get(qtState, ["config", "ads-config", "dfp_ads"], {});
  const enableAds = get(adsConfig, ["enable_ads"], null);
  const loadAdsSynchronously = get(adsConfig, ["load_ads_synchronously"], null);
  const currentPath = get(qtState, ["currentPath"], null);
  const pageType = get(qtState, ["pageType"], null);
  const collectionSlug = get(qtState, ["data", "collection", "slug"], null);
  const topAdConfig = get(qtState, ["config", "ads-config", "slots", "top_ad"], {});
  const delayAdScript = get(adsConfig, ["delay_ad_script"], 3);

  useEffect(() => {
    if (enableAds && !loadAdsSynchronously) {
      setTimeout(function() {
        appendGoogleTagServices();
      }, delayAdScript * 1000);
    }
  }, []);

  useEffect(() => {
    if (window.googletag && window.googletag.apiReady) {
      // check if the API is ready
      window.googletag.cmd.push(function() {
        if (window.googletag.pubadsReady) {
          // detect whether PubAdsService is fully loaded
          window.googletag.pubads().refresh();
        }
      });
    }
  }, [currentPath]);

  return (
    <DfpComponent
      adStyleName="ad-slot-size-320x50"
      id={collectionSlug ? `${pageType}-banner-${collectionSlug || ""}-ad` : `${pageType}-banner-ad`}
      path={topAdConfig.ad_unit}
      size={topAdConfig.sizes}
      viewPortSizeMapping={topAdConfig.view_port_size_mapping}
      type="top-ad"
    />
  );
};
