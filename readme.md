# Puppeteer Full Page Screenshot

[Puppeteer](https://github.com/GoogleChrome/puppeteer) has the option of taking full page screenshot but it doesn't perform correctly if the page is tall or it contains elements that size relatively to the viewport (ie. `height: 100vh`). To find more information about these issues check [here](https://github.com/GoogleChrome/puppeteer/issues/703) and [here](https://github.com/GoogleChrome/puppeteer/issues/359).

You can use this library to take full page screenshots with puppeteer without worrying about above said issues. It takes multiple screenshots internally then merges them.

## Install

```
# Yarn
yarn add puppeteer-full-page-screenshot

# NPM
npm install puppeteer-full-page-screenshot --save
```

## Usage

```javascript
import puppeteer from 'puppeteer';
import fullPageScreenshot from 'puppeteer-full-page-screenshot';

(async () => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.setViewport({ width: 1920, height: 1080 });
   await page.goto('http://example.com/');

   await fullPageScreenshot(page, { path: './page.png' });

   await browser.close();
})();
```

> **NOTE** As this library scrolls down to take screenshots, sticky elements may appear multiple times on the final image. To fix this issue, you need to add custom styles to reset sticky positioned elements just before taking the screenshot.

## Options

Beside below options, [all Puppeteers page screenshot options](https://pptr.dev/#?product=Puppeteer&version=v10.1.0&show=api-pagescreenshotoptions) are supported.

-  `delay` - Specifies the delay between each internal screenshot in milliseconds.
-  `path` - The file path to save the image to.
