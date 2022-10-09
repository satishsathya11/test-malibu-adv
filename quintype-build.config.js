const quintypeBuildConfig = require("@quintype/build/config/quintype-build");

const loadableConfigObj = {
  loadableConfig: {
    entryFiles: {
      topbar: "./app/isomorphic/components/layouts/header",
      navbar: "./app/isomorphic/components/layouts/header/nav-bar",
      footer: "./app/isomorphic/components/layouts/footer",
      arrowElevenStoriesCssChunk: "@quintype/arrow/ElevenStories/styles.arrow.css",
      arrowFourColGridCssChunk: "@quintype/arrow/FourColGrid/styles.arrow.css",
      arrowFourColTwelveStoriesCssChunk: "@quintype/arrow/FourColTwelveStories/styles.arrow.css",
      arrowFullScreenSliderCssChunk: "@quintype/arrow/FullScreenSlider/styles.arrow.css",
      arrowOneColStoryListCssChunk: "@quintype/arrow/OneColStoryList/styles.arrow.css",
      arrowThreeColGridCssChunk: "@quintype/arrow/ThreeColGrid/styles.arrow.css",
      arrowThreeColSevenStoryCssChunk: "@quintype/arrow/ThreeColSevenStory/styles.arrow.css",
      arrowTwoColFourStoriesCssChunk: "@quintype/arrow/TwoColFourStories/styles.arrow.css",
      authorPage: "./app/isomorphic/components/pages/author-page/index.js"
    }
  }
};
const modifiedBuildConfig = { ...quintypeBuildConfig, ...loadableConfigObj };

module.exports = modifiedBuildConfig;
