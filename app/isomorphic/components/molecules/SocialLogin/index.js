import React, { useEffect, useState } from "react";
import { func, string } from "prop-types";
import { withFacebookLogin, withGoogleLogin, withAppleLogin, withLinkedinLogin } from "@quintype/bridgekeeper-js";
import { connect, useSelector } from "react-redux";
import { parseUrl } from "query-string";
import get from "lodash/get";

import Button from "../../atoms/Button";

import { SvgIconHandler } from "../../atoms/svg-icon-hadler";
import "./social-login.m.css";

export const SocialLoginBase = ({ googleAppId, facebookAppId }) => {
  const [redirectUrl, setRedirectUrl] = useState("/");
  const publisherAttributes = useSelector(state => get(state, ["qt", "config", "publisher-attributes"], {}));
  const currentPath = useSelector(state => get(state, ["qt", "currentPath"], ""));
  const ssoLoginIsEnable = get(publisherAttributes, ["sso_login", "is_enable"], false);
  const clientId = get(publisherAttributes, ["sso_login", "client_id"], "");

  useEffect(() => {
    const params = parseUrl(currentPath);
    const getCallbackUrl = get(params, ["query", "callback_uri"], global.location && global.location.origin);
    const getRedirectUrl =
      get(params, ["query", "redirect_uri"]) || get(publisherAttributes, ["sso_login", "redirect_Url"], "");
    const location = new URL(window.location.href);
    const oauthAuthorize = `${location.origin}/api/auth/v1/oauth/authorize?redirect_uri=${getRedirectUrl}&client_id=${clientId}&callback_uri=${getCallbackUrl}&response_type=code`;
    setRedirectUrl(ssoLoginIsEnable ? oauthAuthorize : `${location.origin}${location.pathname}`);
  }, []);

  const FaceBookLogin = () => {
    const { serverSideLoginPath } = withFacebookLogin({
      scope: "email",
      emailMandatory: true,
      redirectUrl: encodeURIComponent(redirectUrl)
    });
    return (
      <Button color="#3b5998" flat href={serverSideLoginPath} socialButton>
        <span styleName="icon">
          <SvgIconHandler type="facebook" iconStyle={{ color: "#3b5998" }} width="9" height="15" viewBox="0 0 12 21" />
        </span>
        Facebook
      </Button>
    );
  };

  const LinkedinLogin = () => {
    const { serverSideLoginPath } = withLinkedinLogin({
      scope: "email",
      emailMandatory: true,
      redirectUrl: encodeURIComponent(redirectUrl)
    });
    return (
      <Button color="#dd4b39" flat href={serverSideLoginPath} socialButton>
        <span styleName="icon">
          <SvgIconHandler type="linkedin" iconStyle={{ color: "#3b5998" }} width="30" height="30" viewBox="0 0 15 20" />
        </span>{" "}
        LinkedIn
      </Button>
    );
  };

  const GoogleLogin = () => {
    const { serverSideLoginPath } = withGoogleLogin({
      scope: "email",
      emailMandatory: true,
      redirectUrl: encodeURIComponent(redirectUrl)
    });
    return (
      <Button color="#dd4b39" flat href={serverSideLoginPath} socialButton>
        <span styleName="icon">
          <SvgIconHandler type="google" width="13" height="13" viewBox="0 0 13 13" />
        </span>{" "}
        Google
      </Button>
    );
  };

  const AppleLogin = () => {
    const { serverSideLoginPath } = withAppleLogin(encodeURIComponent(redirectUrl));
    return (
      <Button color="#dd4b39" flat href={serverSideLoginPath} socialButton>
        <SvgIconHandler type="apple" height="44" width="44" iconStyle={{ color: "#000" }} /> Apple
      </Button>
    );
  };

  return (
    <div styleName="social-login">
      <h3 styleName="title">Or login with</h3>
      <ul styleName="buttons">
        <li styleName="button">
          <FaceBookLogin />
        </li>
        <li styleName="button">
          <GoogleLogin />
        </li>
        <li styleName="button">
          <AppleLogin />
        </li>
        <li styleName="button">
          <LinkedinLogin />
        </li>
      </ul>
    </div>
  );
};

SocialLoginBase.propTypes = {
  getCurrentUser: func,
  googleAppId: string,
  facebookAppId: string
};

const mapStateToProps = state => ({
  googleAppId: get(state, ["qt", "config", "publisher-attributes", "google_app_id"], ""),
  facebookAppId: get(state, ["qt", "config", "publisher-attributes", "facebook_app_id"], "")
});

export const SocialLogin = connect(mapStateToProps, null)(SocialLoginBase);
