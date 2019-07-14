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
    return window.scrollY >= document.body.clientHeight - window.innerHeight;
  });
  return isEnd;
};

const fullPageScreenshot = async (page, options = {}) => {
  const {
    pagesCount,
    extraPixels,
    viewport
  } = await page.evaluate(() => {
    window.scrollTo(0, 0);
    return {
      pagesCount: Math.ceil(document.body.clientHeight / window.innerHeight),
      extraPixels: document.body.clientHeight % window.innerHeight,
      viewport: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    };
  });
  const images = [];

  for (let index = 0; index < pagesCount; index += 1) {
    if (options.delay) {
      await page.waitFor(options.delay);
    }

    const image = await page.screenshot({
      fullPage: false
    });
    await pageDown(page);
    images.push(image);
  }

  if (pagesCount === 1) {
    const image = await _jimp.default.read(images[0]);
    if (options.path) image.write(options.path);
    return image;
  } // crop last image extra pixels


  const cropped = await _jimp.default.read(images.pop()).then(image => image.crop(0, viewport.height - extraPixels, viewport.width, extraPixels)).then(image => image.getBufferAsync(_jimp.default.AUTO));
  images.push(cropped);
  const mergedImage = await (0, _mergeImg.default)(images, {
    direction: true
  });
  if (options.path) mergedImage.write(options.path);
  return mergedImage;
};

var _default = fullPageScreenshot;
exports.default = _default;
//# sourceMappingURL=index.js.map