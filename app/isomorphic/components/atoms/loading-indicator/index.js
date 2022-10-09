import React from "react";

import { LoadingIndicator } from "@quintype/components";
import { SvgIconHandler } from "../svg-icon-hadler";

import "./loading-indicator.m.css";

const LoadingIndicatorComponent = () => (
  <LoadingIndicator>
    <div styleName="qt-loading-animation">
      <SvgIconHandler type="loading" width="64px" height="64px" />
    </div>
  </LoadingIndicator>
);

export default LoadingIndicatorComponent;
