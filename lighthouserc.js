const url = `https://${process.env.LH_USER}:${process.env.LH_PASSWORD}@lighthouse-ci.staging.quinpress.com/`;
const lhciConfig = {
  ci: {
    collect: {
      numberOfRuns: 5,
      additive: false, // Skips clearing of previous collect data
      headful: false, // Run with a headful Chrome
      url: JSON.parse(process.env.LHCI_SITES), // A URL to run Lighthouse on
      settings: {
        emulatedFormFactor: "mobile",
      },
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "unused-javascript": "warn",
        "heading-order": "off", // Heading elements are not in a sequentially-descending order
        "is-crawlable": "warn",
        "tap-targets": "warn", // Tap targets are the areas of a web page that users on touch devices can interact with. Buttons, links, and form elements all have tap targets.
        "uses-responsive-images": "warn",
        "errors-in-console": "warn", // Browser errors were logged to the console
        "uses-text-compression": "warn",
        "uses-optimized-images": "warn",
        "no-unload-listeners": "off",
        "no-document-write": "warn", // Avoid `document.write()`
        "link-name": "warn",
        "image-size-responsive": "warn",
        "image-aspect-ratio": "warn",
        "button-name": "warn", // It suggests that the button should have inner text content or an aria-label or aria-labelledBy.
        "categories:performance": ["error", { minScore: 0.6 }], // this should be 0.7. Change to 0.7 once perf fixes are done
        "image-alt": "warn",
        "link-text": "warn",
        "unsized-images": "warn",
      },
    },
    upload: {
      target: "lhci",
      serverBaseUrl: url,
      token: `${process.env.LH_BUILD_TOKEN}`,
    },
  },
};

module.exports = lhciConfig;

// Note: Below are the points that are affecting our current scores.
// bootup-time: js execution time
// first-cpu-idle: First CPU Idle is deprecated in Lighthouse 6.0 (but is similar to time to interactive)
// heading-order: Heading elements are not in a sequentially-descending order
// interactive: Time to Interactive
// mainthread-work-breakdown: Main thread execution
// max-potential-fid: First input delay
// no-document-write: Avoid `document.write()`
// no-unload-listeners: Timetaken by event listeners
// button-name: It suggests that the button should have inner text content or an aria-label or aria-labelledBy.
// image-alt: Image elements do not have `[alt]` attributes
// link-name: Links do not have a discernible name
// link-text: Links do not have descriptive text
