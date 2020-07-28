import { Page } from 'puppeteer-core';
import Jimp from 'jimp'

export interface Options {
	path?: string
	delay?: number
}

export default function fullPageScreenshot(page: Page, options?: Options): Jimp