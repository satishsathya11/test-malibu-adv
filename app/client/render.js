import { renderIsomorphicComponent, renderComponent, renderBreakingNews } from "@quintype/framework/client/start";
import get from "lodash/get";

import { pickComponent } from "../isomorphic/pick-component";
import { BreakingNewsView } from "../isomorphic/components/breaking-news-view";
import { Footer } from "../isomorphic/components/layouts/footer";
import { NavbarSearch } from "../isomorphic/components/layouts/header/navbar-search";
import { NavBar } from "../isomorphic/components/layouts/header/nav-bar";
import { TopAd } from "../isomorphic/components/ads/top-ad";
import { gumletScriptGenerator } from "../isomorphic/components/gumlet-script-generator";
import LoadingIndicatorComponent from "../isomorphic/components/atoms/loading-indicator";

export function preRenderApplication(store) {
  const hydrate = { hydrate: !global.qtLoadedFromShell };
  const breakingNewsConfig = get(store.getState(), ["qt", "config", "publisher-attributes", "breaking_news"], {});
  const pageType = get(store.getState(), ["qt", "pageType"], null);
  const breakingNewsInterval =
    breakingNewsConfig.interval && breakingNewsConfig.interval <= 60 ? 60 : breakingNewsConfig.interval;
  const breakingNewsbaseProps = {
    hydrate,
    updateInterval: breakingNewsInterval * 1000
  };

  if (pageType !== "user-login") {
    global.qtLoadedFromShell && renderComponent(Footer, "footer", store);
    renderComponent(NavbarSearch, "search-bar", store, hydrate);
    renderComponent(NavBar, "nav-bar", store, hydrate);
    breakingNewsConfig.is_enable &&
      pageType !== "profile-page" &&
      renderBreakingNews("breaking-news-container", store, BreakingNewsView, breakingNewsbaseProps);
  }
  renderComponent(LoadingIndicatorComponent, "loading-indicator", store);
}

// This is a separate file as everything from here on is hot reloaded when the app changes
export function renderApplication(store) {
  const enableAds = get(store.getState(), ["qt", "config", "ads-config", "dfp_ads", "enable_ads"]);
  const pageType = get(store.getState(), ["qt", "pageType"], null);
  const placeholderDelay = parseInt(
    get(store.getState(), ["qt", "config", "publisher-attributes", "placeholder_delay"])
  );

  enableAds && pageType !== "profile-page" && pageType !== "user-login" && renderComponent(TopAd, "top-ad", store);
  placeholderDelay && renderComponent(gumletScriptGenerator, "gumlet-script-generator", store);
  renderIsomorphicComponent("container", store, pickComponent, {
    hydrate: !global.qtLoadedFromShell
  });
}
