"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mergeImg = _interopRequireDefault(require("merge-img"));

var _jimp = _interopRequireDefault(require("jimp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */

/* eslint-disable no-await-in-loop */
const pageDown = async page => {
  const isEnd = await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
    return window.scrollY >= document.documentElement.scrollHeight - window.innerHeight;
  });
  return isEnd;
};

const defaultOptions = {
  fullPage: false,
  captureBeyondViewport: false,
  type: 'png',
  delay: 0
};

const fullPageScreenshot = async (page, options = {}) => {
  const {
    pagesCount,
    extraPixels,
    viewport
  } = await page.evaluate(() => {
    window.scrollTo(0, 0);
    const pageHeight = document.documentElement.scrollHeight;
    return {
      pagesCount: Math.ceil(pageHeight / window.innerHeight),
      extraPixels: pageHeight % window.innerHeight * window.devicePixelRatio,
      viewport: {
        height: window.innerHeight * window.devicePixelRatio,
        width: window.innerWidth * window.devicePixelRatio
      }
    };
  });
  const {
    path,
    delay,
    ...pptrScreenshotOptions
  } = { ...defaultOptions,
    ...options
  };
  const images = [];

  for (let index = 0; index < pagesCount; index += 1) {
    if (delay) {
      await page.waitForTimeout(delay);
    }

    const image = await page.screenshot(pptrScreenshotOptions);
    await pageDown(page);
    images.push(image);
  }

  if (pagesCount === 1) {
    const image = await _jimp.default.read(images[0]);
    if (path) image.write(path);
    return image;
  } // crop last image extra pixels


  const cropped = await _jimp.default.read(images.pop()).then(image => image.crop(0, viewport.height - extraPixels, viewport.width, extraPixels)).then(image => image.getBufferAsync(_jimp.default.AUTO));
  images.push(cropped);
  const mergedImage = await (0, _mergeImg.default)(images, {
    direction: true
  });

  if (path) {
    await new Promise(resolve => {
      mergedImage.write(path, () => {
        resolve();
      });
    });
  }

  return mergedImage;
};

var _default = fullPageScreenshot;
exports.default = _default;
//# sourceMappingURL=index.js.map