import React from "react";
import { useSelector } from "react-redux";
import { parseUrl } from "query-string";
import get from "lodash/get";

import AccountModal from "../../login/AccountModal";
import { AppLogo } from "../../layouts/app-logo";

import "./user-login.m.css";

const UserLoginPage = () => {
  const qtConfig = useSelector(state => get(state, ["qt"], {}));
  const publisherAttributes = get(qtConfig, ["config", "publisher-attributes"], {});
  const currentPath = get(qtConfig, ["currentPath"], "");
  const params = parseUrl(currentPath);
  const callbackUrl =
    get(params, ["query", "callback_uri"]) || get(publisherAttributes, ["sso_login", "callback_Url"], "");
  return (
    <div styleName="wrapper">
      <div styleName="header">
        <a href={callbackUrl} styleName="back-btn">
          {" "}
          &#x2190; Back{" "}
        </a>
        <AppLogo width="140" />
      </div>
      <AccountModal isPopup={false} />
    </div>
  );
};

export { UserLoginPage };
