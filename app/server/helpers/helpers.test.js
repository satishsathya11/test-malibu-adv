import { getArrowCss } from "./index";

describe("getArrowCss helper function", () => {
  it("returns css when 1st row is an arrow row", () => {
    const mockState = getMockState({ makeFirstRowArrow: true });
    const arrowCss = getArrowCss(mockState, { qtAssetHelpers: getMockAssetHelpers() });
    expect(arrowCss).toBe("this is mock css for arrow rows");
  });
  it("returns empty str when 1st row is not an arrow row", () => {
    const mockState = getMockState({ makeFirstRowArrow: false });
    const arrowCss = getArrowCss(mockState, { qtAssetHelpers: getMockAssetHelpers() });
    expect(arrowCss).toBe("");
  });
});

function getMockAssetHelpers() {
  return {
    assetPath: () => true,
    readAsset: asset => {
      switch (asset) {
        case "arrowFourColGridCssChunk.css":
        case "arrowThreeColSevenStoryCssChunk.css":
        case "arrowElevenStoriesCssChunk.css":
          return "this is mock css for arrow rows";
        default:
          throw new Error("value not mocked");
      }
    }
  };
}
function getMockState({ makeFirstRowArrow }) {
  const accumulator = {
    qt: {
      pageType: "home-page",
      data: {
        collection: {
          "updated-at": 1620275952527,
          slug: "home",
          name: "Home",
          template: "default",
          items: [],
          "created-at": 1604464073190,
          metadata: {
            "cover-image": null
          }
        }
      }
    }
  };
  const nonArrowItem = {
    id: 109049,
    "associated-metadata": {
      layout: "FourColGrid"
    },
    type: "collection"
  };
  if (makeFirstRowArrow) {
    accumulator.qt.data.collection.items.push(...getRandomArrowItems(1));
    accumulator.qt.data.collection.items.push(nonArrowItem);
    accumulator.qt.data.collection.items.push(...getRandomArrowItems(3));
    return accumulator;
  } else {
    accumulator.qt.data.collection.items.push(nonArrowItem);
    accumulator.qt.data.collection.items.push(...getRandomArrowItems(3));
    return accumulator;
  }
}

function getRandomArrowItems(count) {
  const arrowTemplates = ["ArrowFourColGrid", "ArrowThreeColSevenStories", "ArrowElevenStories"];
  const accumulator = [];
  for (let i = 0; i < count; i++) {
    accumulator.push({
      id: Math.floor(Math.random() * 1000000),
      "associated-metadata": {
        layout: arrowTemplates[Math.floor(Math.random() * arrowTemplates.length)]
      },
      type: "collection"
    });
  }
  return accumulator;
}
