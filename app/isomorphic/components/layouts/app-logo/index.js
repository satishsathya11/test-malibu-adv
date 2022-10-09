import React from "react";
import { Link } from "@quintype/components";
import { string } from "prop-types";

import "./app-logo.m.css";

import { SvgIconHandler } from "../../atoms/svg-icon-hadler/index";

const AppLogo = ({ width = "178" }) => {
  return (
    <Link href="/" aria-label="app-logo">
      <SvgIconHandler type="logo" width="178" height="36" viewBox="0 0 997.64 195.19" />
    </Link>
  );
};

AppLogo.propTypes = {
  width: string
};
export { AppLogo };
