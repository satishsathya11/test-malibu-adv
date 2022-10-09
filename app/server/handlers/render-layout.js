/* eslint-disable object-shorthand */
import serialize from "serialize-javascript";
import { assetPath, readAsset, getAllChunks } from "@quintype/framework/server/asset-helper";
import { renderReduxComponent, renderLoadableReduxComponent } from "@quintype/framework/server/render";
import { getChunkName } from "../../isomorphic/pick-component";
import { Header } from "../../isomorphic/components/layouts/header";
import { NavBar } from "../../isomorphic/components/layouts/header/nav-bar";
import { Footer } from "../../isomorphic/components/layouts/footer";
import fontFace from "../font";
import { BreakingNewsView } from "../../isomorphic/components/breaking-news-view";
import { TopAd } from "../../isomorphic/components/ads/top-ad";
import { getConfig, extractor, getCriticalCss, getArrowCss } from "../helpers";
import get from "lodash.get";

const cssContent = assetPath("app.css") ? readAsset("app.css") : "";
const fontJsContent = assetPath("font.js") ? readAsset("font.js") : "";
const allChunks = getAllChunks("list", "story", "home");

export async function renderLayout(res, params) {
  const {
    gtmId,
    gaId,
    cdnImage,
    isOnesignalEnable,
    isGtmEnable,
    isGaEnable,
    enableAds,
    loadAdsSynchronously,
    pageType
  } = getConfig(params.store.getState());
  const chunk = params.shell ? null : allChunks[getChunkName(params.pageType)];
  const criticalCss = await getCriticalCss();
  const arrowCss = await getArrowCss(params.store.getState());

  const placeholderDelay = parseInt(
    get(params.store.getState(), ["qt", "config", "publisher-attributes", "placeholder_delay"])
  );

  res.render(
    "pages/layout",
    Object.assign(
      {
        assetPath: assetPath,
        content: params.content || "",
        cssContent: cssContent,
        criticalCss: criticalCss,
        arrowCss,
        fontJsContent: fontJsContent,
        fontFace: fontFace,
        contentTemplate: null,
        title: params.title,
        topbar: renderLoadableReduxComponent(Header, params.store, extractor),
        navbar: renderLoadableReduxComponent(NavBar, params.store, extractor),
        footer: renderLoadableReduxComponent(Footer, params.store, extractor),
        topad: renderReduxComponent(TopAd, params.store),
        breakingNews: renderReduxComponent(BreakingNewsView, params.store, {
          breakingNews: [],
          breakingNewsLoaded: false
        }),
        disableAjaxNavigation: false,
        gtmId,
        gaId,
        cdnImage,
        metaTags: params.seoTags ? params.seoTags.toString() : "",
        pageChunk: chunk,
        store: params.store,
        shell: params.shell,
        serialize,
        isGtmEnable,
        isGaEnable,
        isOnesignalEnable,
        oneSignalScript: params.oneSignalScript,
        enableAds: enableAds && params.pageType !== "profile-page",
        loadAdsSynchronously,
        placeholderDelay,
        pageType,
        enableBreakingNews: params.pageType !== "profile-page"
      },
      params
    )
  );
}
