import React, { useEffect } from "react";
import { string, array } from "prop-types";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { getAdSlots } from "../utils";

import "./dfp-component.m.css";

const DfpComponent = ({ adStyleName, id, size, path, type = "", viewPortSizeMapping }) => {
  const qtState = useSelector(state => get(state, ["qt"], {}));
  const adsConfig = get(qtState, ["config", "ads-config", "dfp_ads"], {});
  const loadAdsSynchronously = get(adsConfig, ["load_ads_synchronously"], null);
  const enableAds = get(adsConfig, ["enable_ads"], null);
  const currentPath = get(qtState, ["currentPath"], null);
  const delayAdLoad = get(adsConfig, ["delay_ad_load"], 4);

  if (!enableAds) {
    return null;
  }

  useEffect(() => {
    getAdSlots({
      path,
      size,
      id,
      qtState,
      type,
      viewPortSizeMapping,
      loadAdsSynchronously,
      delayPeriod: delayAdLoad * 1000
    });
  }, [currentPath]);

  return <div styleName={`ad-slot ${adStyleName}`} id={id} />;
};

DfpComponent.propTypes = {
  adStyleName: string,
  id: string,
  size: array,
  path: string,
  type: string,
  viewPortSizeMapping: array
};

export { DfpComponent };
