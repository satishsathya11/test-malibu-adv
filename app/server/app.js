/* eslint-disable no-console, no-unused-vars, import/extensions, object-shorthand, global-require */
import createApp from "@quintype/framework/server/create-app";
import { getClient, Collection } from "@quintype/framework/server/api-client";
import logger from "@quintype/framework/server/logger";
import {
  upstreamQuintypeRoutes,
  isomorphicRoutes,
  staticRoutes,
  ampRoutes,
  getWithConfig
} from "@quintype/framework/server/routes";
import { generateRoutes, STATIC_ROUTES } from "./routes";
import { renderLayout } from "./handlers/render-layout";
import { loadData, loadErrorData } from "./load-data";
import { pickComponent } from "../isomorphic/pick-component";
import { generateStaticData, generateStructuredData, SEO } from "@quintype/seo";

export const app = createApp();

upstreamQuintypeRoutes(app, {});

const redirectCollectionHandler = () => async (req, res, next, { client, config }) => {
  const response = await Collection.getCollectionBySlug(client, req.params.collectionSlug, { limit: 20 }, { depth: 2 });
  if (!response) {
    return next();
  }
  const collection = response && response.collection;
  if (collection.template === "section") {
    const sectionId = collection.metadata.section[0].id;
    const section = config.sections.find(section => section.id === sectionId) || {};
    return res.redirect(301, `${section["section-url"]}`);
  }

  if (collection.template === "author") {
    return res.redirect(301, `/author/${req.params.collectionSlug}`);
  }
  return next();
};

const logError = error => logger.error(error);

getWithConfig(app, "/collection/:collectionSlug", redirectCollectionHandler(), {
  logError
});

function returnConfig(req) {
  return getClient(req.hostname)
    .getConfig()
    .then(res => res.config || []);
}

app.get("*", (req, res, next) => {
  if (req.hostname.includes("auth")) {
    const whitelistedUrls = ["user-login", "route-data.json", "manifest.json"];
    const isPathPresent = element => req.params[0].includes(element);
    if (whitelistedUrls.some(isPathPresent)) {
      return next();
    } else {
      returnConfig(req).then(response => {
        const sketchesHost = response["sketches-host"];
        res.redirect(301, sketchesHost);
      });
    }
  } else {
    return next();
  }
});

function generateSeo(config, pageType) {
  return new SEO({
    staticTags: Object.assign(generateStaticData(config)),
    structuredData: Object.assign(generateStructuredData(config), {
      enableLiveBlog: true,
      enableVideo: true,
      enableNewsArticle: true
    }),
    enableTwitterCards: true,
    enableOgTags: true,
    enableNews: true
  });
}

ampRoutes(app, {
  seo: generateSeo
});

isomorphicRoutes(app, {
  appVersion: require("../isomorphic/app-version"),
  logError: error => logger.error(error),
  generateRoutes: generateRoutes,
  loadData: loadData,
  pickComponent: pickComponent,
  renderLayout: renderLayout,
  templateOptions: true,
  loadErrorData: loadErrorData,
  staticRoutes: STATIC_ROUTES,
  seo: generateSeo,
  preloadJs: true,
  oneSignalServiceWorkers: true,
  prerenderServiceUrl: "https://prerender.quintype.io"
});
