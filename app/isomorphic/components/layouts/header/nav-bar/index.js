import React, { Fragment, useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import { Link } from "@quintype/components";

import { OPEN_HAMBURGER_MENU, OPEN_SEARCHBAR, MEMBER_UPDATED } from "../../../store/actions";
import { MenuItem } from "../../menu-item";
import HamburgerMenu from "../../../atoms/hamburger-menu";
import MessageWrapper from "../../../molecules/forms/message-wrapper";

import { getOauthAuthorizeUrl, getAutoSSOUrl } from "@quintype/bridgekeeper-js";
import { SvgIconHandler } from "../../../atoms/svg-icon-hadler";

import "./navbar.m.css";

const NavBar = () => {
  // Import account modal dynamically
  const AccountModal = lazy(() => import("../../../login/AccountModal"));
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showUserHandler, setUserHandler] = useState(false);
  const getState = useSelector(state => state);
  const publisherAttributes = get(getState, ["qt", "config", "publisher-attributes"], {});
  const enableLogin = get(publisherAttributes, ["enableLogin"], true);
  const isHamburgerMenuOpen = get(getState, ["isHamburgerMenuOpen"], false);
  const menu = get(getState, ["qt", "data", "navigationMenu", "homeMenu"], []);
  const hamburgerMenu = get(getState, ["qt", "data", "navigationMenu", "hamburgerMenu"], []);
  const displayStyle = isHamburgerMenuOpen ? "flex" : "none";
  const domainSlug = get(getState, ["qt", "config", "domainSlug"], "");
  const clientId = get(publisherAttributes, ["sso_login", "client_id"], "");
  const redirectUrl = domainSlug
    ? get(publisherAttributes, ["sso_login", "subdomain", domainSlug, "redirect_Url"], "")
    : get(publisherAttributes, ["sso_login", "redirect_Url"], "");

  const ssoLoginIsEnable = get(publisherAttributes, ["sso_login", "is_enable"], false);
  const isAutoSSOEnabled = get(publisherAttributes, ["auto_sso", "is_enable"], false);

  const toggleHandler = () => {
    dispatch({
      type: OPEN_HAMBURGER_MENU,
      isHamburgerMenuOpen: !isHamburgerMenuOpen
    });
    dispatch({
      type: OPEN_SEARCHBAR,
      isSearchBarOpen: false
    });
  };

  const userAccountHandler = () => {
    setUserHandler(!showUserHandler);
    dispatch({
      type: OPEN_SEARCHBAR,
      isSearchBarOpen: false
    });
  };

  const getCurrentUser = async () => {
    // Import current user function only when this function is called
    const { currentUser } = await import("@quintype/bridgekeeper-js");
    try {
      const currentUserResp = await currentUser();
      dispatch({ type: MEMBER_UPDATED, member: get(currentUserResp, ["user"], null) });
      return currentUserResp;
    } catch (err) {
      console.log("error--------", err);
    }
  };

  const logoutHandler = async () => {
    // Import logout on click of the logout button
    const { logout } = await import("@quintype/bridgekeeper-js");
    logout()
      .then(() => {
        dispatch({
          type: MEMBER_UPDATED,
          member: null
        });
      })
      .finally(() => {
        setShowAccountModal(false);
        setUserHandler(false);
      });
  };

  const userBtnClick = () => {
    setShowAccountModal(true);
    dispatch({
      type: OPEN_SEARCHBAR,
      isSearchBarOpen: false
    });
  };

  const getNavbarMenu = menu => {
    return (
      <ul styleName="navbar">
        {menu.length > 0 &&
          menu.map(item => {
            return (
              <li key={item.title} styleName="dropdown">
                <MenuItem
                  item={item}
                  menuStyle="menu-link"
                  toggleHandler={() =>
                    dispatch({
                      type: OPEN_SEARCHBAR,
                      isSearchBarOpen: false
                    })
                  }
                />
              </li>
            );
          })}
      </ul>
    );
  };

  const getDropdownList = () => {
    if (!isHamburgerMenuOpen) {
      return null;
    }
    return (
      <Fragment>
        <div styleName="overlay" onClick={() => toggleHandler()}></div>
        <ul styleName="dropdown-content" style={{ display: displayStyle }}>
          <HamburgerMenu onMenuToggle={() => toggleHandler()} isMegaMenuOpen={isHamburgerMenuOpen} />
          {hamburgerMenu.length > 0 &&
            hamburgerMenu.map(item => {
              return (
                <li key={item.title} styleName="dropdown">
                  <MenuItem menuStyle="menu-link" item={item} toggleHandler={() => toggleHandler()} />
                </li>
              );
            })}
        </ul>
      </Fragment>
    );
  };

  const member = useSelector(state => get(state, ["member"], null));
  const imageUrl = member && member["avatar-url"];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const queryParamExists = queryParams.has("logged_in");

    getCurrentUser().then(({ user }) => {
      if (isAutoSSOEnabled && !user && !queryParamExists) {
        const autoSsoUrl = getAutoSSOUrl(clientId, redirectUrl, window.location.href);
        window.location.replace(autoSsoUrl);
      }
    });

    switch (global.location.hash) {
      case "#email-verified":
        return setMessage("Email verified.");
      case "#token-consumed":
        return setMessage("The verification link is already used.");
      case "#invalid-token":
        return setMessage("The verification link is invalid. Please request for a new link.");
      case "#internal-error":
        return setMessage("Something went wrong. Please try again.");
      default:
        return setMessage(null);
    }
  }, []);

  const userLogin = loading => {
    setLoading(loading);
    if (window) {
      const oauthAuthorizeUrl = getOauthAuthorizeUrl(clientId, redirectUrl, window.location.href);
      window.location.replace(oauthAuthorizeUrl);
    }
  };

  const messageModal = message => {
    // Import modal on message
    const Modal = lazy(() => import("../../../login/modal"));
    return (
      <Suspense fallback={<div></div>}>
        <Modal onClose={() => setMessage(null)}>
          <MessageWrapper message={message} />
        </Modal>
      </Suspense>
    );
  };

  return (
    <div styleName="main-wrapper" id="sticky-navbar">
      <nav className="container" styleName="wrapper">
        {hamburgerMenu.length > 0 ? (
          <div styleName="dropdown">
            <HamburgerMenu onMenuToggle={() => toggleHandler()} isMegaMenuOpen={isHamburgerMenuOpen} />
            {getDropdownList()}
          </div>
        ) : (
          <div />
        )}
        {getNavbarMenu(menu)}

        {enableLogin ? (
          <div styleName="user-profile">
            {member && member["verification-status"] ? (
              <>
                {imageUrl ? (
                  <img
                    width="24"
                    height="24"
                    alt="user"
                    src={imageUrl}
                    styleName="member-img"
                    onClick={userAccountHandler}
                  />
                ) : (
                  <span styleName="member-img" onClick={userAccountHandler}>
                    <SvgIconHandler
                      type="user"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      iconStyle={{ borderRadius: "50%" }}
                      onClick={userAccountHandler}
                    />
                  </span>
                )}
                {showUserHandler && (
                  <Fragment>
                    <div styleName="overlay" onClick={userAccountHandler}></div>
                    <ul styleName="dropdown-content user-account">
                      <Link
                        styleName="user-account-item"
                        callback={() => setUserHandler(!showUserHandler)}
                        href="/profile"
                        aria-label="user-account-item"
                      >
                        Profile
                      </Link>
                      <li styleName="user-account-item" onClick={logoutHandler}>
                        Logout
                      </li>
                    </ul>
                  </Fragment>
                )}
              </>
            ) : (
              <>
                {!ssoLoginIsEnable ? (
                  <button aria-label="User Login Button" styleName="user-btn" onClick={() => userBtnClick()}>
                    <SvgIconHandler type="user-icon" width="18" height="20" viewBox="0 0 18 20" />
                  </button>
                ) : !loading ? (
                  <a styleName="user-btn" onClick={() => userLogin(true)}>
                    <SvgIconHandler type="user-icon" width="18" height="20" viewBox="0 0 18 20" />
                  </a>
                ) : (
                  <span>Loading...</span>
                )}

                {showAccountModal && (
                  <Suspense fallback={<div></div>}>
                    <AccountModal onClose={() => setShowAccountModal(false)} />
                  </Suspense>
                )}
              </>
            )}
          </div>
        ) : (
          <span></span>
        )}
        {message && messageModal(message)}
      </nav>
    </div>
  );
};

export { NavBar };
